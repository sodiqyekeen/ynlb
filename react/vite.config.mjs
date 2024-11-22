import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

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
        ],
        server: {
            open: true,
        },
    };
});