import { describe, expect, it, vi } from 'vitest';

import {
  AI_STREAM_MODELS,
  buildOpenAiModelParameters,
  resolveAiConfiguration,
} from '../model-config';

describe('AI model configuration', () => {
  it('resolves the same OpenAI configuration inputs for chat and streaming', () => {
    vi.stubEnv('OPENAI_MODEL_MINI', 'configured-mini');

    const configuration = resolveAiConfiguration({
      model: 'GPT-5 Mini',
      assistant: 'Technical Support',
      temperature: 1.2,
    });

    expect(configuration).toEqual({
      status: 'ok',
      model: 'configured-mini',
      assistant: 'Technical Support',
      temperature: undefined,
      supportsTemperature: false,
    });
  });

  it('uses OPENAI_MODEL as the safe fallback for the default model', () => {
    vi.stubEnv('OPENAI_MODEL', 'configured-default');

    expect(resolveAiConfiguration({})).toMatchObject({
      status: 'ok',
      model: 'configured-default',
      supportsTemperature: false,
    });
  });

  it('keeps temperature for a compatible model', () => {
    const configuration = {
      status: 'ok' as const,
      model: 'gpt-4.1',
      assistant: 'Customer Support AI' as const,
      temperature: 0.4,
      supportsTemperature: true,
    };

    expect(buildOpenAiModelParameters(configuration)).toEqual({
      model: 'gpt-4.1',
      temperature: 0.4,
    });
  });

  it('omits temperature for GPT-5 models', () => {
    const configuration = resolveAiConfiguration({
      model: 'GPT-5',
      temperature: 1.2,
    });

    if (configuration.status !== 'ok') {
      throw new Error('Expected GPT-5 configuration to resolve.');
    }

    expect(configuration).toMatchObject({
      status: 'ok',
      supportsTemperature: false,
    });
    expect(buildOpenAiModelParameters(configuration)).not.toHaveProperty(
      'temperature',
    );
  });

  it('uses the same resolved request parameters for chat and streaming', () => {
    const configuration = resolveAiConfiguration({
      model: 'GPT-5 Mini',
      temperature: 1.2,
    });

    if (configuration.status !== 'ok') {
      throw new Error('Expected GPT-5 Mini configuration to resolve.');
    }

    expect(buildOpenAiModelParameters(configuration)).toEqual(
      buildOpenAiModelParameters(configuration),
    );
  });

  it('does not resolve unsupported providers to an OpenAI model', () => {
    const unsupported = resolveAiConfiguration({
      model: 'Claude Sonnet' as (typeof AI_STREAM_MODELS)[number],
    });

    expect(unsupported).toEqual({ status: 'unsupported' });
    expect(AI_STREAM_MODELS).toEqual(['GPT-5', 'GPT-5 Mini']);
  });
});
