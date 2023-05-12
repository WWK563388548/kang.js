import { createServer as createViteDevServer } from "vite";
import { indexHtmlPlugin } from "./plugin_kang/indexHtml";

export async function createDevServer(root = process.cwd() ) {
  return createViteDevServer({
    root,
    plugins: [indexHtmlPlugin()],
  });
}
