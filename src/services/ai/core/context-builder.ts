interface Context {
  knowledge?: string;

  customer?: string;

  tickets?: string[];
}

export function buildContext(
  context: Context,
) {
  return `
Knowledge

${context.knowledge}

Customer

${context.customer}

Tickets

${context.tickets?.join('\n')}
`;
}