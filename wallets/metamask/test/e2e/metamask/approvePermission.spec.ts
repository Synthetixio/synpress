import { testWithMetaMask } from '../testWithMetaMask'

const test = testWithMetaMask.extend<{
  switchChainAndDeployToken: () => Promise<void>
  enableImprovedTokenAllowanceExperience: () => Promise<void>
}>({
  switchChainAndDeployToken: async ({ page, metamask }, use) => {
    await use(async () => {
      await page.locator('#addEthereumChain').click()

      await metamask.approveNewNetwork()
      await metamask.approveSwitchNetwork()

      await expect(page.locator('#tokenAddresses')).toBeEmpty()
      await page.locator('#createToken').click()

      await metamask.confirmTransaction()
    })
  },
  enableImprovedTokenAllowanceExperience: async ({ metamask }, use) => {
    await use(async () => {
      await metamask.openSettings()

      const SidebarMenus = metamask.homePage.selectors.settings.SettingsSidebarMenus
      await metamask.openSidebarMenu(SidebarMenus.Experimental)

      await metamask.toggleImprovedTokenAllowanceExperience()

      await metamask.goBackToHomePage()
    })
  }
})

const { expect, describe } = test

// These tests rely on the same account, which means they must be run in serial.
test.describe.configure({ mode: 'serial' })

describe('with improved token allowance experience disabled', () => {
  test('should approve tokens with the default limit', async ({ page, metamask, switchChainAndDeployToken }) => {
    await switchChainAndDeployToken()

    await page.locator('#approveTokens').click()

    await metamask.approvePermission()
  })

  test('should approve tokens with the custom limit', async ({ page, metamask, switchChainAndDeployToken }) => {
    await switchChainAndDeployToken()

    await page.locator('#approveTokens').click()

    await metamask.approvePermission(420)
  })
})

describe('with improved token allowance experience enabled', () => {
  test('should approve tokens with the default limit', async ({
    page,
    metamask,
    switchChainAndDeployToken,
    enableImprovedTokenAllowanceExperience
  }) => {
    await enableImprovedTokenAllowanceExperience()
    await switchChainAndDeployToken()

    await page.locator('#approveTokens').click()

    await metamask.approvePermission('default')
  })

  test('should approve tokens with the default limit by default', async ({
    page,
    metamask,
    switchChainAndDeployToken,
    enableImprovedTokenAllowanceExperience
  }) => {
    await enableImprovedTokenAllowanceExperience()
    await switchChainAndDeployToken()

    await page.locator('#approveTokens').click()

    await metamask.approvePermission()
  })

  test('should approve tokens with the max limit', async ({
    page,
    metamask,
    switchChainAndDeployToken,
    enableImprovedTokenAllowanceExperience
  }) => {
    await enableImprovedTokenAllowanceExperience()
    await switchChainAndDeployToken()

    await page.locator('#approveTokens').click()

    await metamask.approvePermission('max')
  })

  test('should approve tokens with the custom limit', async ({
    page,
    metamask,
    switchChainAndDeployToken,
    enableImprovedTokenAllowanceExperience
  }) => {
    await enableImprovedTokenAllowanceExperience()
    await switchChainAndDeployToken()

    await page.locator('#approveTokens').click()

    await metamask.approvePermission(420)
  })
})
