import {
  AI_SECRET_KEYS,
  AI_SECRET_KEY_LEGACY,
  type AiProviderName
} from '../constants';

export type AiSecretProvider = AiProviderName;

const API_KEY_PATTERN =
  /\b(?:sk-[A-Za-z0-9_-]{8,}|sk-ant-[A-Za-z0-9_-]{8,}|AIza[0-9A-Za-z_-]{8,})\b/g;

export function isAiSecretProvider(value: string): value is AiSecretProvider {
  return value === 'claude' || value === 'openai' || value === 'gemini';
}

export function getAiSecretKey(provider: AiSecretProvider): string {
  return AI_SECRET_KEYS[provider];
}

export function getAiSecretProviders(): AiSecretProvider[] {
  return ['claude', 'openai', 'gemini'];
}

export function redactApiKey(value: string, apiKey?: string): string {
  let redacted = value;
  if (apiKey) {
    redacted = redacted.split(apiKey).join(maskApiKey(apiKey));
  }
  return redacted.replace(API_KEY_PATTERN, (match) => maskApiKey(match));
}

export function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) {
    return '***';
  }
  return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
}

export async function migrateLegacyAiSecret(args: {
  secrets: {
    get(key: string): Thenable<string | undefined>;
    store(key: string, value: string): Thenable<void>;
    delete(key: string): Thenable<void>;
  };
  provider: AiSecretProvider;
}): Promise<string | undefined> {
  const providerKey = getAiSecretKey(args.provider);
  const existing = await args.secrets.get(providerKey);
  if (existing) {
    return existing;
  }

  const legacy = await args.secrets.get(AI_SECRET_KEY_LEGACY);
  if (!legacy) {
    return undefined;
  }

  await args.secrets.store(providerKey, legacy);
  await args.secrets.delete(AI_SECRET_KEY_LEGACY);
  return legacy;
}
