import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import { defineConfig } from 'astro/config';

export default defineConfig(
  {
    site: 'https://angeldollface.art',
    integrations: [
      mdx(), 
      sitemap(),
      robotsTxt()
    ]
  }
);