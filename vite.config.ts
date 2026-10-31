/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages serves the site from /<repo>/.
  base: '/fork-in-the-road/',
  plugins: [react()],
  test: {
    include: ['src/**/*.test.ts'],
  },
});
