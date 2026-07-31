import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(import.meta.dirname, './src') },
      { find: /^es-toolkit\/compat\/(.*)$/, replacement: 'lodash/$1' },
    ],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/register': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/tasks': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
});
