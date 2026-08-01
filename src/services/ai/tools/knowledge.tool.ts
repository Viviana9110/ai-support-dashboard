import {
  AITool,
  ToolResult,
} from './base.tool';

export class KnowledgeTool
  implements
    AITool<
      { query: string },
      string[]
    >
{
  name = 'searchKnowledge';

  description =
    'Search articles inside the Knowledge Base.';

  async execute({
    query,
  }): Promise<ToolResult<string[]>> {
    console.log(query);

    return {
      success: true,

      data: [],
    };
  }
}