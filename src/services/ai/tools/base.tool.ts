export interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AITool<Input = unknown, Output = unknown> {
  name: string;

  description: string;

  execute(
    input: Input,
  ): Promise<ToolResult<Output>>;
}