'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AI_ASSISTANTS } from '@/lib/ai/model-config';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function AssistantSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Assistant
      </label>

      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {AI_ASSISTANTS.map((assistant) => (
            <SelectItem
              key={assistant}
              value={assistant}
            >
              {assistant}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
