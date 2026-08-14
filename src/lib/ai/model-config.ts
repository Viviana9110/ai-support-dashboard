export const AI_STREAM_MODELS = [
  'GPT-5',
  'GPT-5 Mini',
] as const;

export const AI_ASSISTANTS = [
  'Customer Support AI',
  'Sales Assistant',
  'Technical Support',
] as const;

export const DEFAULT_AI_ASSISTANT = 'Customer Support AI';
export const DEFAULT_AI_TEMPERATURE = 0.7;

export type AiStreamModel = (typeof AI_STREAM_MODELS)[number];
export type AiAssistant = (typeof AI_ASSISTANTS)[number];

export type AiConfigurationInput = {
  model?: AiStreamModel;
  assistant?: AiAssistant;
  temperature?: number;
};

export type ModelResolution =
  | {
      status: 'ok';
      openAiModel: string;
      supportsTemperature: boolean;
    }
  | { status: 'unsupported' }
  | { status: 'unconfigured' };

const DEFAULT_OPENAI_MODEL = 'gpt-5';
const DEFAULT_OPENAI_MINI_MODEL = 'gpt-5-mini';

// The backend speaks OpenAI only (src/lib/openai.ts instantiates the OpenAI
// SDK directly; no Anthropic/Google SDKs and no provider abstraction exist).
// UI display names are mapped to real OpenAI model IDs here.
//
// Only OpenAI-backed models are exposed to the UI and API.
interface StreamModelEntry {
  displayName: AiStreamModel;
  openAiModel: string | null;
  envOverrideKey: string | null;
  supportsTemperature: boolean;
}

const AI_STREAM_MODEL_CONFIG: readonly StreamModelEntry[] = [
  {
    displayName: 'GPT-5',
    openAiModel: DEFAULT_OPENAI_MODEL,
    envOverrideKey: 'OPENAI_MODEL',
    supportsTemperature: false,
  },
  {
    displayName: 'GPT-5 Mini',
    openAiModel: DEFAULT_OPENAI_MINI_MODEL,
    envOverrideKey: 'OPENAI_MODEL_MINI',
    supportsTemperature: false,
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

  return {
    status: 'ok',
    openAiModel,
    supportsTemperature: entry.supportsTemperature,
  };
}

export type AiConfigurationResolution =
  | {
      status: 'ok';
      model: string;
      assistant: AiAssistant;
      temperature?: number;
      supportsTemperature: boolean;
    }
  | Exclude<ModelResolution, { status: 'ok' }>;

export function resolveAiConfiguration(
  input: AiConfigurationInput,
): AiConfigurationResolution {
  const modelResolution = resolveStreamModel(input.model);

  if (modelResolution.status !== 'ok') {
    return modelResolution;
  }

  return {
    status: 'ok',
    model: modelResolution.openAiModel,
    assistant: input.assistant ?? DEFAULT_AI_ASSISTANT,
    temperature: modelResolution.supportsTemperature
      ? input.temperature ?? DEFAULT_AI_TEMPERATURE
      : undefined,
    supportsTemperature: modelResolution.supportsTemperature,
  };
}

export function buildOpenAiModelParameters(
  configuration: Extract<AiConfigurationResolution, { status: 'ok' }>,
): { model: string; temperature?: number } {
  return {
    model: configuration.model,
    ...(configuration.temperature === undefined
      ? {}
      : { temperature: configuration.temperature }),
  };
}
