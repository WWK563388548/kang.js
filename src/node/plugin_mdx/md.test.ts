import { unified } from 'unified';
import * as shiki from 'shiki';
import { describe, test, expect, beforeAll } from 'vitest';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { rehypePluginPreWrapper } from './rehypePlugins/preWrapper';
import { rehypePluginShiki } from '../plugin_mdx/rehypePlugins/shiki';
import remarkMdx from 'remark-mdx';
import { remarkPluginToc } from '../plugin_mdx/remarkPlugins/toc';
import remarkStringify from 'remark-stringify';

describe('Markdown compile cases', async () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePluginPreWrapper)
    .use(rehypePluginShiki, {
      highlighter: await shiki.getHighlighter({
        themes: ['vitesse-light', 'vitesse-dark'],
        langs: ['javascript', 'typescript', 'html', 'css']
      })
    })
    .use(rehypeStringify);

  test('Compile title', async () => {
    const mdContent = '# 123';
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot('"<h1>123</h1>"');
  });

  test('Compile code', async () => {
    const mdContent = 'I am using `Island.js`';
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot(
      '"<p>I am using <code>Island.js</code></p>"'
    );
  });

  test('Compile code block', async () => {
    const mdContent = '```js\nconsole.log(123);\n```';
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot(`
      "<div class=\\"language-js\\"><span class=\\"lang\\">js</span><pre class=\\"shiki shiki-themes vitesse-light vitesse-dark\\" style=\\"background-color:#ffffff;--shiki-dark-bg:#121212;color:#393a34;--shiki-dark:#dbd7caee\\" tabindex=\\"0\\"><code><span class=\\"line\\"><span style=\\"color:#B07D48;--shiki-dark:#BD976A\\">console</span><span style=\\"color:#999999;--shiki-dark:#666666\\">.</span><span style=\\"color:#59873A;--shiki-dark:#80A665\\">log</span><span style=\\"color:#999999;--shiki-dark:#666666\\">(</span><span style=\\"color:#2F798A;--shiki-dark:#4C9A91\\">123</span><span style=\\"color:#999999;--shiki-dark:#666666\\">);</span></span>
      <span class=\\"line\\"></span></code></pre></div>"
    `);
  });

  test('Compile TOC', async () => {
    const mdContent = `# h1

## h2 \`code\`

### h3 [link](https://islandjs.dev)

#### h4

##### h5
`;
    const remarkProcessor = unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(remarkPluginToc)
      .use(remarkStringify);

    const result = remarkProcessor.processSync(mdContent);
    expect(result.value.toString().replace(mdContent, ''))
      .toMatchInlineSnapshot(`
      "
      export const toc = [
        {
          \\"id\\": \\"h2-code\\",
          \\"text\\": \\"h2 code\\",
          \\"depth\\": 2
        },
        {
          \\"id\\": \\"h3-link\\",
          \\"text\\": \\"h3 link\\",
          \\"depth\\": 3
        },
        {
          \\"id\\": \\"h4\\",
          \\"text\\": \\"h4\\",
          \\"depth\\": 4
        }
      ];
      "
    `);
  });
});
