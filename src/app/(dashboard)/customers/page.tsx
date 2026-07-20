import { CustomersClient } from '@/components/customers/customers-client';

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Customers</h1>

        <p className="text-muted-foreground">Manage your customers</p>
      </div>

      <CustomersClient />
    </div>
  );
}
