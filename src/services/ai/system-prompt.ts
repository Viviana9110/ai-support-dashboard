import { CUSTOMER_SUPPORT_PROMPT } from './prompts';

export function buildSystemPrompt() {
  return `
${CUSTOMER_SUPPORT_PROMPT}

Current date:

${new Date().toISOString()}
`;
}