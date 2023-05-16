import { cac } from 'cac';
import { resolve } from 'path';
import { createDevServer } from './dev';
import { build } from './build';

const cli = cac('kang').version('1.0.0').help();

cli.command('dev [root]', 'start dev server').action(async (root: string) => {
  const createServer = async () => {
    const { createDevServer } = await import('./dev.js');
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
  };
  await createServer();
});

cli
  .command('build [root]', 'build for production')
  .alias('build')
  .action(async (root: string) => {
    try {
      root = resolve(root);
      await build(root);
    } catch (error) {
      console.error(error);
    }
  });

cli.parse();
