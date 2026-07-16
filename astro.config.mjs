/**
 * Astro Pu (Uncarved Jade) Template
 *
 * @author    Mountos (https://mountos.com)
 * @license   MIT
 * @see       https://github.com/mountos/astro-pu
 */

import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeExternalLinks from './src/plugins/rehype-external-links.mjs';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // IMPORTANT: Replace `https://example.com` with your actual domain.
  site: 'https://sofamap.com',
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeExternalLinks],
    }),
  },
});
