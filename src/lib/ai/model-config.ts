import { AI_STREAM_MODELS } from '@/lib/schemas/ai.schema';

export type AiStreamModel = (typeof AI_STREAM_MODELS)[number];

export type ModelResolution =
  | { status: 'ok'; openAiModel: string }
  | { status: 'unsupported' }
  | { status: 'unconfigured' };

const DEFAULT_OPENAI_MODEL = 'gpt-5';
const DEFAULT_OPENAI_MINI_MODEL = 'gpt-5-mini';

// The backend speaks OpenAI only (src/lib/openai.ts instantiates the OpenAI
// SDK directly; no Anthropic/Google SDKs and no provider abstraction exist).
// UI display names are mapped to real OpenAI model IDs here.
//
// 'Claude Sonnet' and 'Gemini 2.5 Pro' are retained as selectable display
// labels for UI compatibility, but this application cannot back them with
// the OpenAI SDK. They resolve to `unsupported` and are rejected by the API
// with a 400 instead of being forwarded to OpenAI.
interface StreamModelEntry {
  displayName: AiStreamModel;
  openAiModel: string | null;
  envOverrideKey: string | null;
}

const AI_STREAM_MODEL_CONFIG: readonly StreamModelEntry[] = [
  {
    displayName: 'GPT-5',
    openAiModel: DEFAULT_OPENAI_MODEL,
    envOverrideKey: 'OPENAI_MODEL',
  },
  {
    displayName: 'GPT-5 Mini',
    openAiModel: DEFAULT_OPENAI_MINI_MODEL,
    envOverrideKey: 'OPENAI_MODEL_MINI',
  },
  {
    displayName: 'Claude Sonnet',
    openAiModel: null,
    envOverrideKey: null,
  },
  {
    displayName: 'Gemini 2.5 Pro',
    openAiModel: null,
    envOverrideKey: null,
  },
];

function resolveEnvModel(
  envKey: string | null,
  fallback: string,
): string {
  if (envKey !== null) {
    const configured = process.env[envKey];
    if (
      configured !== undefined &&
      configured.trim() !== ''
    ) {
      return configured.trim();
    }
  }
  return fallback;
}

export function resolveStreamModel(
  displayName: AiStreamModel | undefined,
): ModelResolution {
  const entry = AI_STREAM_MODEL_CONFIG.find(
    (model) =>
      model.displayName ===
      (displayName ?? 'GPT-5'),
  );

  if (!entry || entry.openAiModel === null) {
    return { status: 'unsupported' };
  }

  const openAiModel = resolveEnvModel(
    entry.envOverrideKey,
    entry.openAiModel,
  );

  if (openAiModel.trim() === '') {
    return { status: 'unconfigured' };
  }

  return { status: 'ok', openAiModel };
}
