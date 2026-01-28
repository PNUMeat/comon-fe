import react from '@vitejs/plugin-react';
import * as fs from 'fs';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
const fontFolderPath = path.resolve(__dirname, 'src/assets/fonts');
const fontFiles = fs.readdirSync(fontFolderPath);
const preloadTags = fontFiles
    .map((file) => {
    if (file.includes('Nanum')) {
        return null;
    }
    return {
        tag: 'link',
        attrs: {
            rel: 'preload',
            href: `/src/assets/fonts/${file}`,
            as: 'font',
            type: 'font/woff2',
            crossorigin: 'anonymous',
        },
    };
})
    .filter((tag) => tag !== null);
export default defineConfig({
    plugins: [
        react(),
        createHtmlPlugin({
            inject: {
                tags: preloadTags,
            },
        }),
        VitePWA({
            strategies: 'injectManifest',
            srcDir: 'src/workers',
            filename: 'cacheWorker.ts',
            registerType: 'autoUpdate',
            manifest: {
                name: 'Code Monster',
                short_name: 'Comon',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'public/web-app-manifest-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'public/web-app-manifest-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
            },
            workbox: {
                globPatterns: ['**/*.{woff,woff2}'],
            },
        }),
        visualizer({
            open: true,
            filename: 'bundles.html',
            gzipSize: true,
            brotliSize: true,
            template: 'treemap',
        }),
    ],
    worker: {
        format: 'es',
    },
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
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                    'vendor-external-state': ['@tanstack/react-query', 'axios'],
                    'vendor-editor': [
                        'lexical',
                        '@lexical/code',
                        '@lexical/html',
                        '@lexical/link',
                        '@lexical/rich-text',
                        '@lexical/selection',
                        '@lexical/utils',
                        'prismjs',
                    ],
                    calendar: ['react-calendar'],
                    slick: ['react-slick', 'slick-carousel'],
                },
            },
        },
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
