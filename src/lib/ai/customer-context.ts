type CustomerContextSource = {
  name: string;
  email: string;
  role: string;
};

export function buildCustomerContext(customer: CustomerContextSource): string {
  return [
    'Customer',
    `Name: ${customer.name}`,
    `Email: ${customer.email}`,
    `Role: ${customer.role}`,
  ].join('\n');
}
