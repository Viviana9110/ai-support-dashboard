'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Customer } from '@/services/customers/customers.types';

interface Props {
  value: string | null;
  customers: Customer[];
  onChange: (value: string | null) => void;
}

export function CustomerSelector({ value, customers, onChange }: Props) {
  return (
    <div className="space-y-2 sm:col-span-2">
      <label className="text-sm font-medium">Customer context</label>
      <Select
        value={value ?? 'none'}
        onValueChange={(next) => onChange(next === 'none' ? null : next)}
      >
        <SelectTrigger>
          <SelectValue placeholder="No customer context" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No customer context</SelectItem>
          {customers.map((customer) => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.name} · {customer.company}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
