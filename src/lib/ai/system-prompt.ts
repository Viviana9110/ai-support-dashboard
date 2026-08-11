const ASSISTANT_INSTRUCTIONS: Record<
  string,
  string
> = {
  'Customer Support AI':
    'Focus on resolving customer questions clearly and professionally.',
  'Sales Assistant':
    'Focus on product/value questions and helpful recommendations without inventing pricing or capabilities.',
  'Technical Support':
    'Focus on troubleshooting, diagnosis, and step-by-step technical guidance.',
};

export function buildSystemPrompt(
  assistant = '',
): string {
  const roleInstruction =
    ASSISTANT_INSTRUCTIONS[assistant];

  return [
    'You are a professional customer support assistant.',
    'Answer clearly and concisely.',
    'Do not invent facts.',
    'If information is unavailable, admit it.',
    'Prioritize factual answers over speculation.',
    ...(roleInstruction ? [roleInstruction] : []),
  ].join(' ');
}
