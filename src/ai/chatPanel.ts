import * as vscode from 'vscode';
import { AI_CHAT_MAX_HISTORY, COMMANDS, SETTINGS } from '../constants';
import { AIStreamAbortedError } from '../errors';
import { McpClient } from '../mcp/mcpClient';
import { extractMcpToolCalls } from '../mcp/toolCallParser';
import type { McpToolCall } from '../types';
import { Logger } from '../utils/logger';
import {
  asNumber,
  asRecord,
  asString,
  hasType
} from '../utils/webviewMessages';
import { AIProviderRegistry } from './aiProvider';
import { getActiveAiContext } from './context';
import {
  buildSystemPrompt,
  DEFAULT_AI_LANGUAGE,
  normalizeAiLanguage
} from './prompts';
import { createNonce } from '../utils/nonce';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  toolCalls?: McpToolCall[];
  applied?: boolean;
}

const CHAT_HISTORY_KEY = 'kicadstudio.aiChat.history';
const CHAT_PANEL_MESSAGE_TYPES = [
  'send',
  'cancel',
  'clear',
  'ready',
  'selectionChanged',
  'applyToolCalls',
  'ignoreToolCalls',
  'openSettings'
];

/**
 * Multi-turn AI chat panel for KiCad Studio.
 */
export class KiCadChatPanel implements vscode.Disposable {
  public static readonly viewType = 'kicadstudio.aiChat';
  private static instance: KiCadChatPanel | undefined;

  private readonly panel: vscode.WebviewPanel;
  private readonly history: ChatMessage[] = [];
  private readonly disposables: vscode.Disposable[] = [];
  private abortController: AbortController | undefined;
  private busy = false;
  private selectedProvider: string;
  private selectedModel: string;
  private disposed = false;

  static createOrShow(
    context: vscode.ExtensionContext,
    providers: AIProviderRegistry,
    logger: Logger,
    mcpClient?: McpClient
  ): KiCadChatPanel {
    if (KiCadChatPanel.instance) {
      KiCadChatPanel.instance.panel.reveal(vscode.ViewColumn.Beside);
      void KiCadChatPanel.instance.postHydrate();
      return KiCadChatPanel.instance;
    }

    const panel = vscode.window.createWebviewPanel(
      KiCadChatPanel.viewType,
      'KiCad AI Chat',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
      }
    );

    const instance = new KiCadChatPanel(
      context,
      panel,
      providers,
      logger,
      mcpClient
    );
    KiCadChatPanel.instance = instance;
    context.subscriptions.push(instance);
    return instance;
  }

  private constructor(
    private readonly context: vscode.ExtensionContext,
    panel: vscode.WebviewPanel,
    private readonly providers: AIProviderRegistry,
    private readonly logger: Logger,
    private readonly mcpClient?: McpClient
  ) {
    this.panel = panel;
    const selection = providers.getSelection();
    this.selectedProvider = selection.provider;
    this.selectedModel = selection.model;
    this.history.push(...this.loadHistory());
    this.panel.webview.html = this.buildHtml();
    this.disposables.push(
      this.panel.onDidDispose(() => this.handleDisposed()),
      this.panel.webview.onDidReceiveMessage(
        (message: unknown) => void this.handleMessage(message)
      ),
      vscode.window.onDidChangeActiveTextEditor(
        () => void this.postContextInfo()
      ),
      vscode.workspace.onDidSaveTextDocument(() => void this.postContextInfo())
    );
  }

  async submitPrompt(
    prompt: string,
    extraContext: string,
    selection?: { provider?: string; model?: string }
  ): Promise<void> {
    this.panel.reveal(vscode.ViewColumn.Beside);
    if (selection?.provider) {
      this.selectedProvider = selection.provider;
    }
    if (typeof selection?.model === 'string') {
      this.selectedModel = selection.model;
    }
    await this.runPrompt(prompt, extraContext);
  }

  private async handleMessage(message: unknown): Promise<void> {
    if (!hasType(message, CHAT_PANEL_MESSAGE_TYPES)) {
      return;
    }

    const record = asRecord(message) ?? {};
    if (message.type === 'ready') {
      await this.postHydrate();
      return;
    }

    if (message.type === 'selectionChanged') {
      const provider = asString(record['provider']);
      const model = asString(record['model']);
      if (provider) {
        this.selectedProvider = provider;
      }
      if (typeof model === 'string') {
        this.selectedModel = model;
      }
      return;
    }

    if (message.type === 'cancel') {
      this.abortController?.abort(new AIStreamAbortedError());
      return;
    }

    if (message.type === 'clear') {
      this.history.length = 0;
      await this.persistHistory();
      await this.postHydrate();
      return;
    }

    if (message.type === 'applyToolCalls') {
      const timestamp = asNumber(record['timestamp']);
      if (timestamp !== undefined) {
        await this.applyToolCalls(timestamp);
      }
      return;
    }

    if (message.type === 'ignoreToolCalls') {
      const timestamp = asNumber(record['timestamp']);
      if (timestamp !== undefined) {
        const target = this.history.find(
          (entry) => entry.timestamp === timestamp
        );
        if (target) {
          target.applied = true;
          await this.persistHistory();
          await this.panel.webview.postMessage({
            type: 'assistantReplace',
            message: target
          });
        }
      }
      return;
    }

    if (message.type === 'openSettings') {
      await vscode.commands.executeCommand(COMMANDS.setAiApiKey);
      return;
    }

    if (message.type === 'send') {
      const prompt = asString(record['prompt'])?.trim();
      const context = asString(record['context']) ?? '';
      if (prompt) {
        await this.runPrompt(prompt, context);
      }
    }
  }

  private async runPrompt(prompt: string, extraContext: string): Promise<void> {
    if (this.busy) {
      this.abortController?.abort(new AIStreamAbortedError());
    }

    const provider = await this.providers.getProviderForSelection(
      this.selectedProvider,
      this.selectedModel
    );
    if (!provider?.isConfigured()) {
      void vscode.window.showWarningMessage(
        'AI provider is not configured. Choose a provider and store an API key first.'
      );
      await this.postStatus('AI provider is not configured.');
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: prompt,
      timestamp: Date.now()
    };
    this.history.push(userMessage);
    this.trimHistory();
    await this.persistHistory();
    await this.panel.webview.postMessage({
      type: 'appendMessage',
      message: userMessage
    });

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: Date.now() + 1
    };
    this.history.push(assistantMessage);
    this.trimHistory();
    await this.persistHistory();
    await this.panel.webview.postMessage({
      type: 'appendMessage',
      message: assistantMessage
    });

    const activeContext = getActiveAiContext();
    const aiLanguage = normalizeAiLanguage(
      vscode.workspace
        .getConfiguration()
        .get<string>(SETTINGS.aiLanguage, DEFAULT_AI_LANGUAGE)
    );
    const conversation = this.buildConversationMessages()
      .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
      .join('\n\n');
    const context = [
      activeContext.description,
      extraContext ? `Additional context:\n${extraContext}` : '',
      activeContext.documentPreview
        ? `Document preview:\n${activeContext.documentPreview}`
        : '',
      conversation ? `Conversation history:\n${conversation}` : ''
    ]
      .filter(Boolean)
      .join('\n\n');
    const mcpState = this.mcpClient
      ? await this.mcpClient.testConnection()
      : undefined;
    const systemPrompt = buildSystemPrompt(aiLanguage, {
      ...activeContext.projectContext,
      mcpConnected: mcpState?.connected
    });

    this.busy = true;
    this.abortController = new AbortController();
    await this.panel.webview.postMessage({ type: 'busy', busy: true });
    await this.postStatus(`Streaming response from ${provider.name}...`);

    try {
      if (provider.analyzeStream) {
        await provider.analyzeStream(
          prompt,
          context,
          systemPrompt,
          async (chunk) => {
            assistantMessage.content += chunk;
            await this.panel.webview.postMessage({
              type: 'assistantChunk',
              timestamp: assistantMessage.timestamp,
              text: chunk
            });
          },
          this.abortController.signal
        );
      } else {
        assistantMessage.content = await provider.analyze(
          prompt,
          context,
          systemPrompt
        );
      }
      assistantMessage.toolCalls = extractMcpToolCalls(
        assistantMessage.content
      );
      await this.panel.webview.postMessage({
        type: 'assistantReplace',
        message: assistantMessage
      });
      await this.postStatus(`Response complete from ${provider.name}.`);
    } catch (error) {
      if (
        error instanceof AIStreamAbortedError ||
        this.abortController.signal.aborted
      ) {
        await this.postStatus('Streaming stopped.');
        if (!assistantMessage.content.trim()) {
          const index = this.history.indexOf(assistantMessage);
          if (index >= 0) {
            this.history.splice(index, 1);
          }
        }
      } else {
        const message = error instanceof Error ? error.message : String(error);
        assistantMessage.content = message;
        await this.panel.webview.postMessage({
          type: 'assistantReplace',
          message: assistantMessage
        });
        this.logger.error('AI chat request failed', error);
        void vscode.window.showErrorMessage(message);
      }
    } finally {
      this.busy = false;
      this.abortController = undefined;
      this.trimHistory();
      await this.persistHistory();
      await this.panel.webview.postMessage({ type: 'busy', busy: false });
    }
  }

  private buildConversationMessages(): Array<{
    role: string;
    content: string;
  }> {
    return this.history.slice(-AI_CHAT_MAX_HISTORY).map((message) => ({
      role: message.role,
      content: message.content
    }));
  }

  private loadHistory(): ChatMessage[] {
    const stored = this.context.workspaceState.get<ChatMessage[]>(
      CHAT_HISTORY_KEY,
      []
    );
    return stored.filter(
      (message) =>
        (message.role === 'user' || message.role === 'assistant') &&
        typeof message.content === 'string' &&
        typeof message.timestamp === 'number'
    );
  }

  private async persistHistory(): Promise<void> {
    await this.context.workspaceState.update(
      CHAT_HISTORY_KEY,
      this.history.slice(-AI_CHAT_MAX_HISTORY)
    );
  }

  private trimHistory(): void {
    while (this.history.length > AI_CHAT_MAX_HISTORY) {
      this.history.shift();
    }
  }

  private async postHydrate(): Promise<void> {
    await this.panel.webview.postMessage({
      type: 'hydrate',
      history: this.history,
      provider: this.selectedProvider,
      model: this.selectedModel,
      busy: this.busy,
      contextInfo: getActiveAiContext().description
    });
  }

  private async postContextInfo(): Promise<void> {
    if (this.disposed) {
      return;
    }
    await this.panel.webview.postMessage({
      type: 'contextInfo',
      text: getActiveAiContext().description
    });
  }

  private async postStatus(text: string): Promise<void> {
    await this.panel.webview.postMessage({ type: 'status', text });
  }

  private async applyToolCalls(timestamp: number): Promise<void> {
    const target = this.history.find((entry) => entry.timestamp === timestamp);
    if (!target?.toolCalls?.length) {
      return;
    }
    if (!this.mcpClient) {
      void vscode.window.showWarningMessage(
        'MCP client is not available in this session.'
      );
      return;
    }

    const previews = await Promise.all(
      target.toolCalls.map(async (toolCall) => {
        try {
          return `${toolCall.name}: ${await this.mcpClient?.previewToolCall(toolCall)}`;
        } catch {
          return `${toolCall.name}: preview unavailable`;
        }
      })
    );

    const choice = await vscode.window.showInformationMessage(
      `Apply ${target.toolCalls.length} MCP tool call(s)?\n\n${previews.join('\n')}`,
      'Apply',
      'Cancel'
    );
    if (choice !== 'Apply') {
      return;
    }

    for (const toolCall of target.toolCalls) {
      await this.mcpClient.callTool(toolCall.name, toolCall.arguments);
    }

    target.applied = true;
    await this.persistHistory();
    await this.panel.webview.postMessage({
      type: 'assistantReplace',
      message: target
    });
    void vscode.window.showInformationMessage(
      'Suggested MCP changes were applied.'
    );
  }

  private buildHtml(): string {
    const nonce = createNonce();
    const markdownUri = this.panel.webview
      .asWebviewUri(
        vscode.Uri.joinPath(
          this.context.extensionUri,
          'media',
          'vendor',
          'chat-markdown.js'
        )
      )
      .toString();
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${this.panel.webview.cspSource} data:; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}' ${this.panel.webview.cspSource};">
  <style nonce="${nonce}">
    :root {
      --bg: var(--vscode-editor-background);
      --panel: var(--vscode-editorWidget-background, var(--vscode-editor-background));
      --panel-2: var(--vscode-sideBar-background, var(--vscode-editor-background));
      --border: var(--vscode-panel-border, var(--vscode-editorWidget-border, rgba(128,128,128,.25)));
      --text: var(--vscode-foreground);
      --muted: var(--vscode-descriptionForeground);
      --accent: var(--vscode-focusBorder, #007acc);
      --danger: var(--vscode-errorForeground, #ef4444);
      --grad-1: color-mix(in oklch, var(--accent) 90%, #a855f7);
      --grad-2: color-mix(in oklch, var(--accent) 40%, #6366f1);
      --glass: rgba(128,128,128,.06);
      --radius: 14px;
      --anim-fast: .18s;
      --anim-mid: .32s;
    }
    @keyframes fadeSlideIn {
      from { opacity:0; transform:translateY(8px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes pulse { 0%,80%,100%{opacity:.35} 40%{opacity:1} }
    @keyframes shimmer { to { background-position: 200% center; } }
    @keyframes glowPulse { 0%,100%{box-shadow:0 0 0 0 transparent} 50%{box-shadow:0 0 12px color-mix(in srgb,var(--accent) 30%,transparent)} }
    * { box-sizing:border-box; margin:0; }
    body {
      padding:0; background:var(--bg); color:var(--text);
      font:13px/1.55 "Segoe UI",system-ui,-apple-system,sans-serif;
      height:100vh; display:grid; grid-template-rows:auto 1fr auto;
      -webkit-font-smoothing:antialiased;
    }
    /* ─── Header ─── */
    header {
      padding:10px 16px; background:var(--glass);
      backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
      border-bottom:1px solid var(--border); position:relative; z-index:2;
    }
    header::after {
      content:''; position:absolute; bottom:0; left:16px; right:16px; height:1px;
      background:linear-gradient(90deg,transparent,var(--accent),transparent); opacity:.35;
    }
    .toolbar {
      display:flex; gap:8px; align-items:center; flex-wrap:wrap;
    }
    .brand {
      display:flex; align-items:center; gap:7px; font-weight:700; font-size:13px; letter-spacing:-.2px;
    }
    .brand-icon {
      width:22px; height:22px; border-radius:6px; display:grid; place-items:center;
      background:linear-gradient(135deg,var(--grad-1),var(--grad-2));
      color:#fff; font-size:12px; font-weight:800; line-height:1;
    }
    .toolbar-right { display:flex; gap:6px; align-items:center; margin-left:auto; }
    #status {
      font-size:11px; color:var(--muted); display:flex; align-items:center; gap:5px;
    }
    .status-dot {
      width:6px; height:6px; border-radius:50%; background:var(--muted);
      transition:background var(--anim-fast);
    }
    .status-dot.active { background:#22c55e; animation:glowPulse 2s infinite; }

    /* ─── Controls ─── */
    select, input[type="text"] {
      border:1px solid var(--border); background:var(--vscode-input-background,var(--panel));
      color:var(--text); border-radius:8px; padding:5px 8px; font:inherit; font-size:12px;
      transition:border-color var(--anim-fast),box-shadow var(--anim-fast); outline:none;
    }
    select:focus, input[type="text"]:focus {
      border-color:var(--accent); box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 20%,transparent);
    }
    button {
      cursor:pointer; border:none; border-radius:8px; padding:6px 14px;
      font:inherit; font-size:12px; font-weight:600;
      transition:all var(--anim-fast); outline:none; position:relative; overflow:hidden;
    }
    button::after {
      content:''; position:absolute; inset:0; background:rgba(255,255,255,.08); opacity:0;
      transition:opacity var(--anim-fast);
    }
    button:hover::after { opacity:1; }
    button:active { transform:scale(.97); }
    .btn-primary {
      background:linear-gradient(135deg,var(--grad-1),var(--grad-2));
      color:#fff; box-shadow:0 2px 8px color-mix(in srgb,var(--accent) 25%,transparent);
    }
    .btn-primary:hover { box-shadow:0 4px 16px color-mix(in srgb,var(--accent) 35%,transparent); }
    .btn-primary:disabled { opacity:.5; cursor:default; transform:none; }
    .btn-secondary {
      background:var(--glass); color:var(--text); border:1px solid var(--border);
    }
    .btn-secondary:hover { background:color-mix(in srgb,var(--border) 30%,transparent); }
    .btn-danger {
      background:color-mix(in srgb,var(--danger) 15%,var(--panel));
      color:var(--danger); border:1px solid color-mix(in srgb,var(--danger) 30%,transparent);
    }
    #cancel { display:none; }
    #cancel.visible { display:grid; }
    .btn-icon {
      width:30px; height:30px; padding:0; display:grid; place-items:center;
      border-radius:8px; font-size:14px;
      background:var(--glass); color:var(--muted); border:1px solid var(--border);
    }
    .btn-icon:hover { color:var(--text); background:color-mix(in srgb,var(--border) 40%,transparent); }

    /* ─── Messages ─── */
    #messages {
      overflow-y:auto; padding:16px 14px 28px; display:flex; flex-direction:column; gap:6px;
      scroll-behavior:smooth;
    }
    .message {
      max-width:min(72ch,88%); border-radius:var(--radius); padding:10px 14px;
      white-space:normal; word-break:break-word; position:relative;
      animation:fadeSlideIn var(--anim-mid) ease-out both;
      transition:box-shadow var(--anim-fast);
    }
    .message:hover { box-shadow:0 2px 12px rgba(0,0,0,.12); }
    .message.user {
      align-self:flex-end; border-bottom-right-radius:4px;
      background:linear-gradient(135deg,
        color-mix(in srgb,var(--accent) 12%,var(--panel)),
        color-mix(in srgb,var(--grad-2) 8%,var(--panel)));
      border:1px solid color-mix(in srgb,var(--accent) 18%,transparent);
    }
    .message.assistant {
      align-self:flex-start; border-bottom-left-radius:4px;
      background:var(--glass); border:1px solid var(--border);
    }
    .msg-header { display:flex; align-items:center; gap:7px; margin-bottom:6px; }
    .avatar {
      width:22px; height:22px; border-radius:6px; display:grid; place-items:center;
      font-size:11px; font-weight:700; flex-shrink:0;
    }
    .avatar.user-av {
      background:linear-gradient(135deg,var(--grad-1),var(--grad-2)); color:#fff;
    }
    .avatar.ai-av {
      background:linear-gradient(135deg,#a855f7,#6366f1); color:#fff;
    }
    .msg-role { font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:.4px; }
    .msg-time { font-size:10px; color:var(--muted); opacity:.7; margin-left:auto; }
    .msg-body { font-size:13px; line-height:1.6; }
    .msg-body p { margin:0 0 8px; }
    .msg-body p:last-child { margin-bottom:0; }
    .msg-body pre {
      background:color-mix(in srgb,var(--border) 15%,var(--bg)); border:1px solid var(--border);
      border-radius:8px; padding:10px 12px; overflow-x:auto; margin:8px 0; font-size:12px;
    }
    .msg-body code {
      font-family:Consolas,"Cascadia Code",monospace;
      background:color-mix(in srgb,var(--border) 20%,transparent);
      padding:1px 5px; border-radius:4px; font-size:12px;
    }
    .msg-body pre code { background:none; padding:0; }

    /* ─── Typing indicator ─── */
    .typing { display:flex; gap:4px; padding:6px 0 2px; }
    .typing span {
      width:6px; height:6px; border-radius:50%;
      background:var(--muted); animation:pulse 1.4s infinite;
    }
    .typing span:nth-child(2) { animation-delay:.2s; }
    .typing span:nth-child(3) { animation-delay:.4s; }

    /* ─── Tool preview ─── */
    .tool-preview {
      margin-top:10px; padding:10px 12px; border-radius:10px;
      background:color-mix(in srgb,var(--accent) 6%,var(--bg));
      border:1px solid color-mix(in srgb,var(--accent) 15%,transparent);
      display:grid; gap:8px;
    }
    .tool-preview strong { font-size:12px; display:flex; align-items:center; gap:5px; }
    .tool-list { color:var(--muted); font-size:12px; }
    .tool-actions { display:flex; gap:6px; margin-top:2px; }

    /* ─── Empty state ─── */
    .empty {
      color:var(--muted); text-align:center; margin-top:16vh;
      animation:fadeSlideIn .5s ease-out;
    }
    .empty-icon { font-size:36px; margin-bottom:10px; opacity:.5; }
    .empty-title { font-size:14px; font-weight:600; margin-bottom:4px; }
    .empty-desc { font-size:12px; opacity:.7; }

    /* ─── Footer / Composer ─── */
    footer {
      padding:12px 16px 14px; background:var(--glass);
      backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
      border-top:1px solid var(--border); display:grid; gap:8px; position:relative;
    }
    footer::before {
      content:''; position:absolute; top:0; left:16px; right:16px; height:1px;
      background:linear-gradient(90deg,transparent,var(--accent),transparent); opacity:.25;
    }
    .context-box {
      background:color-mix(in srgb,var(--border) 10%,var(--bg));
      border:1px solid var(--border); border-radius:8px; padding:6px 10px;
      color:var(--muted); font-size:11px; white-space:pre-wrap; max-height:52px;
      overflow-y:auto; line-height:1.4;
    }
    .context-box:empty { display:none; }
    textarea {
      width:100%; border:1px solid var(--border);
      background:var(--vscode-input-background,var(--panel)); color:var(--text);
      border-radius:10px; padding:8px 12px; font:inherit; font-size:12.5px;
      resize:none; outline:none; transition:border-color var(--anim-fast),box-shadow var(--anim-fast);
    }
    textarea:focus {
      border-color:var(--accent);
      box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 15%,transparent);
    }
    #context-input { min-height:34px; font-size:11.5px; }
    #prompt-input { min-height:56px; }
    .composer-row { display:flex; gap:6px; align-items:flex-end; }
    .composer-row textarea { flex:1; }
  </style>
</head>
<body>
  <header>
    <div class="toolbar">
      <div class="brand"><div class="brand-icon">K</div>KiCad AI</div>
      <select id="provider">
        <option value="none">Disabled</option>
        <option value="claude">Claude</option>
        <option value="openai">OpenAI</option>
        <option value="copilot">GitHub Copilot</option>
        <option value="gemini">Gemini</option>
      </select>
      <input id="model" type="text" placeholder="Model (optional)" />
      <div class="toolbar-right">
        <button id="cancel" class="btn-danger" type="button" title="Stop generation">&#9632;</button>
        <button id="clear" class="btn-icon" type="button" title="Clear chat">&#128465;</button>
        <button id="settings" class="btn-icon" type="button" title="AI Settings (API Key, Model)">&#9881;</button>
        <span id="status"><span class="status-dot"></span> Ready</span>
      </div>
    </div>
  </header>
  <main id="messages">
    <div id="empty" class="empty">
      <div class="empty-icon">&#9889;</div>
      <div class="empty-title">KiCad AI Assistant</div>
      <div class="empty-desc">Ask about DRC/ERC issues, net behavior, component choices, or fabrication risks.</div>
    </div>
  </main>
  <footer>
    <div id="context-info" class="context-box"></div>
    <textarea id="context-input" rows="1" aria-label="Extra context" placeholder="Extra context for this turn (optional)"></textarea>
    <div class="composer-row">
      <textarea id="prompt-input" rows="2" aria-label="Ask a question" placeholder="Ask about your KiCad design..."></textarea>
      <button id="send" class="btn-primary" type="button">Send</button>
    </div>
  </footer>
  <script nonce="${nonce}" src="${markdownUri}"></script>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const messagesEl = document.getElementById('messages');
    const emptyEl = document.getElementById('empty');
    const providerEl = document.getElementById('provider');
    const modelEl = document.getElementById('model');
    const statusEl = document.getElementById('status');
    const promptEl = document.getElementById('prompt-input');
    const contextEl = document.getElementById('context-input');
    const contextInfoEl = document.getElementById('context-info');
    const cancelButton = document.getElementById('cancel');
    const sendButton = document.getElementById('send');
    const messageMap = new Map();

    document.getElementById('send').addEventListener('click', sendPrompt);
    document.getElementById('cancel').addEventListener('click', () => vscode.postMessage({ type: 'cancel' }));
    document.getElementById('clear').addEventListener('click', () => {
      if (messagesEl.querySelectorAll('.message').length === 0) {
        return;
      }
      if (confirm('Clear all chat messages? This cannot be undone.')) {
        vscode.postMessage({ type: 'clear' });
      }
    });
    document.getElementById('settings').addEventListener('click', () => vscode.postMessage({ type: 'openSettings' }));
    providerEl.addEventListener('change', postSelection);
    modelEl.addEventListener('change', postSelection);
    promptEl.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        sendPrompt();
      }
    });

    function postSelection() {
      vscode.postMessage({
        type: 'selectionChanged',
        provider: providerEl.value,
        model: modelEl.value
      });
    }

    function sendPrompt() {
      const prompt = promptEl.value.trim();
      if (!prompt) {
        return;
      }
      vscode.postMessage({
        type: 'send',
        prompt,
        context: contextEl.value
      });
      promptEl.value = '';
    }

    function fmtTime(ts) {
      const d = new Date(ts);
      return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
    }

    function renderMessage(message) {
      let container = messageMap.get(message.timestamp);
      if (!container) {
        container = document.createElement('article');
        container.className = 'message ' + message.role;
        container.dataset.timestamp = String(message.timestamp);
        const isUser = message.role === 'user';
        container.innerHTML =
          '<div class="msg-header">' +
            '<div class="avatar ' + (isUser ? 'user-av' : 'ai-av') + '">' + (isUser ? 'U' : 'AI') + '</div>' +
            '<span class="msg-role">' + (isUser ? 'You' : 'Assistant') + '</span>' +
            '<span class="msg-time">' + fmtTime(message.timestamp) + '</span>' +
          '</div>' +
          '<div class="msg-body"></div>' +
          '<div class="tools"></div>';
        messageMap.set(message.timestamp, container);
        messagesEl.appendChild(container);
      }
      const bodyEl = container.querySelector('.msg-body');
      if (message.role === 'assistant' && !message.content) {
        bodyEl.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
      } else if (message.role === 'assistant') {
        bodyEl.innerHTML = window.KiCadChatMarkdown.renderMarkdown(message.content || '');
      } else {
        bodyEl.innerHTML = '<p>' + window.KiCadChatMarkdown.sanitizeHtml(message.content || '') + '</p>';
      }
      const toolsEl = container.querySelector('.tools');
      const toolCalls = Array.isArray(message.toolCalls) ? message.toolCalls : [];
      if (message.role === 'assistant' && toolCalls.length && !message.applied) {
        const toolNames = toolCalls
          .map((tool) => '<code>' + window.KiCadChatMarkdown.sanitizeHtml(tool.name) + '</code>')
          .join(', ');
        toolsEl.innerHTML =
          '<div class="tool-preview">' +
          '<strong>&#9881; Suggested MCP changes</strong>' +
          '<div class="tool-list">' + toolNames + '</div>' +
          '<div class="tool-actions">' +
          '<button type="button" class="btn-primary" data-apply-toolcalls="' + message.timestamp + '">Apply</button>' +
          '<button type="button" class="btn-secondary" data-ignore-toolcalls="' + message.timestamp + '">Ignore</button>' +
          '</div>' +
          '</div>';
        toolsEl.querySelector('[data-apply-toolcalls]')?.addEventListener('click', () => {
          vscode.postMessage({ type: 'applyToolCalls', timestamp: message.timestamp });
        });
        toolsEl.querySelector('[data-ignore-toolcalls]')?.addEventListener('click', () => {
          vscode.postMessage({ type: 'ignoreToolCalls', timestamp: message.timestamp });
        });
      } else {
        toolsEl.innerHTML = '';
      }
      emptyEl.style.display = messageMap.size ? 'none' : 'block';
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    const statusDot = document.querySelector('.status-dot');

    function setBusy(busy) {
      cancelButton.classList.toggle('visible', !!busy);
      cancelButton.disabled = !busy;
      sendButton.disabled = !!busy;
      statusDot?.classList.toggle('active', !!busy);
    }

    window.addEventListener('message', (event) => {
      const message = event.data;
      if (message.type === 'hydrate') {
        providerEl.value = message.provider || 'none';
        modelEl.value = message.model || '';
        contextInfoEl.textContent = message.contextInfo || '';
        statusEl.innerHTML = '<span class="status-dot' + (message.busy ? ' active' : '') + '"></span> ' + (message.busy ? 'Streaming…' : 'Ready');
        setBusy(message.busy);
        messagesEl.querySelectorAll('.message').forEach((element) => element.remove());
        messageMap.clear();
        for (const item of message.history || []) {
          renderMessage(item);
        }
        emptyEl.style.display = messageMap.size ? 'none' : 'block';
      }
      if (message.type === 'appendMessage') {
        renderMessage(message.message);
      }
      if (message.type === 'assistantChunk') {
        const current = messageMap.get(message.timestamp);
        if (current) {
          const body = current.querySelector('.msg-body');
          const previous = current.dataset.markdown || '';
          const next = previous + message.text;
          current.dataset.markdown = next;
          body.innerHTML = window.KiCadChatMarkdown.renderMarkdown(next);
          messagesEl.scrollTop = messagesEl.scrollHeight;
        }
      }
      if (message.type === 'assistantReplace') {
        renderMessage(message.message);
      }
      if (message.type === 'status') {
        const dot = statusDot ? '<span class="status-dot' + (sendButton.disabled ? ' active' : '') + '"></span> ' : '';
        statusEl.innerHTML = dot + (message.text || 'Ready');
      }
      if (message.type === 'busy') {
        setBusy(message.busy);
      }
      if (message.type === 'contextInfo') {
        contextInfoEl.textContent = message.text || '';
      }
    });

    vscode.postMessage({ type: 'ready' });
  </script>
</body>
</html>`;
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.handleDisposed();
    this.panel.dispose();
  }

  private handleDisposed(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.abortController?.abort(new AIStreamAbortedError());
    this.disposables.forEach((disposable) => disposable.dispose());
    KiCadChatPanel.instance = undefined;
  }
}
