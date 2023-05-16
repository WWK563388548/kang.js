import { relative } from 'path';
import { Plugin } from 'vite';
import { SiteConfig } from 'shared/types/index';

const SITE_DATA_ID = 'kang:site-data';

export function pluginConfig(
  config: SiteConfig,
  restartServer: () => Promise<void>
): Plugin {
  return {
    name: 'kang:config',
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return '\0' + SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [config.configPath];
      const include = (id: string) =>
        customWatchedFiles.some((file) => id.includes(file));

      if (include(ctx.file)) {
        console.log(
          `\n${relative(config.root, ctx.file)} changed, restarting server...`
        );
        await restartServer();
      }
    }
  };
}
