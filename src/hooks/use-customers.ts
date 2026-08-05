'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createCustomer,
  deleteCustomer,
  getCustomerDetail,
  getCustomers,
  restoreCustomer,
  updateCustomer,
} from '@/services/customers/customers.service';

import type { Customer } from '@/services/customers/customers.types';
import type { UpdateCustomerPayload } from '@/services/customers/customers.service';

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });
}

export function useCustomerDetail(id: string) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => getCustomerDetail(id),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

interface UpdateCustomerInput {
  id: string;
  payload: UpdateCustomerPayload;
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateCustomerInput) =>
      updateCustomer(id, payload),

    onMutate: async ({ id, payload }: UpdateCustomerInput) => {
      await queryClient.cancelQueries({ queryKey: ['customers'] });

      const previous = queryClient.getQueryData<Customer[]>(['customers']);

      queryClient.setQueryData<Customer[]>(['customers'], (old = []) =>
        old.map((customer) =>
          customer.id === id ? { ...customer, ...payload } : customer,
        ),
      );

      return { previous };
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['customers'], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['customers'] });

      const previous = queryClient.getQueryData<Customer[]>(['customers']);

      queryClient.setQueryData<Customer[]>(['customers'], (old = []) =>
        old.filter((customer) => customer.id !== id),
      );

      return { previous };
    },

    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['customers'], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useRestoreCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
