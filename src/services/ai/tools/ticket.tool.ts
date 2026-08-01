export class TicketTool
  implements
    AITool<
      { customerId: string },
      unknown[]
    >
{
  name = 'searchTickets';

  description =
    'Search tickets from a customer';

  async execute() {
    return {
      success: true,

      data: [],
    };
  }
}