/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages 部署於 https://<user>.github.io/VOICES-Message/ 子路徑
  base: '/VOICES-Message/',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // 沿用文管庫實證:vitest 5 預設 forks pool 在 Windows 會隨機丟測試檔(改 threads 穩定)
    pool: 'threads',
  },
});
