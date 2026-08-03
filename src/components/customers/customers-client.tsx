'use client';

import { useEffect, useMemo, useState } from 'react';
import { Users } from 'lucide-react';

import { useCustomers } from '@/hooks/use-customers';
import { useToast } from '@/hooks/use-toast';

import { Customer } from '@/services/customers/customers.types';
import { CustomerFormData } from '@/lib/schemas/customer.schema';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';
import { PageHeader } from '@/components/ui/page-header';

import { CustomerForm } from './customer-form';
import { CustomersTable } from './customers-table';
import { CustomersToolbar } from './customers-toolbar';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { CustomersTableSkeleton } from './customers-table-skeleton';

export function CustomersClient() {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { data = [], isLoading, error } = useCustomers();
  const toast = useToast();

  /* -------------------------------------------------------------------------- */
  /*                                    State                                   */
  /* -------------------------------------------------------------------------- */

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null,
  );

  /* -------------------------------------------------------------------------- */
  /*                                   Effects                                  */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    setCustomers(data);
  }, [data]);

  /* -------------------------------------------------------------------------- */
  /*                                     Memo                                   */
  /* -------------------------------------------------------------------------- */

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.company.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [customers, search]);

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  function handleOpenCreateModal() {
    setEditingCustomer(null);
    setOpen(true);
  }

  function handleCloseModal() {
    setEditingCustomer(null);
    setOpen(false);
  }

  function handleEdit(customer: Customer) {
    setEditingCustomer(customer);
    setOpen(true);
  }

  function handleCreateCustomer(data: CustomerFormData) {
    const newCustomer: Customer = {
      id: crypto.randomUUID(),
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

  function confirmDeleteCustomer() {
    if (!customerToDelete) return;

    setCustomers((previousCustomers) =>
      previousCustomers.filter(
        (customer) => customer.id !== customerToDelete.id,
      ),
    );

    toast.warning('Customer deleted', 'The customer was removed.');

    setCustomerToDelete(null);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  if (isLoading) {
    return <CustomersTableSkeleton />;
}

  if (error) return <p>Something went wrong.</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customers."
        actions={<Button onClick={handleOpenCreateModal}>New Customer</Button>}
      />

      <CustomersToolbar search={search} onSearchChange={setSearch} />

      {filteredCustomers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers found"
          description="Create your first customer to start managing your clients."
          action={<Button onClick={handleOpenCreateModal}>New Customer</Button>}
        />
      ) : (
        <CustomersTable
          customers={filteredCustomers}
          onEdit={handleEdit}
          onDelete={(id) => {
            const customer = customers.find((customer) => customer.id === id);

            if (customer) {
              setCustomerToDelete(customer);
            }
          }}
        />
      )}

      <Modal
        open={open}
        title={editingCustomer ? 'Edit Customer' : 'New Customer'}
        onClose={handleCloseModal}
      >
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
      <ConfirmDialog
        open={!!customerToDelete}
        title="Delete Customer"
        description={`Are you sure you want to delete "${customerToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onCancel={() => setCustomerToDelete(null)}
        onConfirm={confirmDeleteCustomer}
      />
    </div>
  );
}
