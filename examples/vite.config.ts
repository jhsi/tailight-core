import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    root: 'basic',
    base: '/tailight-core/',  // Add base URL for GitHub Pages
    build: {
        outDir: '../dist/examples/basic',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'basic/index.html')
            }
        }
    },
    resolve: {
        alias: {
            '@tailight-core': resolve(__dirname, '../dist/tailight-core.es.js')
        }
    }
}); 