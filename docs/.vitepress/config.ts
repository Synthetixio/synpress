import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'

const pkg = await import('../node_modules/@synthetixio/synpress/package.json')

// https://vitepress.dev/reference/site-config
export default defineConfig({
  cleanUrls: true,
  title: 'Synpress',
  description: 'E2E testing library for Web3 dapps.',
  lastUpdated: true,
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    editLink: {
      pattern: 'https://github.com/Synthetixio/synpress/tree/new-dawn/docs/:path',
      text: 'Suggest changes to this page'
    },

    externalLinkIcon: true,

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Docs', link: '/docs/getting-started' },
      { text: 'API', link: '/api/index/' },
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

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Synthetixio/synpress/tree/new-dawn' },
      { icon: 'discord', link: 'https://discord.gg/XhZKSRGtWc' },
      { icon: 'x', link: 'https://twitter.com/Synpress_' }
    ],

    footer: {
      message: 'Supported by 🔴 <a href="https://www.optimism.io/" target="_blank">Optimism</a>'
    }
  }
})
