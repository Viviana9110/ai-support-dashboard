'use client';

import { Customer } from '@/services/customers/customers.types';

import { CustomerRow } from './customer-row';

interface CustomersTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
}

export function CustomersTable({
  customers,
  onEdit,
  onDelete,
}: CustomersTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="w-full">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Company</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <CustomerRow
              key={customer.id}
              customer={customer}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
