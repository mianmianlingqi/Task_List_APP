/**
 * Vite 构建配置
 * @description 配置 React 插件和 Tauri 开发服务器集成
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  /* 路径别名：@ 指向 src/ 目录 */
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  /* 清除 console 和 debugger（生产构建） */
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },

  /* Tauri 开发服务器配置 */
  server: {
    port: 1420,
    strictPort: true,
  },

  /* 构建输出到 dist/（Tauri 读取此目录） */
  build: {
    outDir: 'dist',
    target: 'esnext',
    minify: 'esbuild',
  },
});
