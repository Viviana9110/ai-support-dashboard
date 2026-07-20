'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  customerSchema,
  CustomerFormData,
} from '@/lib/schemas/customer.schema';

import { Customer } from '@/services/customers/customers.types';

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: CustomerFormData) => void;
}

export function CustomerForm({ customer, onSubmit }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name ?? '',
      email: customer?.email ?? '',
      company: customer?.company ?? '',
      status: customer?.status ?? 'Active',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>

        <input
          {...register('name')}
          className="w-full rounded-lg border px-4 py-2"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>

        <input
          {...register('email')}
          className="w-full rounded-lg border px-4 py-2"
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Company</label>

        <input
          {...register('company')}
          className="w-full rounded-lg border px-4 py-2"
        />

        {errors.company && (
          <p className="mt-1 text-sm text-red-500">{errors.company.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Status</label>

        <select
          {...register('status')}
          className="w-full rounded-lg border px-4 py-2"
        >
          <option value="Active">Active</option>

          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Save Customer
        </button>
      </div>
    </form>
  );
}
