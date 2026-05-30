import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hufei365.github.io',
  outDir: './dist-blog',
  publicDir: './public-blog',
  build: {
    emptyOutDir: true,
  },
});
