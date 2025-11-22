import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
    react(),
    tailwindcss(),
  ],
  resolve: { alias: { '@': '/src' } },
  build: { outDir: 'dist', assetsDir: 'assets', emptyOutDir: true, sourcemap: true },
});
