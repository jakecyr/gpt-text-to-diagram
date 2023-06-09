// @ts-check

import { Configuration, OpenAIApi } from 'openai';
import { config } from 'dotenv';
import { run } from '@mermaid-js/mermaid-cli';
import { writeFileSync } from 'fs';

config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

(async () => {
  const openai = new OpenAIApi(configuration);

  const prompt = `I want to design a web system where users can enter text describing their software system and a design diagram will be auto-generated and displayed.`;

  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    max_tokens: 500,
    temperature: 0.2,
    prompt: `
      You are a mermaid markdown generation system.
      Return only markdown code of a design diagram in mermaid markdown. 
      Do not respond with any other text.

      Input: ${prompt}

      Markdown Code:
      \`\`\`mermaid
    `,
  });

  const markdownResponse = completion.data.choices[0].text;
  const diagramMarkdown = '```mermaid\n' + markdownResponse;
  const mermaidMarkdownFile = './mermaid.md';

  writeFileSync(mermaidMarkdownFile, diagramMarkdown);

  try {
    await run(mermaidMarkdownFile, 'output.svg');
  } catch (e) {
    console.error('Error in GPT markdown response:', e);
  }
})();
