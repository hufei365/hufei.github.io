import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hufeispace.com',
  base: '/blog',
  outDir: './dist-blog',
  publicDir: './public-blog',
  build: {
    emptyOutDir: true,
  },
});
