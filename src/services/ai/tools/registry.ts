import { AITool } from './base.tool';

export class ToolRegistry {
  private tools = new Map<
    string,
    AITool
  >();

  register(tool: AITool) {
    this.tools.set(tool.name, tool);
  }

  get(name: string) {
    return this.tools.get(name);
  }

  list() {
    return [...this.tools.values()];
  }
}