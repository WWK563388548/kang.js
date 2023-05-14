import { createServer as createViteDevServer } from 'vite';
import { indexHtmlPlugin } from './plugin_kang/indexHtml';
import pluginReact from '@vitejs/plugin-react';

export async function createDevServer(root) {
  return createViteDevServer({
    root,
    plugins: [indexHtmlPlugin(), pluginReact()]
  });
}
