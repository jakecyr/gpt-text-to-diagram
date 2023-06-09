import { Configuration, OpenAIApi } from 'openai';
import { config } from 'dotenv';
import { run } from '@mermaid-js/mermaid-cli';
import { writeFile, rm } from 'fs/promises';
import { v4 as uuid } from 'uuid';

config();

(async () => {
  const prompt = `I want to design a web system where users can enter text describing their software system and a design diagram will be auto-generated and displayed.`;
  const markdown = await generateDesignDiagramMarkdown(prompt);
  const designImagePath = './diagram.png';

  await convertMarkdownToImage(markdown, designImagePath);
})();

async function completeText(
  prompt,
  model = 'text-davinci-003',
  max_tokens = 500,
  temperature = 0.2,
) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const completion = await openai.createCompletion({
    model,
    max_tokens,
    temperature,
    prompt,
  });

  return completion.data.choices[0].text;
}

async function generateDesignDiagramMarkdown(designDescription) {
  const generatedMarkdown = await completeText(`
    You are a mermaid markdown generation system.
    Return only markdown code of a design diagram in mermaid markdown. 
    Do not respond with any other text.

    Input: ${designDescription}

    Markdown Code:
    \`\`\`mermaid
  `);

  return '```mermaid\n' + generatedMarkdown;
}

async function convertMarkdownToImage(markdown, outputFilepath = 'output.png') {
  const mermaidMarkdownFile = `./${uuid()}.md`;

  await writeFile(mermaidMarkdownFile, markdown);

  try {
    console.info(`Converting markdown to image ${outputFilepath}...`);
    await run(mermaidMarkdownFile, outputFilepath, { puppeteerConfig: { headless: 'new' } });
  } catch (e) {
    console.error(`Error converting markdown to image: ${e}`);
  } finally {
    console.debug('Removing temporary markdown file...');
    await rm(mermaidMarkdownFile);
  }
}
