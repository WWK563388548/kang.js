import { InlineConfig, build as viteBuild } from 'vite';
import type { RollupOutput } from 'rollup';
import pluginReact from '@vitejs/plugin-react';
import path, { join } from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import { SiteConfig } from 'shared/types';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import { createVitePlugins } from './vitePlugins';

export async function bundle(root: string, config: SiteConfig) {
  const resolveViteConfig = (isServer: boolean): InlineConfig => ({
    mode: 'production',
    root,
    plugins: createVitePlugins(config),
    ssr: {
      // This configuration prevents cjs products from requiring ESM products, since the products of react-router-dom are in ESM format
      noExternal: ['react-router-dom']
    },
    build: {
      minify: false,
      ssr: isServer,
      outDir: isServer ? path.join(root, '.temp') : 'build',
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? 'cjs' : 'esm'
        }
      }
    }
  });
  const spinner = ora();
  console.log('Building client + server bundles...');

  try {
    const [clientBundle, serverBundle] = await Promise.all([
      // Client build
      viteBuild(resolveViteConfig(false)),
      // Server build
      viteBuild(resolveViteConfig(true))
    ]);
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (error) {
    console.error(error);
  }
}

export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  console.log('Rendering page in server side...');
  const appHtml = render();
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>title</title>
        <meta name="description" content="xxx">
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script type="module" src="/${clientChunk?.fileName}"></script>
      </body>
    </html>
  `.trim();
  await fs.ensureDir(join(root, 'build'));
  await fs.writeFile(join(root, 'build/index.html'), html);
  await fs.remove(join(root, '.temp'));
}

export async function build(root: string, config: SiteConfig) {
  const [clientBundle] = await bundle(root, config);
  // add ssr entry
  const serverEntryPath = join(root, '.temp', 'ssr-entry.js');
  const { render } = await import(serverEntryPath);
  // SSR render html
  try {
    await renderPage(render, root, clientBundle);
  } catch (e) {
    console.error('Render page error.\n', e);
  }
}
