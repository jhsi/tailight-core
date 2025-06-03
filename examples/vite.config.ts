import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    root: 'basic',
    build: {
        outDir: '../dist/examples/basic'
    },
    resolve: {
        alias: {
            '@trailwind-core': resolve(__dirname, '../dist/trailwind-core.es.js')
        }
    }
}); 