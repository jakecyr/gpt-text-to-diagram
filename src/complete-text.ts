import { Configuration, OpenAIApi } from 'openai';
import {
  ENV_OPENAI_API_KEY,
  DEFAULT_MODEL,
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
} from './constants';
import { AxiosError } from 'axios';

export async function completeText(
  prompt: string,
  openAiApiKey: string = ENV_OPENAI_API_KEY,
  model: string = DEFAULT_MODEL,
  max_tokens: number = DEFAULT_MAX_TOKENS,
  temperature: number = DEFAULT_TEMPERATURE,
): Promise<string> {
  const configuration = new Configuration({
    apiKey: openAiApiKey,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createCompletion({
      model,
      max_tokens,
      temperature,
      prompt,
    });

    return completion.data.choices[0].text;
  } catch (e) {
    if (e?.isAxiosError) {
      const axiosError: AxiosError = e;

      if (axiosError.response.status === 401) {
        console.error(
          `Error requesting completion from OpenAI API with status ${axiosError.response.status}. Is your API key correct?`,
        );
      } else {
        console.error(
          `Error requesting completion from OpenAI API with status ${
            axiosError.response.status
          }.\n${JSON.stringify(axiosError.response.data)}`,
        );
      }

      process.exit(1);
    }
  }
}
