import { HomePageSelectors, connectToDapp, lock, unlock } from 'metamask'
import { testWithSynpress } from '../src'
import basicSetup from './wallet-setup/basic.setup'

const test = testWithSynpress(basicSetup, 1_000)

const { describe, expect } = test

describe.configure({
  mode: 'parallel'
})

describe('testWithSynpress', () => {
  test('should connect wallet to MetaMask E2E Test Dapp', async ({ context, page, extensionId }) => {
    await page.goto('/')

    await page.locator('#connectButton').click()

    await connectToDapp(context, extensionId)

    await expect(page.locator('#accounts')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
  })

  test('should lock & unlock MetaMask', async ({ metamaskPage }) => {
    await metamaskPage.bringToFront()

    await lock(metamaskPage)

    await unlock(metamaskPage, basicSetup.walletPassword)

    await expect(metamaskPage.locator(HomePageSelectors.logo)).toBeVisible()
  })
})
