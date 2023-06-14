import { config } from 'dotenv';

config();

export const DEFAULT_MODEL: string = 'text-davinci-003';
export const DEFAULT_OUTPUT_FILE: string = 'diagram.png';
export const DEFAULT_MAX_TOKENS: number = 500;
export const DEFAULT_TEMPERATURE: number = 0.2;
export const ENV_OPENAI_API_KEY = process.env.OPENAI_KEY;
