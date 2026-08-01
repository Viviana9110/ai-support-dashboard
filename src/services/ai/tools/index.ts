import { ToolRegistry } from './registry';

import { CustomerTool } from './customer.tool';
import { TicketTool } from './ticket.tool';
import { KnowledgeTool } from './knowledge.tool';

export const registry =
  new ToolRegistry();

registry.register(
  new CustomerTool(),
);

registry.register(
  new TicketTool(),
);

registry.register(
  new KnowledgeTool(),
);