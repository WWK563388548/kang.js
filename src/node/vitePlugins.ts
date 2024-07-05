import { indexHtmlPlugin } from './plugin_kang/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { pluginConfig } from './plugin_kang/config';
import { pluginRoutes } from './plugin-routes';
import { SiteConfig } from 'shared/types';
import { createPluginMdx } from './plugin_mdx';

export async function createVitePlugins(
  config: SiteConfig,
  restartServer?: () => Promise<void>
) {
  return [
    indexHtmlPlugin(),
    pluginReact({
      jsxRuntime: 'automatic'
    }),
    pluginConfig(config, restartServer),
    pluginRoutes({
      root: config.root
    }),
    await createPluginMdx()
  ];
}
