import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig, searchForWorkspaceRoot} from 'vite';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd())]
    },
  },
  plugins: [sveltekit(), tailwindcss()]
});
