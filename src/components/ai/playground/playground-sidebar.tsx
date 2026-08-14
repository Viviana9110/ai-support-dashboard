'use client';

import { Button } from '@/components/ui/button';

import { AssistantSelector } from './assistant-selector';
import { ModelSelector } from './model-selector';
import { TemperatureSlider } from './temperature-slider';

interface Props {
  assistant: string;
  model: string;
  temperature: number;

  onAssistantChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onTemperatureChange: (value: number) => void;

  onClear: () => void;
  clearDisabled?: boolean;
}

export function PlaygroundSidebar({
  assistant,
  model,
  temperature,
  onAssistantChange,
  onModelChange,
  onTemperatureChange,
  onClear,
  clearDisabled = false,
}: Props) {
  return (
    <aside className="w-full shrink-0 border-b p-4 md:w-80 md:border-b-0 md:border-r md:p-6">
      <div className="grid gap-5 sm:grid-cols-2 md:block md:space-y-8">

        <AssistantSelector
          value={assistant}
          onChange={onAssistantChange}
        />

        <ModelSelector
          value={model}
          onChange={onModelChange}
        />

        <TemperatureSlider
          value={temperature}
          onChange={onTemperatureChange}
        />

        <Button
          variant="outline"
          className="w-full sm:col-span-2 md:mt-8"
          onClick={onClear}
          disabled={clearDisabled}
        >
          Clear Conversation
        </Button>

      </div>
    </aside>
  );
}
