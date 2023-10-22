import { type BrowserContext, type Page, chromium, test as base } from '@playwright/test'
import { connectToDapp } from '../../src/actions/connectToDapp'
import { lock } from '../../src/actions/lock'
import { unlock } from '../../src/actions/unlock'
import { OnboardingPage } from '../../src/pages'
import { prepareExtension } from '../../src/prepareExtension'
import { HomePageSelectors, UnlockPageSelectors } from '../../src/selectors'
import { getExtensionId } from '../../src/utils/getExtensionId'

const DEFAULT_SEED_PHRASE = 'test test test test test test test test test test test junk'
const DEFAULT_PASSWORD = 'Tester@1234'

let sharedContext: BrowserContext | undefined

// Fixture for the test.
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

    context.on('close', () => {
      console.log('context closed')
    })

    const mmPage = context.pages()[1] as Page
    mmPage.on('close', () => {
      console.log('meta mask page closed')
    })

    sharedContext = context
    await use(context)
  },
  metamaskPage: async ({ context }, use) => {
    const metamaskOnboardingPage = context.pages()[1] as Page
    await use(metamaskOnboardingPage)
  }
})

const { describe, expect } = test

// Currently testing only happy paths until we have proper setup for parallel tests.
describe('MetaMask', () => {
  describe('importWallet', () => {
    test('should go through the onboarding flow and import wallet from seed phrase', async ({ metamaskPage }) => {
      const onboardingPage = new OnboardingPage(metamaskPage)

      await onboardingPage.importWallet(DEFAULT_SEED_PHRASE, DEFAULT_PASSWORD)

      await expect(metamaskPage.getByText('Account 1')).toBeVisible()
      await expect(metamaskPage.getByText('0xf39...2266')).toBeVisible()
    })
  })

  describe('getExtensionId', () => {
    test('should return the extension id', async ({ context }) => {
      const extensionId = await getExtensionId(context, 'MetaMask')
      expect(extensionId).toMatch(/^[a-z]{32}$/)
    })
  })

  describe('connectToDapp', () => {
    test('should connect wallet to dapp', async ({ context, page }) => {
      const extensionId = await getExtensionId(context, 'MetaMask')

      await page.goto('https://metamask.github.io/test-dapp/')

      await page.locator('#connectButton').click()

      await connectToDapp(context, extensionId)

      await expect(page.locator('#accounts')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')

      console.log('context.pages().length', context.pages().length)
      console.log(
        'context.pages()',
        context
          .pages()
          .map((page) => page.url())
          .join(', ')
      )
      console.log('1')
      await expect.poll(() => {
        console.log('check length:', context.pages().length)
        return context.pages().map((page) => page.url()).join(', ')
      }, { timeout: 10000}).not.toMatch(/notification\.html/)

      await expect(page.locator('#accounts')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
    })
  })

  describe('lock', () => {
    test('should lock the wallet', async ({ context }) => {
      console.log('context.pages().length', context.pages().length)
      console.log(
        'context.pages()',
        context
          .pages()
          .map((page) => page.url())
          .join(', ')
      )
      console.log('1')
      await expect.poll(() => {
        console.log('check length:', context.pages().length)
        return context.pages().map((page) => page.url()).join(', ')
      }, { timeout: 10000}).not.toMatch(/notification\.html/)
      // expect(context.pages().length).toHaveLength(3)
      console.log('2')
      const metamaskPage = context.pages()[1] as Page
      // await metamaskPage.pause()
      await metamaskPage.bringToFront()
      console.log(
        'context.pages()',
        context
          .pages()
          .map((page) => page.url())
          .join(', ')
      )
      // await metamaskPage.pause()

      await lock(metamaskPage)

      await expect(metamaskPage.locator(UnlockPageSelectors.submitButton)).toBeVisible()
    })
  })

  describe('unlock', () => {
    test('should unlock the wallet', async ({ context }) => {
      console.log('context.pages().length', context.pages().length)
      console.log(
        'context.pages()',
        context
          .pages()
          .map((page) => page.url())
          .join(', ')
      )
      const metamaskPage = context.pages()[1] as Page
      await unlock(metamaskPage, DEFAULT_PASSWORD)

      await expect(metamaskPage.locator(HomePageSelectors.logo)).toBeVisible()
    })
  })
})
