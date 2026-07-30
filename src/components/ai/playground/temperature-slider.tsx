'use client';

import { Slider } from '@/components/ui/slider';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export function TemperatureSlider({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">

        <label className="text-sm font-medium">
          Temperature
        </label>

        <span className="text-muted-foreground text-sm">
          {value.toFixed(1)}
        </span>

      </div>

      <Slider
        value={[value]}
        min={0}
        max={2}
        step={0.1}
        onValueChange={(value) =>
          onChange(value[0])
        }
      />
    </div>
  );
}