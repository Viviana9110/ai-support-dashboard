'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  customerSchema,
} from '@/lib/schemas/customer.schema';

import type { CustomerFormData } from '@/lib/schemas/customer.schema';
import type { Customer } from '@/services/customers/customers.types';

interface CustomerFormProps {
  customer?: Customer;
  isSubmitting: boolean;
  submitError: string | null;
  onCancel: () => void;
  onSubmit: (data: CustomerFormData) => void;
}

export function CustomerForm({
  customer,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      status: 'Active',
    },
  });

  useEffect(() => {
    if (!customer) {
      reset({
        name: '',
        email: '',
        company: '',
        status: 'Active',
      });
      return;
    }

    reset({
      name: customer.name,
      email: customer.email,
      company: customer.company,
      status: customer.status,
    });
  }, [customer, reset]);

  const isEditing = !!customer;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>

        <Input
          {...register('name')}
          placeholder="Customer full name"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>

        <Input
          {...register('email')}
          placeholder="name@company.com"
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Company</label>

        <Input
          {...register('company')}
          placeholder="Company name"
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

      {submitError && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {submitError}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? 'Saving...'
              : 'Creating...'
            : isEditing
              ? 'Save Changes'
              : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
}
