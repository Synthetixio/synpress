import { defineConfig } from 'vitepress'
import TypedocSidebar from '../api/typedoc-sidebar.json'

const pkg = await import('../node_modules/@synthetixio/synpress/package.json')

// https://vitepress.dev/reference/site-config
export default defineConfig({
  cleanUrls: true,
  title: 'Synpress',
  description: 'E2E testing library for Web3 dapps.',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Docs', link: '/docs' },
      { text: 'API', link: '/api/' },
      { text: 'Examples', link: 'https://github.com/Synthetixio/synpress/tree/new-dawn/examples' },
      {
        text: pkg.version,
        items: [
          // TODO: Add changelog
          {
            text: 'Check out our Discord!',
            link: 'https://discord.gg/XhZKSRGtWc'
          }
        ]
      }
    ],

    sidebar: {
      '/docs/': { base: '/docs/', items: [] },
      '/api/': TypedocSidebar
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Synthetixio/synpress/tree/new-dawn' },
      { icon: 'discord', link: 'https://discord.gg/XhZKSRGtWc' },
      { icon: 'x', link: 'https://twitter.com/Synpress_' }
    ]
  }
  // TODO: Add real a favicon
  // TODO: Check if we should add other things into head
  // head: [['link', { rel: 'icon', href: '/public/synpress-logo.png' }]]
})
