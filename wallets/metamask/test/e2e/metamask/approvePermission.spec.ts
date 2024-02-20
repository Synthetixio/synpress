import { testWithMetaMask } from '../testWithMetaMask'

const test = testWithMetaMask

const { describe } = test

describe('with default gas setting', () => {
  test('should approve tokens with the default limit by default', async ({ page, metamask, deployToken }) => {
    await deployToken()

    await page.locator('#approveTokens').click()

    await metamask.approveTokenPermission()
  })

  test('should approve tokens with the `max` limit', async ({ page, metamask, deployToken }) => {
    await deployToken()

    await page.locator('#approveTokens').click()

    await metamask.approveTokenPermission({ spendLimit: 'max' })
  })

  test('should approve tokens with the custom limit', async ({ page, metamask, deployToken }) => {
    await deployToken()

    await page.locator('#approveTokens').click()

    await metamask.approveTokenPermission({ spendLimit: 420 })
  })
})

describe('with custom gas setting', () => {
  test('should approve tokens with the default spend limit', async ({ page, metamask, deployToken }) => {
    await deployToken()

    await page.locator('#approveTokens').click()

    await metamask.approveTokenPermission({
      gasSetting: 'site'
    })
  })

  test('should approve tokens with the `max` spend limit and custom gas setting', async ({
    page,
    metamask,
    deployToken
  }) => {
    await deployToken()

    await page.locator('#approveTokens').click()

    await metamask.approveTokenPermission({
      spendLimit: 'max',
      gasSetting: {
        maxBaseFee: 250,
        priorityFee: 150
      }
    })
  })

  test('should approve tokens with the custom spend limit and custom gas limit', async ({
    page,
    metamask,
    deployToken
  }) => {
    await deployToken()

    await page.locator('#approveTokens').click()

    await metamask.approveTokenPermission({
      spendLimit: 420,
      gasSetting: {
        maxBaseFee: 250,
        priorityFee: 150,
        gasLimit: 200_000
      }
    })
  })
})
