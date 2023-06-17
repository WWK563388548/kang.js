import { Plugin } from 'vite';
import { RouteService } from './RouteService';

// Put file directory structure -> routing data
interface PluginOptions {
  root: string;
}

export const CONVENTIONAL_ROUTE_ID = 'kang:routes';

export function PluginRoutes(options: PluginOptions): Plugin {
  const routeService = new RouteService(options.root);

  return {
    name: 'kang:routes',
    async configResolved() {
      // Initialize the RouteService when Vite starts
      await routeService.init();
    },
    resolveId(id: string) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        return '\0' + id;
      }
    },

    load(id: string) {
      if (id === '\0' + CONVENTIONAL_ROUTE_ID) {
        return routeService.generateRoutesCode();
      }
    }
  };
}
