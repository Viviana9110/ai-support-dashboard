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

const assistants = [
  'Customer Support AI',
  'Sales Assistant',
  'Technical Support',
];

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
          {assistants.map((assistant) => (
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