import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  env: {
    schema: {
      API_HOST: envField.string({ access: 'public', context: 'client' }),
    },
  },
  vite: {
    // Load the env variables of the monorepo root.
    envDir: '../../',
  },
});
