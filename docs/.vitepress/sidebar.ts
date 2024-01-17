import type { DefaultTheme } from 'vitepress'
import TypedocSidebar from '../api/typedoc-sidebar.json'

export const sidebar: DefaultTheme.Sidebar = {
  '/docs/': [
    {
      text: 'Introduction',
      items: [
        { text: 'Why Synpress?', link: '/docs/introduction' },
        { text: 'Getting Started', link: '/docs/getting-started' },
        { text: 'Migration Guide', link: '/docs/migration-guide' },
        { text: 'TypeScript', link: '/docs/typescript' },
        { text: 'Platform Compatibility', link: '/docs/platform-compatibility' },
        { text: 'Known Issues', link: '/docs/known-issues' }
      ]
    },
    {
      text: 'Guides',
      items: [
        { text: 'Wallet Cache', link: '/docs/guides/wallet-cache' },
        { text: 'Debugging Wallet Setups', link: '/docs/guides/wallet-setup-debug' },
        { text: 'Playwright', link: '/docs/guides/playwright' },
        { text: 'Built-in Fixtures', link: '/docs/guides/fixtures' },
        { text: 'CI', link: '/docs/guides/ci' }
      ]
    }
  ],
  '/api/': TypedocSidebar
}
