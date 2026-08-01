import { AIContext } from './context-types';

export function buildContext(
  context: AIContext,
) {
  return `
Customer

${JSON.stringify(context.customer)}

Ticket

${JSON.stringify(context.ticket)}

Knowledge

${JSON.stringify(context.knowledge)}

Analytics

${JSON.stringify(context.analytics)}
`;
}