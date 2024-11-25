import react from '@vitejs/plugin-react';
import * as fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

const fontFolderPath = path.resolve(__dirname, 'src/assets/fonts');
const fontFiles = fs.readdirSync(fontFolderPath);

const preloadTags = fontFiles.map((file) => ({
  tag: 'link',
  attrs: {
    rel: 'preload',
    href: `/src/assets/fonts/${file}`,
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous',
  },
}));

export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        tags: preloadTags,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
