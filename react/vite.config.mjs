import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

const htmlPlugin = (base) => {
    return {
        name: "html-transform",
        transformIndexHtml(html) {
            return html.replace(/<base href="\/">/, `<base href="${base}">`);
        },
    };
};

export default defineConfig(({ command, mode }) => {
    const base = mode === 'gh-pages' ? '/ynlb/' : '/';
    return {
        base,
        plugins: [
            react(),
            tsconfigPaths(),
            htmlPlugin(base),
            VitePWA({
                registerType: 'autoUpdate',
                workbox: {
                    cleanupOutdatedCaches: true,
                    navigateFallback: base + 'index.html',
                },
                manifest: {
                    short_name: 'YNLB',
                    name: 'YNLB - Yoruba Not Left Behind',
                    description: 'English to Yoruba translation app',
                    icons: [
                        {
                            src: 'ynlb192.png',
                            type: 'image/png',
                            sizes: '192x192',
                        },
                        {
                            src: 'ynlb512.png',
                            type: 'image/png',
                            sizes: '512x512',
                        },
                        {
                            src: 'ynlbmaskable512.png',
                            type: 'image/png',
                            sizes: '512x512',
                            purpose: 'maskable',
                        },
                    ],
                    start_url: base,
                    display: 'standalone',
                    theme_color: '#6200EE',
                    background_color: '#FFFFFF',
                    scope: base,
                    orientation: 'portrait',
                    screenshots: [
                        {
                            src: 'ynlb_1280x800.png',
                            sizes: '1280x800',
                            type: 'image/png',
                            form_factor: 'wide',
                            label: 'YNLB Desktop View'
                        },
                        {
                            src: 'ynlb_390x844.png',
                            sizes: '390x844',
                            type: 'image/png',
                            label: 'YNLB Mobile View'
                        }
                    ],
                    share_target: {
                        action: '/share-target/',
                        method: 'GET',
                        params: {
                            title: 'title',
                            text: 'text',
                            url: 'url'
                        }
                    }
                }
            }),
        ],
        server: {
            open: true,
        },
    };
});