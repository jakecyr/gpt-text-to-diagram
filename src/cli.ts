import { OptionValues, program as commander } from 'commander';
import packageJSON from '../package.json';
import {
  DEFAULT_MAX_TOKENS,
  DEFAULT_MODEL,
  DEFAULT_OUTPUT_FILE,
  DEFAULT_TEMPERATURE,
  ENV_OPENAI_API_KEY,
} from './constants';
import { CLIOptions } from './models/cli-options';

export function parseCLIOptions(): CLIOptions {
  commander
    .version(packageJSON.version)
    .description('Generate a design diagram given the description of the software system.')
    .requiredOption('-p, --prompt <prompt>', 'Software system description to create design from.')
    .option('-k, --key <openAIKey>', 'OpenAI API Key.')
    .option(
      '-o, --output-file <filePath>',
      'Output filename template. Must have an extension of png, pdf, or svg.',
      DEFAULT_OUTPUT_FILE,
    )
    .option('-m, --model <modelName>', 'OpenAI completion model to use.', DEFAULT_MODEL)
    .option(
      '-c, --max-tokens <tokenCount>',
      'Make tokens to use when generating the response.',
      DEFAULT_MAX_TOKENS + '',
    )
    .option(
      '-t, --temperature <temperature>',
      'The temperature parameter to use for the GPT model generation.',
      DEFAULT_TEMPERATURE + '',
    );

  const options: OptionValues = commander.parse().opts();

  validateRawCLIOptions(options);

  return {
    prompt: options.prompt,
    key: options.key,
    outputFile: options.outputFile,
    model: options.model,
    maxTokens: parseInt(options.maxTokens),
    temperature: parseFloat(options.temperature),
  };
}

function validateRawCLIOptions(options: OptionValues) {
  const outputFileExtension = options.outputFile.slice(-3);
  const temperature = parseFloat(options.temperature) || DEFAULT_TEMPERATURE;
  const maxTokens = parseInt(options.maxTokens) || DEFAULT_MAX_TOKENS;
  const openAIKey = options.key || ENV_OPENAI_API_KEY;

  if (!openAIKey) {
    console.error(
      `Missing OpenAI API key. Set the environment variable OPENAI_KEY or pass the key into the command with the '-k' flag.`,
    );
    process.exit(1);
  }

  if (!['png', 'svg', 'pdf'].includes(outputFileExtension)) {
    console.error(
      `Invalid output file extension '${outputFileExtension}'. Expected: png, svg, or pdf.`,
    );
    process.exit(1);
  }

  if (temperature < 0 || temperature > 1) {
    console.error(
      `Invalid temperature value. Expected value to be >=0 and <=1, but received ${temperature}.`,
    );
    process.exit(1);
  }

  if (maxTokens < 0) {
    console.error(`Invalid max tokens value. Expected value to be >0, but received ${maxTokens}.`);
    process.exit(1);
  }
}
