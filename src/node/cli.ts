import { cac } from 'cac';
import { resolve } from 'path';
import { createDevServer } from './dev';
import { build } from './build';

const cli = cac('kang').version('1.0.0').help();

cli
  .command('[root]', 'start dev server')
  .alias('dev')
  .action(async (root: string) => {
    const server = await createDevServer(root);
    await server.listen();
    server.printUrls();
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
