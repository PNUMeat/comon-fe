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
  build: {
    // rollupOptions의 output을 사용하면 번들이 완성 됐을 때, 주석을 제거하지만, terserOptions를 사용하면 압축단계에서 주석을 제거함
    // 개발 일지 관련 주석 제거가 목적이므로 해당 옵션을 사용해야 빌드 시간이 단축 될 것으로 판단됨 (실험은 안해봄)
    terserOptions: {
      format: {
        comments: false,
      },
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
