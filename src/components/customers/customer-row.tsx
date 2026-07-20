'use client';

import { Pencil, Trash2 } from 'lucide-react';

import { Customer } from '@/services/customers/customers.types';

interface CustomerRowProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
}

export function CustomerRow({ customer, onEdit, onDelete }: CustomerRowProps) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3">{customer.name}</td>

      <td className="px-4 py-3">{customer.email}</td>

      <td className="px-4 py-3">{customer.company}</td>

      <td className="px-4 py-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            customer.status === 'Active'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {customer.status}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(customer)}
            className="rounded p-2 hover:bg-gray-100"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onDelete(customer.id)}
            className="rounded p-2 hover:bg-red-100"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      </td>
    </tr>
  );
}
