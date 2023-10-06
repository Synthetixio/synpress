import { type BrowserContext, type Page, chromium, test as base } from '@playwright/test'
import { OnboardingPage } from '../../src/pages'
import { prepareExtension } from '../../src/prepareExtension'
import { getExtensionId } from '../../src/utils/getExtensionId'

const DEFAULT_SEED_PHRASE = 'test test test test test test test test test test test junk'
const DEFAULT_PASSWORD = 'Tester@1234'

let sharedContext: BrowserContext | undefined

// Fixture for the test.
const test = base.extend({
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
  page: async ({ context }, use) => {
    const metamaskOnboardingPage = context.pages()[1] as Page
    await use(metamaskOnboardingPage)
  }
})

const { describe, expect } = test

// Currently testing only happy paths until we have proper setup for parallel tests.
describe('MetaMask', () => {
  describe('importWallet', () => {
    test('should go through the onboarding flow and import wallet from seed phrase', async ({ page }) => {
      const onboardingPage = new OnboardingPage(page)

      await onboardingPage.importWallet(DEFAULT_SEED_PHRASE, DEFAULT_PASSWORD)

      await expect(page.getByText('Account 1')).toBeVisible()
      await expect(page.getByText('0xf39...2266')).toBeVisible()
    })
  })

  describe('getExtensionId', () => {
    test('should return the extension id', async ({ context }) => {
      const extensionId = await getExtensionId(context, 'MetaMask')
      expect(extensionId).toMatch(/^[a-z]{32}$/)
    })
  })
})
