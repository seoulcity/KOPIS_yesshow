// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

const rootDir = process.cwd();

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: '0.0.0.0',  // 모든 네트워크 인터페이스에서 접근 허용
    port: 8080,       // GCP에서 일반적으로 사용하는 포트
    fs: {
      allow: [
        rootDir,
        path.join(rootDir, 'src'),
        path.join(rootDir, '.svelte-kit'),
        path.join(rootDir, 'node_modules'),
      ]
    },
    cors: true,  // 모든 출처에서의 CORS 요청 허용
  },
});