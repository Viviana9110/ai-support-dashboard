export type CustomerStatus = 'Active' | 'Inactive';

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: CustomerStatus;
}
