'use client';

import { useMemo, useState } from 'react';
import { Users } from 'lucide-react';

import {
  useCreateCustomer,
  useCustomers,
  useDeleteCustomer,
  useUpdateCustomer,
} from '@/hooks/use-customers';
import { useToast } from '@/hooks/use-toast';

import type { Customer } from '@/services/customers/customers.types';
import type { CustomerFormData } from '@/lib/schemas/customer.schema';
import { getApiErrorMessage } from '@/services/api';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';
import { PageHeader } from '@/components/ui/page-header';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

import { CustomerForm } from './customer-form';
import { CustomersTable } from './customers-table';
import { CustomersToolbar } from './customers-toolbar';
import { CustomersTableSkeleton } from './customers-table-skeleton';

export function CustomersClient() {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { data = [], isLoading, error } = useCustomers();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();
  const toast = useToast();

  /* -------------------------------------------------------------------------- */
  /*                                    State                                   */
  /* -------------------------------------------------------------------------- */

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null,
  );

  /* -------------------------------------------------------------------------- */
  /*                                     Memo                                   */
  /* -------------------------------------------------------------------------- */

  const filteredCustomers = useMemo(() => {
    return data.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.company.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [data, search]);

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  function handleOpenCreateModal() {
    setSubmitError(null);
    setEditingCustomer(null);
    setOpen(true);
  }

  function handleCloseModal() {
    if (createCustomer.isPending || updateCustomer.isPending) return;

    setSubmitError(null);
    setEditingCustomer(null);
    setOpen(false);
  }

  function handleEdit(customer: Customer) {
    setSubmitError(null);
    setEditingCustomer(customer);
    setOpen(true);
  }

  async function handleCreateCustomer(data: CustomerFormData) {
    setSubmitError(null);

    try {
      await createCustomer.mutateAsync(data);

      setOpen(false);

      toast.success(
        'Customer created',
        'The customer was created successfully.',
      );
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error,
          'Something went wrong while creating the customer.',
        ),
      );

      toast.error('Failed to create customer', 'Something went wrong.');
    }
  }

  async function handleEditCustomer(data: CustomerFormData) {
    if (!editingCustomer) return;

    setSubmitError(null);

    try {
      await updateCustomer.mutateAsync({
        id: editingCustomer.id,
        payload: data,
      });

      setEditingCustomer(null);
      setOpen(false);

      toast.success('Customer updated', 'The customer information was updated.');
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error,
          'Something went wrong while updating the customer.',
        ),
      );

      toast.error('Failed to update customer', 'Something went wrong.');
    }
  }

  async function handleDeleteCustomer() {
    if (!customerToDelete) return;

    try {
      await deleteCustomer.mutateAsync(customerToDelete.id);

      setCustomerToDelete(null);

      toast.success('Customer deleted', 'The customer was deleted successfully.');
    } catch {
      toast.error('Failed to delete customer', 'Something went wrong.');
    }
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

      <CustomersToolbar
        search={search}
        onSearchChange={setSearch}
        onNewCustomer={handleOpenCreateModal}
      />

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
            const customer = data.find((customer) => customer.id === id);

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
          isSubmitting={createCustomer.isPending || updateCustomer.isPending}
          submitError={submitError}
          onCancel={handleCloseModal}
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
        description={`Are you sure you want to delete "${customerToDelete?.name}"? This action can be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        loading={deleteCustomer.isPending}
        onCancel={() => setCustomerToDelete(null)}
        onConfirm={handleDeleteCustomer}
      />
    </div>
  );
}
