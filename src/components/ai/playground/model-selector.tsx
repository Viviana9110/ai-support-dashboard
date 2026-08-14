'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AI_STREAM_MODELS } from '@/lib/ai/model-config';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Model
      </label>

      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {AI_STREAM_MODELS.map((model) => (
            <SelectItem
              key={model}
              value={model}
            >
              {model}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
