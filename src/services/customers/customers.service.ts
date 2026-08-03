import { api } from '../api';
import type { Customer } from './customers.types';

export type CreateCustomerPayload = Pick<
  Customer,
  'name' | 'email' | 'company' | 'status'
>;

export type UpdateCustomerPayload = Partial<CreateCustomerPayload>;

export async function getCustomers(): Promise<Customer[]> {
  const { data } = await api.get<Customer[]>('/customers');

  return data;
}

export async function getCustomer(id: string): Promise<Customer> {
  const { data } = await api.get<Customer>(`/customers/${id}`);

  return data;
}

export async function createCustomer(
  payload: CreateCustomerPayload,
): Promise<Customer> {
  const { data } = await api.post<Customer>('/customers', payload);

  return data;
}

export async function updateCustomer(
  id: string,
  payload: UpdateCustomerPayload,
): Promise<Customer> {
  const { data } = await api.patch<Customer>(`/customers/${id}`, payload);

  return data;
}

export async function deleteCustomer(id: string): Promise<void> {
  await api.delete(`/customers/${id}`);
}
