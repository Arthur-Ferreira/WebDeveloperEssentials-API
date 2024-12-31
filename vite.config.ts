import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'app.ts'),
      formats: ['cjs'],
    },
    outDir: 'build',
    target: 'node20',
    ssr: true,
    rollupOptions: {
      external: ['express', 'mongodb', 'dotenv', 'cors', 'helmet', 'express-session'],
    },
  }
});