// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import wikiLinks from "./plugins/remark-wiki-link.ts";
import embedLinks from "./plugins/remark-embed-link.ts";
import type { RemarkPlugin } from '@astrojs/markdown-remark';
// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [sitemap()],
	markdown: {
		remarkPlugins: [
			[embedLinks as RemarkPlugin, {basePath: '/images', exts: ['png', 'jpg', 'jpeg', 'gif']}],
			[wikiLinks as RemarkPlugin, {basePath: '/blog'}],
		],
	}
});
