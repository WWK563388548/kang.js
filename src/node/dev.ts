import { createServer as createViteDevServer } from 'vite';
import { indexHtmlPlugin } from './plugin_kang/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { resolveConfig } from './config';

export async function createDevServer(root) {
  const config = await resolveConfig(root, 'serve', 'development');
  console.log(config);
  return createViteDevServer({
    root,
    plugins: [indexHtmlPlugin(), pluginReact()]
  });
}
