interface PromptOptions {
  assistant: string;
  language: string;
  company?: string;
}

export function buildPrompt(
  options: PromptOptions,
) {
  return `
You are ${options.assistant}.

Language:
${options.language}

Company:
${options.company ?? 'Unknown'}

Answer using Markdown.

Be concise.

Always be helpful.
`;
}