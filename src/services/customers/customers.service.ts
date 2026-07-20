import { Customer } from './customers.types';

export async function getCustomers(): Promise<Customer[]> {
  return [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@test.com',
      company: 'Google',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Sarah Lee',
      email: 'sarah@test.com',
      company: 'Microsoft',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Michael Smith',
      email: 'mike@test.com',
      company: 'Amazon',
      status: 'Inactive',
    },
    {
      id: 4,
      name: 'Emily Brown',
      email: 'emily@test.com',
      company: 'Netflix',
      status: 'Active',
    },
    {
      id: 5,
      name: 'Daniel Wilson',
      email: 'daniel@test.com',
      company: 'Spotify',
      status: 'Inactive',
    },
  ];
}
