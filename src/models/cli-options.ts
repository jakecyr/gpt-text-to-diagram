export interface CLIOptions {
  prompt: string;
  key: string;
  outputFile: `${string}.${'svg' | 'png' | 'pdf'}`;
  model: string;
  maxTokens: number;
  temperature: number;
}
