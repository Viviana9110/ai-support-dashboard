export type CustomerStatus = 'Active' | 'Inactive';

export interface Customer {
  id: number;
  name: string;
  email: string;
  company: string;
  status: CustomerStatus;
}
