'use client';

import { useMemo, useState, useEffect } from 'react';

import { CustomersToolbar } from './customers-toolbar';
import { CustomersTable } from './customers-table';

import { useCustomers } from '@/hooks/use-customers';
import { Modal } from '@/components/ui/modal';
import { CustomerForm } from './customer-form';
import { Customer } from '@/services/customers/customers.types';
import { CustomerFormData } from '@/lib/schemas/customer.schema';
import { useToast } from '@/hooks/use-toast';

export function CustomersClient() {
  const { data = [], isLoading, error } = useCustomers();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const toast = useToast();

  useEffect(() => {
    setCustomers(data);
  }, [data]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.company.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [customers, search]);

  function handleCreateCustomer(data: CustomerFormData) {
    const newCustomer: Customer = {
      id: Date.now(),
      ...data,
    };

    setCustomers((previousCustomers) => [...previousCustomers, newCustomer]);

    setOpen(false);
    toast.success('Customer created', 'The customer was created successfully.');
  }

  function handleEditCustomer(data: CustomerFormData) {
    if (!editingCustomer) return;

    setCustomers((previousCustomers) =>
      previousCustomers.map((customer) =>
        customer.id === editingCustomer.id
          ? {
              ...customer,
              ...data,
            }
          : customer,
      ),
    );

    setEditingCustomer(null);
    setOpen(false);
    toast.info('Customer updated', 'The customer information was updated.');
  }
  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Something went wrong.</p>;

  return (
    <div className="space-y-6">
      <CustomersToolbar
        search={search}
        onSearchChange={setSearch}
        onNewCustomer={() => {
          setEditingCustomer(null);
          setOpen(true);
        }}
      />

      <CustomersTable
        customers={filteredCustomers}
        onEdit={(customer) => {
          setEditingCustomer(customer);
          setOpen(true);
        }}
        onDelete={(id) => {
          setCustomers((previousCustomers) =>
            previousCustomers.filter((customer) => customer.id !== id),
          );

          toast.warning('Customer deleted', 'The customer was removed.');
        }}
      />

      <Modal
        open={open}
        title={editingCustomer ? 'Edit Customer' : 'New Customer'}
        onClose={() => {
          setOpen(false);
          setEditingCustomer(null);
        }}
      >
        {' '}
        <CustomerForm
          customer={editingCustomer ?? undefined}
          onSubmit={(data) => {
            if (editingCustomer) {
              handleEditCustomer(data);
            } else {
              handleCreateCustomer(data);
            }
          }}
        />
      </Modal>
    </div>
  );
}
