#!/usr/bin/env node

import { convertMarkdownMermaidToImage } from 'markdown-mermaid-exporter';
import { parseCLIOptions } from './cli';
import { CLIOptions } from './models/cli-options';
import { completeText } from './complete-text';

(async () => {
  const options: CLIOptions = parseCLIOptions();

  const promptForCompletion = `
    You are a mermaid markdown generation system.
    Return only markdown code of a design diagram in mermaid markdown. 
    Do not respond with any other text.

    Input: ${options.prompt}

    Markdown Code:
    \`\`\`mermaid
  `;

  const generatedMarkdown = await completeText(
    promptForCompletion,
    options.key,
    options.model,
    options.maxTokens,
    options.temperature,
  );

  const formattedMarkdown = '```mermaid\n' + generatedMarkdown;

  await convertMarkdownMermaidToImage(formattedMarkdown, options.outputFile);
})();
