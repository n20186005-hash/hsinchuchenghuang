// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// 新竹城隍廟夜市指南
// 輸出模式：static（大部分頁面預先產生，CDN 直接送）
// 部署：Cloudflare Workers（少數頁面佇伺服器端即時產生，見 prerender = false）
export default defineConfig({
  site: 'https://hsinchuchenghuang.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  output: 'static',
  adapter: cloudflare({
    // 站內的相片攏是 public/ 內底的靜態檔案，無使用 Astro 的圖片服務
    imageService: 'passthrough',
  }),
  integrations: [sitemap()],
});
