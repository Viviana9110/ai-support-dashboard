import { ContextEngine } from './context/context-engine';

export class AIService {
  private contextEngine = new ContextEngine();

  async sendMessage(message: string) {
    const context =
      await this.contextEngine.create();

    const prompt = `
${context}

User

${message}
`;

    console.log(prompt);

    // Aquí luego llamaremos a OpenAI
    // const response = await openAIService.send(prompt);

    return {
      prompt,
    };
  }
}

export const aiService = new AIService();