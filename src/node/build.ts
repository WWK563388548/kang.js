import { build as viteBuild } from "vite";
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from "./constants";

export async function bundle(root: string) {
  const clientBuild = async () => {
    return viteBuild({
      mode: "production",
      root,
      build: {
        outDir: "build",
        rollupOptions: {
          input: CLIENT_ENTRY_PATH,
          output: {
            format: "esm",
          }
        },
      }
    });
  }

  const serverBuild = async () => {
    return viteBuild({
      mode: "production",
      root,
      build: {
        ssr: true,
        outDir: ".temp",
        rollupOptions: {
          input: SERVER_ENTRY_PATH,
          output: {
            format: "cjs",
          }
        },
      }
    });
  }

  await clientBuild();
  await serverBuild();
}

export async function build(root: string) {
  await bundle(root);
}
