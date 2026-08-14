type CustomerContextSource = {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
};

export function buildCustomerContext(customer: CustomerContextSource): string {
  return [
    'Customer',
    `ID: ${customer.id}`,
    `Name: ${customer.name}`,
    `Email: ${customer.email}`,
    `Company: ${customer.company}`,
    `Status: ${customer.status}`,
  ].join('\n');
}
