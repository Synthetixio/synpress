import { type Page, chromium, test as base } from '@playwright/test'
import { MetaMask } from '../../../src/playwright'
import { prepareExtension } from '../../../src/prepareExtension'

const SEED_PHRASE = 'test test test test test test test test test test test junk'
const PASSWORD = 'Tester@1234'

const test = base.extend<{
  metamaskPage: Page
}>({
  context: async ({ context: _ }, use) => {
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

    await use(context)

    await context.close()
  },
  metamaskPage: async ({ context }, use) => {
    const metamaskOnboardingPage = context.pages()[1] as Page
    await use(metamaskOnboardingPage)
  }
})

const { expect } = test

test('should go through the onboarding flow and import wallet from seed phrase', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, PASSWORD)

  await metamask.importWallet(SEED_PHRASE)

  await expect(metamaskPage.getByText('Account 1')).toBeVisible()
  await expect(metamaskPage.getByText('0xf39Fd...92266')).toBeVisible()
})

test('should throw an error due to incorrect seed phrase', async ({ context, metamaskPage }) => {
  const metamask = new MetaMask(context, metamaskPage, PASSWORD)

  // Last word is incorrect.
  const incorrectSeedPhrase = 'test test test test test test test test test test test jun'

  await expect(metamask.importWallet(incorrectSeedPhrase)).rejects.toThrowError(
    '[ConfirmSecretRecoveryPhrase] Invalid seed phrase. Error from MetaMask: Invalid Secret Recovery Phrase'
  )
})

test('should throw an error due to incorrect password', async ({ context, metamaskPage }) => {
  // Minimum length is 8 characters.
  const incorrectPassword = 'test'

  const metamask = new MetaMask(context, metamaskPage, incorrectPassword)

  await expect(metamask.importWallet(SEED_PHRASE)).rejects.toThrowError(
    '[CreatePassword] Invalid password. Error from MetaMask: Password not long enough'
  )
})
