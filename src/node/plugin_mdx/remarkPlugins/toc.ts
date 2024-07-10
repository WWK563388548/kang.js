import type { Plugin } from 'unified';
import Slugger from 'github-slugger';
import { visit } from 'unist-util-visit';
import { Root } from 'mdast';
import type { MdxjsEsm } from 'mdast-util-mdxjs-esm';
import { parse } from 'acorn';

interface ChildNode {
  type: 'link' | 'text' | 'inlineCode';
  value: string;
  children?: ChildNode[];
}

interface TocItem {
  id: string;
  text: string;
  depth: number;
}

const slugger = new Slugger();

export const remarkPluginToc: Plugin<[], Root> = () => {
  return (tree) => {
    // Initialize toc Array
    const toc: TocItem[] = [];
    visit(tree, 'heading', (node) => {
      if (!node.depth || !node.children) {
        return;
      }
      // h2 ~ h4
      if (node.depth > 1 && node.depth < 5) {
        // node.children is an array containing several cases:
        // 1. Text node, such as '## title'
        // Structure:
        // {
        //   type: 'text',
        //   value: 'title'
        // }
        // 2. Link node, such as '## [title](/path)'
        // Structure:
        // {
        //   type: 'link',
        //   children: [
        //     {
        //       type: 'text',
        //       value: 'title'
        //     }
        //   ]
        // }
        // 3. Inline code node, such as '## `title`'
        // Structure:
        // {
        //   type: 'inlineCode',
        //   value: 'title'
        // }

        const originText = (node.children as ChildNode[])
          .map((child) => {
            switch (child.type) {
              case 'link':
                return child.children?.map((c) => c.value).join('') || '';
              default:
                return child.value;
            }
          })
          .join('');
        // Normalize the title text
        const id = slugger.slug(originText);
        toc.push({
          id,
          text: originText,
          depth: node.depth
        });
      }
    });

    const insertCode = `export const toc = ${JSON.stringify(toc, null, 2)};`;
    tree.children.push({
      type: 'mdxjsEsm',
      value: insertCode,
      data: {
        estree: parse(insertCode, {
          ecmaVersion: 2020,
          sourceType: 'module'
        })
      }
    } as MdxjsEsm);
  };
};
