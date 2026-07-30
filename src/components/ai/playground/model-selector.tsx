'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const models = [
  'GPT-5',
  'GPT-5 Mini',
  'Claude Sonnet',
  'Gemini 2.5 Pro',
];

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
          {models.map((model) => (
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