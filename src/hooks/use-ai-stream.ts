'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type StreamHandlers = {
  conversationId: string;
  message: string;
  model: string;
  temperature: number;
  assistant: string;
  onDelta: (content: string) => void;
  onDone: (payload: StreamEvent) => void;
  onError: () => void;
};

export type StreamEvent = {
  type?: string;
  content?: unknown;
  userMessage?: unknown;
  assistantMessage?: unknown;
};

type StreamEventHandlers = Pick<
  StreamHandlers,
  'onDelta' | 'onDone' | 'onError'
>;

export type StreamEventResult =
  | 'continue'
  | 'done'
  | 'error'
  | 'stale';

export function handleAiStreamEvent(
  event: StreamEvent,
  token: number,
  currentToken: number,
  handlers: StreamEventHandlers,
): StreamEventResult {
  if (token !== currentToken) return 'stale';

  if (
    event.type === 'delta' &&
    typeof event.content === 'string'
  ) {
    handlers.onDelta(event.content);
    return 'continue';
  }

  if (event.type === 'done') {
    handlers.onDone(event);
    return 'done';
  }

  if (event.type === 'error') {
    handlers.onError();
    return 'error';
  }

  return 'continue';
}

export function useAiStream() {
  const [isStreaming, setIsStreaming] =
    useState(false);

  const controllerRef =
    useRef<AbortController | null>(null);

  const streamingToken = useRef(0);

  const cancelStream = useCallback(() => {
    streamingToken.current += 1;
    controllerRef.current?.abort();
    setIsStreaming(false);
  }, []);

  useEffect(
    () => () => {
      streamingToken.current += 1;
      controllerRef.current?.abort();
    },
    [],
  );

  const startStream = useCallback(
    async ({
      conversationId,
      message,
      model,
      temperature,
      assistant,
      onDelta,
      onDone,
      onError,
    }: StreamHandlers): Promise<boolean> => {
      streamingToken.current += 1;
      controllerRef.current?.abort();

      const controller = new AbortController();
      controllerRef.current = controller;

      const token = streamingToken.current;
      let completed = false;
      let errorReported = false;

      setIsStreaming(true);

      try {
        const response = await fetch(
          '/api/chat/stream',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              conversationId,
              message,
              model,
              temperature,
              assistant,
            }),

            signal: controller.signal,
          },
        );

        if (!response.ok || !response.body) {
          if (token === streamingToken.current) {
            onError();
          }
          return false;
        }

        const reader =
          response.body.getReader();

        const decoder = new TextDecoder();

        let buffer = '';

        while (true) {
          const { value, done } =
            await reader.read();

          if (done) break;

          buffer += decoder.decode(value, {
            stream: true,
          });

          const lines = buffer.split('\n');

          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data:')) {
              continue;
            }

            const data = line
              .slice(5)
              .trim();

            if (!data) continue;

            let event: StreamEvent;

            try {
              event = JSON.parse(data);
            } catch {
              continue;
            }

            const result = handleAiStreamEvent(
              event,
              token,
              streamingToken.current,
              { onDelta, onDone, onError },
            );

            if (result === 'done') {
              completed = true;
              break;
            }

            if (result === 'error') {
              errorReported = true;
              break;
            }
          }
        }

        if (
          token === streamingToken.current &&
          !completed &&
          !errorReported
        ) {
          onError();
          errorReported = true;
        }

        return completed;
      } catch {
        if (token === streamingToken.current) {
          if (!controller.signal.aborted && !errorReported) {
            onError();
            errorReported = true;
          }
        }

        return false;
      } finally {
        if (token === streamingToken.current) {
          setIsStreaming(false);
        }
      }
    },
    [],
  );

  return { startStream, cancelStream, isStreaming };
}
