import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: 'src/setupTests.ts',
    },
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'tailight-core',
            fileName: (format) => `tailight-core.${format}.js`,
        },
        rollupOptions: {
            // externalize deps (if needed)
            external: [],
            output: {
                globals: {},
            },
        },
    },
});
