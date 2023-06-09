import { Configuration, OpenAIApi } from 'openai';
import { config } from 'dotenv';
import { convertMarkdownMermaidToImage } from 'markdown-mermaid-exporter';

config();

(async () => {
  const prompt = `I want to design a web system where users can enter text describing their software system and a design diagram will be auto-generated and displayed.`;
  const markdown = await generateDesignDiagramMarkdown(prompt);
  const designImagePath = './diagram.png';

  await convertMarkdownMermaidToImage(markdown, designImagePath);
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
