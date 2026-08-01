export class CustomerTool
  implements
    AITool<
      { query: string },
      unknown[]
    >
{
  name = 'searchCustomers';

  description =
    'Search customers';

  async execute() {
    return {
      success: true,

      data: [],
    };
  }
}