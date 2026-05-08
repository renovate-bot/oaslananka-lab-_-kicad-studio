# Changelog

## [2.8.1](https://github.com/oaslananka-lab/kicad-studio/compare/kicadstudio-v2.8.0...kicadstudio-v2.8.1) (2026-05-08)

### Bug Fixes

- **ci:** use release token for mirror releases ([166f4ac](https://github.com/oaslananka-lab/kicad-studio/commit/166f4acbfb67d297d191d11619f1466ffeb4074f))
- **release:** checkout release assets by target commit ([41d9565](https://github.com/oaslananka-lab/kicad-studio/commit/41d9565fcb3dafab2a55285a6f489a5b7ebbb08b))
- **release:** detect draft releases before asset jobs ([ad7c2a6](https://github.com/oaslananka-lab/kicad-studio/commit/ad7c2a63be27383a70c2db652d93a0c47e5649f5))
- **release:** upload draft release assets by id ([4231486](https://github.com/oaslananka-lab/kicad-studio/commit/42314861cf831ea354905ec7d6b4b8da37145171))
- **release:** use release token for GitHub releases ([c4bd962](https://github.com/oaslananka-lab/kicad-studio/commit/c4bd962afebcedcbcc067f52c44693bd4ba1055a))

## [2.8.0](https://github.com/oaslananka-lab/kicad-studio/compare/kicadstudio-v2.7.7...kicadstudio-v2.8.0) (2026-05-08)

### Features

- add HTTP transport mode for kicad-mcp-pro (v2.7.5) ([e710159](https://github.com/oaslananka-lab/kicad-studio/commit/e710159e4a43e9d42ee83296e1b130a38280c605))
- **core:** professional refactor for AI, settings, and KiCad 10.0.1 ([b74ef3d](https://github.com/oaslananka-lab/kicad-studio/commit/b74ef3dd7207cdb097e2939707825059ebc6d10f))
- enhance end-to-end testing setup and add new integration tests for editor flows and DRC rules ([390c3f4](https://github.com/oaslananka-lab/kicad-studio/commit/390c3f4f3d9204c22b4cd9b6c1b17ad3aafc8eb3))
- **mcp:** phase 1-12 integration hardening ([d45cc26](https://github.com/oaslananka-lab/kicad-studio/commit/d45cc26bb1852e71060b3ce2cfcb93c7bb12ffdb))
- update OpenAI model to gpt-5.4 and improve datasheet URL validation ([ce71d27](https://github.com/oaslananka-lab/kicad-studio/commit/ce71d27e7be233dca6d747a1d947336674c75107))

### Bug Fixes

- **build:** keep extension bundle within size budget ([28b4c4b](https://github.com/oaslananka-lab/kicad-studio/commit/28b4c4b9a4a3c7c96f93e569b4e9232020fad85a))
- chat scroll perf, Codex in settings, MCP stdio error guards ([aa2d96c](https://github.com/oaslananka-lab/kicad-studio/commit/aa2d96cab40dcba5fbfd662fbc6751ed96bb6bed))
- **ci:** allow gitleaks to fail gracefully if license is missing ([0a6252b](https://github.com/oaslananka-lab/kicad-studio/commit/0a6252b7f5f0d84e9d8cc9e26df781da660d14cb))
- **ci:** avoid job-level hashFiles in lint-fast ([8a451b0](https://github.com/oaslananka-lab/kicad-studio/commit/8a451b0ba00efeb9c10d6fff13a8fcb0067aed3b))
- **ci:** install npm before cache probing ([9396c9b](https://github.com/oaslananka-lab/kicad-studio/commit/9396c9b47aabd5a5bada520a70b6fa511596587d))
- **ci:** normalize workflow line endings ([da3e62b](https://github.com/oaslananka-lab/kicad-studio/commit/da3e62b8c0f93cfd4a6356efcf2c8016c8eb149c))
- **ci:** pin scorecard action commit ([0970d5a](https://github.com/oaslananka-lab/kicad-studio/commit/0970d5aa211a277b51e3f2c842c781ace92cfa90))
- **ci:** pin workflows to repo node version ([452aea4](https://github.com/oaslananka-lab/kicad-studio/commit/452aea4b3afee49fd5019fbf42dfe0256d1c3cf3))
- **ci:** quote label color values ([b2ba0ff](https://github.com/oaslananka-lab/kicad-studio/commit/b2ba0fffce364bbd2243c0b77aefcee41cdb3882))
- **ci:** relax npm version check and add repo-token for task setup ([65e7e91](https://github.com/oaslananka-lab/kicad-studio/commit/65e7e916befe9946c31115c38b0397275eb6ccb7))
- **ci:** repair main workflow gates ([184743d](https://github.com/oaslananka-lab/kicad-studio/commit/184743dc00d131b668ba9b06ddf50482e44b609c))
- **ci:** satisfy actionlint for codecov upload ([ff5af23](https://github.com/oaslananka-lab/kicad-studio/commit/ff5af234c0f14ae3109772f3c8711ab24dd8f300))
- **ci:** satisfy actionlint for node project detection ([4dd4db6](https://github.com/oaslananka-lab/kicad-studio/commit/4dd4db61d2c63c7d3b8251c554d2a87fa68908fb))
- **ci:** split scorecard publish gate ([43a1f8c](https://github.com/oaslananka-lab/kicad-studio/commit/43a1f8caa6d6f381861a04276f1d44198baa67aa))
- **ci:** use codecov uploader binary ([55cc2f7](https://github.com/oaslananka-lab/kicad-studio/commit/55cc2f7e8c6116ea790bb021df93696f279ddcc0))
- **ci:** use robust npm install in lint-fast ([8037188](https://github.com/oaslananka-lab/kicad-studio/commit/8037188cfbc0648f42f1697c8ff3352165bf737a))
- **ci:** use supported codecov upload arguments ([292aeeb](https://github.com/oaslananka-lab/kicad-studio/commit/292aeeb8a7a0801ab5f6ac8accec16c42b8c14af))
- DRC schema, diff cyan, project tree, VsCodeStdio UI, CH224A fixtures (v2.7.4) ([9fe4b83](https://github.com/oaslananka-lab/kicad-studio/commit/9fe4b839fc2f7ff2ad15b9b7343f2c11adfb355f))
- **fixtures:** spread schematic symbols across A4 sheet via sch_auto_place_functional ([243fc35](https://github.com/oaslananka-lab/kicad-studio/commit/243fc35813091ebfef27a1367712c80b34a01332))
- **language:** skip project JSON diagnostics ([4979f46](https://github.com/oaslananka-lab/kicad-studio/commit/4979f46c6196ea34105b07cdfe8ff670abab67a9))
- **release:** prefer repository marketplace secrets ([70ca625](https://github.com/oaslananka-lab/kicad-studio/commit/70ca625f1b2cbe78553ab69ef4a45e92342f94a3))
- **scripts:** make cleanup helper bash-safe ([f4bf5df](https://github.com/oaslananka-lab/kicad-studio/commit/f4bf5dfcc177bd5d28a4845ec7dd9558d3d120a5))
- **security:** resolve code scanning findings ([34825fa](https://github.com/oaslananka-lab/kicad-studio/commit/34825fa8dd8e798a0eee0921bedb91b40baa880d))
- split Fix Queue / Quality Gates viewsWelcome by mcpConnected state (v2.7.6) ([61e2147](https://github.com/oaslananka-lab/kicad-studio/commit/61e2147c7d92d6b60af34ea090e5da0c7a49d04a))
- v2.7.2 — max_completion_tokens, streaming perf, hop-over detection, Codex provider, MCP stdio ([#11](https://github.com/oaslananka-lab/kicad-studio/issues/11)) ([79246eb](https://github.com/oaslananka-lab/kicad-studio/commit/79246eb117b92751f298d616a20f06430d7ab0a9))

## [2.7.7] - 2026-04-29

### Added

- **Component Search sidebar panel** — a new _Component Search_ view in the KiCad Studio sidebar
  shows action buttons to launch the component search QuickPick, set the Octopart/Nexar API key,
  and set the AI API key — all without opening the settings page.
- **`SchematicEditorProvider.onDidActivate`** — internal event emitted whenever a `.kicad_sch` file
  is opened or brought to focus in the custom schematic viewer (webview panel).

### Fixed

- **BOM panel empty when schematic viewer is open** — `BomViewProvider` now listens to the
  schematic viewer's activation event and refreshes the BOM for the active viewer URI, not just
  the active text editor. The fallback workspace scan is still present but is now the last resort
  rather than triggering unnecessarily.
- **AI Chat scroll freezes during agent streaming** — `scheduleScrollToBottom` now always scrolls
  to the bottom while `state.busy` is `true`, so long streaming responses stay pinned to the
  viewport without the lag caused by the `nearBottom` guard.
- **AI Chat O(n²) streaming cost** — `updateStreamingBody` now appends each incoming chunk as a
  `TextNode` instead of replacing the entire `pre.textContent` string. Rendering cost is O(chunk)
  per tick rather than O(total-content), preventing UI thread saturation on long responses.
- **VS Code Codex provider broken in 2025+** — removed the stale `{ vendor: 'copilot', family: 'codex' }`
  selector (no longer registered by Copilot) and added `gpt-4.1` / `o3` families so the provider
  resolves an available model in current VS Code releases.

## [2.7.6] - 2026-04-29

### Fixed

- **AI Fix Queue empty-state message** — `viewsWelcome` condition split into
  `!mcpConnected` ("Connect kicad-mcp-pro…") and `mcpConnected` ("No pending AI fixes…")
  so the panel no longer shows a misleading "Connect" prompt when the HTTP server is already
  running but there are no queued fixes. Same fix applied to the Quality Gates panel.

## [2.7.5] - 2026-04-29

### Added

- **HTTP transport mode for kicad-mcp-pro** — the MCP setup wizard now asks _how_ the server
  should run: **stdio** (existing behaviour, managed by VS Code) or **HTTP** (port 27185, enables
  Quality Gates and AI Fix Queue in KiCad Studio).
  Choosing HTTP writes a background VS Code task (`Start kicad-mcp-pro (HTTP)`) to
  `.vscode/tasks.json` and updates `.vscode/mcp.json` with an SSE entry for Copilot/Claude Code.
  A "Run Task Now" prompt lets you start the server immediately without leaving VS Code.
- **`KiCad: Launch kicad-mcp-pro (HTTP mode)`** command — standalone command palette entry
  (`kicadstudio.mcp.launchHttp`) for quickly switching to HTTP transport from any workspace.
- **"Switch to HTTP Mode" link in Fix Queue / Quality Gates** — when kicad-mcp-pro is detected in
  VS Code stdio mode the welcome panel now shows a clickable
  `[Switch to HTTP Mode](command:kicadstudio.mcp.launchHttp)` link instead of a plain text hint.

## [2.7.4] - 2026-04-29

### Fixed

- **DRC syntax false-positives** — added `min`, `max`, `opt` and all standard constraint-type identifiers
  (`clearance`, `courtyard_clearance`, `track_width`, `length`, `skew`, `diff_pair_gap`, etc.) to
  `DRC_SCHEMA`; extended `isSafeTag` to recognise dimension values with units (`0.20mm`, `1.00mil`,
  `45deg`, etc.) so `kicad-studio:syntax` no longer flags valid `.kicad_dru` nodes.
- **Git diff viewer cyan background** — changed the `<kicanvas-embed>` theme for schematics in
  `diff.js` from `kicad` (cyan eeschema background) to `light` (white background); PCB diffs keep
  the `kicad` dark theme.
- **Project tree duplicate files** — `projectTreeProvider.ts` `collectFiles()` now skips
  `src`, `test`, `scripts`, `media`, `docs`, `.github`, `.husky`, `build`, `coverage` and other
  non-KiCad directories so the extension's own development tree is not polluted by test fixture files.
- **AI Fix Queue / Quality Gates — VsCodeStdio guidance** — added `kicadstudio.mcpVsCodeStdio`
  VS Code context key; `package.json` `viewsWelcome` now shows a targeted message when kicad-mcp-pro
  is connected via stdio (directing users to the AI Chat panel) instead of the generic
  "Connect kicad-mcp-pro" prompt.

### Added

- **CH224A-breakout benchmark fixture** — full KiCad 10 project files
  (`CH224A breakout board design.kicad_sch/pcb/pro`, 7 069 + 7 394 lines) from
  [uwrealitylabs/CH224A-breakout](https://github.com/uwrealitylabs/CH224A-breakout)
  added to `test/fixtures/benchmark_projects/ch224a_breakout/` with attribution.

## [2.7.3] - 2026-04-29

### Fixed

- **Chat auto-scroll**: replaced per-chunk `scrollTop = scrollHeight` (layout thrashing)
  with a `requestAnimationFrame`-batched helper; multiple chunks within the same frame
  now trigger a single layout pass. Scroll is skipped when the user has scrolled more than
  120 px above the bottom so reading history during streaming is preserved.
- **Codex missing from Settings panel**: `settingsHtml.ts` and the `kicadstudio.ai.provider`
  enum in `package.json` were missing the `codex` option added in 2.7.2; the Settings UI
  now shows "Codex (VS Code)" alongside the other providers.
- **MCP stdio — raw fetch crash in Quality Gates / AI Fix Queue**: when kicad-mcp-pro is
  connected via VS Code stdio the extension's HTTP client cannot reach port 27185, producing
  unhandled "fetch failed" toasts from `qualityGate.runAll` and `refreshFixQueue`. The
  `rpc()` layer now throws a descriptive error on `VsCodeStdio` state; `fixQueueProvider`
  swallows stdio/fetch/ECONNREFUSED errors silently; `qualityGateProvider` shows an
  informational message explaining that HTTP transport is required for Quality Gates.

## [2.7.2] - 2026-04-29

### Fixed

- **OpenAI HTTP 400**: replaced deprecated `max_tokens` parameter with `max_completion_tokens`
  in the chat/completions path; required by GPT-5, GPT-5-mini, and other newer models.
- **Chat streaming performance**: `assistantChunk` messages now update only the raw text
  container instead of re-running full markdown parsing and DOM reconstruction on every
  streamed token. Full markdown render occurs once on `assistantReplace` (stream end).
  Added blinking-cursor typing indicator and removed duplicate "Streaming…" status flash.
- **Schematic hop-over detection**: `SchematicEditorProvider` previously matched `(junction ...)`
  elements (intentional wire-connection dots) as hop-over arcs, producing incorrect viewer
  overlay positions and noisy sidebar notes. Detection now targets top-level `(arc ...)` elements
  outside the `lib_symbols` block — the actual KiCad 10 representation of hop-over arcs —
  and consolidates notes to a single count message.
- **MCP Disconnected false-negative**: when the HTTP endpoint is unreachable but
  `.vscode/mcp.json` contains a kicad-mcp-pro stdio server entry (VS Code Copilot MCP),
  the extension now transitions to `VsCodeStdio` state and shows a connected status with a
  descriptive tooltip instead of "MCP Disconnected".

### Added

- **GPT-5 / GPT-5-mini models**: added to the OpenAI model catalog with `chat-completions`
  mode; GPT-5 promoted as the new default OpenAI model.
- **VS Code Codex provider**: new `CodexProvider` (wraps VS Code LM API with Codex family
  selectors) registered as the `codex` AI provider option; available in the AI Chat dropdown.
- **CH224A-breakout attribution**: added the UW Reality Labs
  [CH224A-breakout](https://github.com/uwrealitylabs/CH224A-breakout) KiCad 10 project to the
  README as a documented development benchmark — used to validate schematic viewer, MCP
  integration, DRC analysis, and AI chat features against a real-world board.

## [2.7.1] - 2026-04-28

### Security

- Resolved CodeQL code-scanning findings in bundled viewer scripts and the library symbol preview path by removing unsafe HTML injection patterns.
- Hardened SVG/script checks used by tests and added property-based fuzz coverage for parser robustness and API-key redaction.
- Pinned GitHub Actions to full commit SHAs, refreshed Node 24-compatible action pins, and removed the Node-based Task setup action from CI and release workflows.
- Repaired canonical mirror sync so it falls back to `GITHUB_TOKEN`, avoids forced pushes, skips already-synced branches, and passes manual verification.

## [2.7.0] - 2026-04-28

### Changed

- Raised the VS Code engine to `^1.99.0` and aligned `@types/vscode` with the manifest engine.
- Aligned local development on Node.js 24.x and npm 11+ through `devEngines`, `.node-version`, `.nvmrc`, and hardened npm defaults.
- Replaced the Taskfile with an `npm ci`-based task graph and removed hidden lint/security fallbacks.
- Added merge queue triggers and fail-closed PR/push security behavior for repository workflows.
- Added Renovate dependency pinning policy, expanded CODEOWNERS coverage, and moved durable report content into `docs/maintenance-policy.md`.

### Security

- Added local `scripts/local-security.sh` and `scripts/local-security.ps1` gates for npm audit, gitleaks, and bundle-size checks.
- Added a hard 5 MB artifact limit message to the bundle-size checker.

## [2.6.0] - 2026-04-28

### Added

- Quality Gates sidebar surfacing project, placement, transfer, and manufacturing gates from `kicad-mcp-pro`.
- One-click `kicad-mcp-pro` installer with `uvx`, `pipx`, and `pip` fallback.
- MCP profile picker in the status bar with all `full`, `minimal`, `schematic_only`, `pcb_only`, `manufacturing`, `high_speed`, `power`, `simulation`, `analysis`, and `agent_full` profiles.
- Manufacturing release wizard with pre-flight gate inspection.
- Code Actions for MCP fix queue items that include source location metadata.
- JSON schema validation and IntelliSense for `.vscode/mcp.json` KiCad usage.
- `KiCad: Open MCP Log` command and redacted log viewer.
- Real-server integration test job in GitHub Actions and Azure Pipelines.

### Changed

- MCP client now performs version negotiation against a documented compatibility range and reports `Connected (recommended)`, `Connected (older than recommended)`, or `Incompatible` states.
- MCP client implements bounded retry behavior for transient request failures and exposes explicit retry actions for disconnected states.
- MCP error notifications now surface structured `error_code` and `hint` details where the server provides them, with troubleshooting doc links.
- Walkthroughs expanded to a first-run MCP path from install to manufacturing release.

### Fixed

- Cleanup-on-deactivate now awaits MCP client cleanup within the configured drain window.

### Security

- `.vscode/mcp.json` schema flags non-absolute `KICAD_MCP_PROJECT_DIR` values through schema guidance to reduce path mistakes in shared workspaces.
- MCP log viewer redacts authorization headers and home-directory paths before display or save.

## [2.5.0] - 2026-04-27

### Added

- Added MCP-backed DRC rule editing, Docker/inspector-aware MCP bootstrap detection, workspace-level export presets, and an internal opt-in telemetry hook that does not send data to a network backend.
- Added Web Worker-backed viewer source preparation, explicit metadata-first large-file messaging, KiCad 10 hop-over overlay hints, and visual diff component highlight overlays.
- Added diagnostics aggregation so syntax, DRC, and ERC diagnostics share one KiCad Diagnostics collection without overwriting each other.
- Added focused unit coverage plus integration and E2E harness hardening for context sync, MCP retry/session persistence, workspace trust, export preset migration, CLI truncation, local component fallback, and provider streaming parity.

### Changed

- Hardened workspace trust behavior so KiCad CLI, external KiCad launches, import/export flows, auto-checks, CLI auto-detection, and language-model tools are gated in Restricted Mode.
- Split viewer HTML helpers into palette, payload, template, and layer-panel modules while preserving the legacy import path.
- Reworked MCP context pushing to use deterministic SHA-256 context hashes and source-aware throttling for save, focus, cursor, and DRC events.
- Export presets now use schema version 2 and migrate legacy presets on load.

### Fixed

- Persisted MCP session IDs across extension restarts and added retry/backoff for transient MCP HTTP/network failures.
- Loaded all `.kicad_dru` files in a workspace while keeping DRC rule reveal file-specific.
- Preserved variant project-file persistence and added optional MCP `variant_set_active` synchronization.
- Added local library fallback for component search when online sources fail.
- Truncated large `kicad-cli` stdout/stderr buffers with explicit result flags to avoid excessive memory pressure.

## [2.4.5] - 2026-04-26

### Fixed

- Stopped S-expression diagnostics and language services from running on `.kicad_pro` / `.kicad_jobset` JSON project files, preventing false `Unknown KiCad node "{"` warnings on newly created KiCad projects.

## [2.4.4] - 2026-04-26

### Fixed

- Preferred the repository-level `VSCE_PAT` and `OVSX_PAT` secrets for publishing, with Doppler as a fallback, so org CI/CD can publish without depending on a stale Doppler marketplace token.

## [2.4.3] - 2026-04-26

### Fixed

- Disabled automatic setup-node package-manager cache probing so GitHub Actions upgrades npm before `devEngines` validation runs.
- Aligned local and CI quality gates around the pinned Node.js 24.14.1 and npm 11.13.0 toolchain.

## [2.4.2] - 2026-04-18

### Fixed

- Scoped KiCad Studio view-title actions correctly so they no longer leak into unrelated VS Code view headers.
- Fixed the viewer webview bootstrap script generation so PCB and schematic custom editors no longer stall before the render pipeline starts.
- Minimal KiCad 10 schematic and PCB files now attempt KiCanvas and CLI SVG fallback rendering before showing the empty-document overlay.

## [2.4.1] - 2026-04-17

### Changed

- Moved the heavy viewer stylesheet into a bundled media asset so the production extension bundle stays under the release regression gate.

### Fixed

- Schematic and PCB viewers now fall back to CLI-generated SVG when KiCanvas reports success but renders blank or fails to produce a drawable surface.
- Fallback viewers now preserve KiCad-like backgrounds, stable zoom/pan behavior, and persistent tool buttons across schematic and PCB documents.
- Viewer loading no longer briefly flashes transient KiCanvas HUD controls before the final render mode is ready.

## [2.4.0] - 2026-04-16

### Added

- Language Model Tools contributions for DRC/ERC, Gerber export, file opening, component/library search, active-context reads, and variant listing/switching.
- `kicadstudio.manageChatProvider` plus a Claude-backed Language Model Chat Provider contribution for VS Code hosts that support chat-provider registration.
- MCP server definition provider contribution so compatible VS Code builds can discover `kicad-mcp-pro` without requiring `.vscode/mcp.json`.
- Baseline-driven bundle-size regression checks with `scripts/bundle-size-baseline.json`.
- CI dependency auditing via `npm audit --audit-level=moderate`.

### Changed

- Bumped the extension version to `2.4.0`.
- MCP bootstrap now supports explicit profile selection and `pipx` detection fallback.
- MCP HTTP transport now follows Streamable HTTP expectations, including `Accept: application/json, text/event-stream` and `MCP-Session-Id` reuse.
- Viewer and webview message handling now performs stricter runtime validation before acting on inbound payloads.
- Activation logging now emits a warning when startup exceeds 500 ms.
- README and docs were refreshed for LM tools, chat-provider support, Streamable HTTP MCP behavior, and KiCad 10 guidance.

### Fixed

- Hardened the Playwright VS Code smoke-test harness cleanup path for Windows temp directories so release validation no longer fails on transient `EPERM` cleanup locks.
- `kicad-cli` runner now supports cancellation-aware progress flows, typed exit errors, and KiCad text-variable expansion through `--define-var`.
- Component search, variant helpers, and LM/MCP registrations now have unit and integration coverage for the new branches introduced in the 2.4.0 work.
- Webview CSPs now avoid inline/eval allowances while keeping all scripts nonce-gated.

### Removed

- The stale placeholder release-notes section so the changelog maps directly to shipped versions.

## [2.3.3] - 2026-04-16

### Fixed

- Hardened the Playwright VS Code smoke-test harness cleanup path for Windows temp directories so release validation no longer fails on transient `EPERM` cleanup locks.

## [2.3.2] - 2026-04-16

### Changed

- Repackaged the 2.3.1 test-hardening release so the published VSIX, changelog, and GitHub release metadata stay in sync.
- Refreshed the marketplace artifact from the current repository state without changing runtime behavior.

## [2.3.1] - 2026-04-16

### Added

- Real VS Code desktop smoke E2E coverage using Playwright CDP automation and a dedicated test harness.
- Integration coverage for schematic and PCB custom editor opening flows plus `.kicad_dru` language activation.
- Unit coverage for KiCad 10 variants, graphical DRC rules, MCP detection branches, and status bar states.

### Changed

- Expanded the extension command registration integration test to cover the current KiCad 10 and MCP command surface.
- Updated contributing guidance to treat `npm run test:e2e` as part of desktop-facing validation.

## [2.3.0] - 2026-04-16

### Added

- AI streaming responses with real-time token display.
- Multi-turn AI chat panel (`kicadstudio.openAiChat`).
- Local KiCad symbol and footprint library search.
- `ComponentSearchCache` for 24-hour Octopart/LCSC caching.
- CONTRIBUTING, security, code of conduct, and GitHub issue/PR templates.
- JSDoc and architecture documentation updates for the 2.0.0 refactor surface.
- KiCad 10-oriented sidebar features for variants, DRC rules, MCP fix queue, and design intent editing.
- GitHub Copilot and Gemini provider support through the VS Code Language Model API.
- MCP auto-detection, context bridge plumbing, and manual-apply chat tool suggestions.
- KiCad 10 fixtures and E2E scaffolding for viewer coverage expansion.

### Changed

- AI max tokens increased from 1200 to 4096.
- The `oaslananka-lab` GitHub mirror now owns the primary automated CI/CD system, while Azure DevOps and GitLab are manual fallback workflows only.
- TypeScript now uses `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and `noImplicitOverride`.
- Status bar now reflects AI configuration/health in addition to CLI and DRC/ERC state.
- README and docs were updated for KiCad 10, MCP, AI provider options, and Azure pipeline flow.

### Fixed

- KiCad document parsing now coalesces duplicate parse requests.
- `kicad-cli` runner now de-duplicates identical in-flight commands.
- Viewer payloads now cache base64 content by file mtime and refresh more predictably.

## [2.0.1] - 2026-04-14

### Changed

- Updated the default OpenAI model to `gpt-5.4`.

### Fixed

- Repaired the npm lockfile metadata so VSIX packaging installs cleanly.
- Hardened BOM, netlist, and chat webview rendering against raw HTML injection.
- Restricted datasheet links to HTTP(S) URLs before opening externally.
- Added timeouts for Octopart and LCSC component search requests.

## [1.0.2] - 2026-04-13

### Changed

- VSIX packaging scripts now use plain `vsce package`/`vsce publish` without Azure URL overrides so Marketplace README screenshots resolve from GitHub.
- `package:ls` now uses `vsce ls --tree` for compatibility with current vsce CLI.

## [1.0.1] - 2026-04-13

### Changed

- Azure DevOps pipelines now use `UseNode@1` instead of deprecated `NodeTool@0` to remove deprecation warnings in CI and publish jobs.

## [1.0.0] - 2026-04-13

### Added

- Interactive schematic viewer powered by a bundled KiCanvas build (KiCad 6–9 support)
- Interactive PCB viewer with layer summaries and refresh support
- Auto-refresh on file save
- Syntax highlighting for `.kicad_sch`, `.kicad_pcb`, `.kicad_sym`, `.kicad_mod`, `.kicad_pro`
- Document symbols, hover tooltips, and auto-completion for KiCad S-expressions
- `kicad-cli` auto-detection on Windows, macOS, and Linux
- Export commands for Gerbers, drill, PDF, SVG, IPC-2581, ODB++, 3D GLB, BOM, and netlist
- DRC/ERC integration with the VS Code Problems panel
- Bill of Materials table view with sorting, filtering, and export
- Component search via Octopart/Nexar and LCSC
- Visual Git diff viewer for schematics and PCBs
- AI-powered error analysis and circuit explanation (Claude and OpenAI)
- KiCad project tree view
- Status bar with KiCad version and DRC/ERC status
- Task provider for CI/CD integration
- Export presets
- Keyboard shortcuts for DRC, ERC, and Gerber export
- Getting Started walkthrough
- Provider-aware AI defaults with Claude `claude-sonnet-4-6` and OpenAI `gpt-4.1`.
- OpenAI Responses mode plus Chat Completions compatibility mode.
- AI response language setting for English, Turkish, German, Simplified Chinese, and Japanese.
- Real CLI-backed netlist node extraction for the Netlist view.
- KiCad jobset discovery and `kicad-cli jobset run` command.
- KiCad 9+ export commands for BREP, PLY, GenCAD, IPC-D-356, DXF, pick-and-place, footprint SVG, and symbol SVG.
- Manufacturing package export with generic, JLCPCB, and PCBWay ZIP profiles.
- Bundle size regression gate for CI/publish pipelines.
- Expanded KiCad snippets for labels, sheets, tracks, vias, pads, and zones.

### Changed

- Schematic and PCB viewer providers now share a base KiCanvas provider implementation.
- Diff viewer is now a command-driven panel manager instead of an unused custom editor provider.
- Project tree scanning is asynchronous and includes `.kicad_jobset` files.
- `findAllNodes()` uses a lazy tag index for large S-expression documents.
- Viewer theme payload follows `kicadstudio.viewer.theme`.
- Status menu now shows CLI status, DRC/ERC summaries, export shortcuts, and settings navigation.
- BOM CSV export writes a UTF-8 BOM and handles carriage returns correctly.
- README, marketplace metadata, command contributions, and VSIX ignore rules were updated for the new release surface.

### Removed

- Runtime plaintext API key fallback for AI and Octopart/Nexar settings. Deprecated values are migrated to VS Code SecretStorage on activation when found.
- Pseudo-telemetry setting/service.
- Unused VisualDiffProvider code.
- Development `// DONE` banner comments.

### Added
