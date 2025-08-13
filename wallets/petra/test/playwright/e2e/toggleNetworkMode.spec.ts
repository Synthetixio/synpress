import { testWithSynpress } from '@synthetixio/synpress-core'
import { Petra, petraFixtures } from '../../../src/playwright'

import Selectors from '../../../src/selectors/pages/HomePage'
import basicSetup from '../wallet-setup/basic.setup'

const test = testWithSynpress(petraFixtures(basicSetup))

const { expect } = test

test('should toggle the "Testnet Mode" option from Settings menu', async ({ context, petraPage }) => {
  const petra = new Petra(context, petraPage, basicSetup.walletPassword)

  await petra.toggleNetworkMode('testnet')

  await petraPage.locator(Selectors.headerBackButton).click()
  await petraPage.locator(Selectors.headerBackButton).click()

  await expect(petraPage.getByText(/testnet/i)).toBeVisible()
  await expect(petraPage.getByText(/Switch to mainnet/i)).toBeVisible()
})

test('should toggle the "Mainnet Mode" option from the header', async ({ context, petraPage }) => {
  const petra = new Petra(context, petraPage, basicSetup.walletPassword)

  await petra.toggleNetworkMode('testnet')
  await expect(petraPage.getByRole('button', { name: 'Switch to mainnet' })).toBeVisible()

  await petraPage.locator(Selectors.switchToMainnetHeaderButton).click()
  await expect(petraPage.getByText(/Switch to mainnet/i)).not.toBeVisible()
})

test('should toggle the "Mainnet Mode" option from Settings menu', async ({ context, petraPage }) => {
  const petra = new Petra(context, petraPage, basicSetup.walletPassword)

  await petra.toggleNetworkMode('testnet')

  await petraPage.locator(Selectors.headerBackButton).click()
  await petraPage.locator(Selectors.headerBackButton).click()

  await expect(petraPage.getByText(/testnet/i)).toBeVisible()
  await expect(petraPage.getByText(/Switch to mainnet/i)).toBeVisible()

  await petra.toggleNetworkMode('mainnet')
  await petraPage.locator(Selectors.headerBackButton).click()
  await petraPage.locator(Selectors.headerBackButton).click()

  await expect(petraPage.getByText(/testnet/i)).not.toBeVisible()
  await expect(petraPage.getByText(/Switch to mainnet/i)).not.toBeVisible()
})

test('should toggle the "Devnet Mode" option from Settings menu', async ({ context, petraPage }) => {
  const petra = new Petra(context, petraPage, basicSetup.walletPassword)

  await petra.toggleNetworkMode('devnet')

  await petraPage.locator(Selectors.headerBackButton).click()
  await petraPage.locator(Selectors.headerBackButton).click()

  await expect(petraPage.getByText(/devnet/i)).toBeVisible()
  await expect(petraPage.getByText(/Switch to mainnet/i)).toBeVisible()
})
