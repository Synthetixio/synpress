import { type BrowserContext, type Page, chromium, test as base } from '@playwright/test'
import { MetaMask } from '../../../src'
import { prepareExtension } from '../../../src/prepareExtension'

const SEED_PHRASE = 'test test test test test test test test test test test junk'
const PASSWORD = 'Tester@1234'

let sharedContext: BrowserContext | undefined

const test = base.extend<{
  metamaskPage: Page
}>({
  context: async ({ context: _ }, use) => {
    if (sharedContext) {
      await use(sharedContext)

      return
    }

    const metamaskPath = await prepareExtension()

    // biome-ignore format: the array should not be formatted
    const browserArgs = [
      `--disable-extensions-except=${metamaskPath}`,
      `--load-extension=${metamaskPath}`
    ]

    if (process.env.HEADLESS) {
      browserArgs.push('--headless=new')
    }

    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: browserArgs
    })

    try {
      await context.waitForEvent('page', { timeout: 5000 })
    } catch {
      throw new Error('[FIXTURE] MetaMask extension did not load in time')
    }

    sharedContext = context
    await use(context)
  },
  metamaskPage: async ({ context }, use) => {
    const metamaskOnboardingPage = context.pages()[1] as Page
    await use(metamaskOnboardingPage)
  }
})

const { describe, expect } = test

describe('MetaMask.importWallet', () => {
  test('should go through the onboarding flow and import wallet from seed phrase', async ({
    context,
    metamaskPage
  }) => {
    const metamask = new MetaMask(context, metamaskPage, PASSWORD)

    await metamask.importWallet(SEED_PHRASE)

    await expect(metamaskPage.getByText('Account 1')).toBeVisible()
    await expect(metamaskPage.getByText('0xf39...2266')).toBeVisible()
  })
})
