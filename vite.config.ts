import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/app.ts',
      formats: ['cjs'],
    },
    outDir: 'dist',
    target: 'node',
    ssr: true,
  }
});