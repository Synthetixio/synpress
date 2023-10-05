import { type Page, chromium, test as base } from '@playwright/test'
import { prepareExtension } from '../../src/prepareExtension'

const test = base.extend({
  context: async ({ context: _ }, use) => {
    const metamaskPath = await prepareExtension()

    const browserArgs = [`--disable-extensions-except=${metamaskPath}`, `--load-extension=${metamaskPath}`]

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

    await use(context)
  },
  page: async ({ context }, use) => {
    const metamaskOnboardingPage = context.pages()[1] as Page
    await use(metamaskOnboardingPage)
  }
})

const { describe, expect } = test

describe('prepareExtension', () => {
  test('onboarding page opens up', async ({ page }) => {
    await expect(page).toHaveTitle('MetaMask')
    await expect(page.getByRole('heading', { name: "Let's get started" })).toBeVisible()
  })
})
