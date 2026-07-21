// @ts-check
import { defineConfig } from 'astro/config';

// 新竹城隍廟夜市指南 — 純靜態 Astro 站台
// 部署：Cloudflare Pages
export default defineConfig({
  site: 'https://hsinchuchenghuang.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
