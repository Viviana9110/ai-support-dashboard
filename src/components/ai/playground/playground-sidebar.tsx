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
}

export function PlaygroundSidebar({
  assistant,
  model,
  temperature,
  onAssistantChange,
  onModelChange,
  onTemperatureChange,
  onClear,
}: Props) {
  return (
    <aside className="w-80 border-r p-6">
      <div className="space-y-8">

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
          className="w-full"
          onClick={onClear}
        >
          Clear Conversation
        </Button>

      </div>
    </aside>
  );
}