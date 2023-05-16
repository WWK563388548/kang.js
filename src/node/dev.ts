import { createServer as createViteDevServer } from 'vite';
import { indexHtmlPlugin } from './plugin_kang/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { resolveConfig } from './config';
import { pluginConfig } from './plugin_kang/config';
import { PACKAGE_ROOT } from './constants';

export async function createDevServer(
  root,
  restartServer: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development');
  console.log(config);
  return createViteDevServer({
    root,
    plugins: [
      indexHtmlPlugin(),
      pluginReact(),
      pluginConfig(config, restartServer)
    ],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
