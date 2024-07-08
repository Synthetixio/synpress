import { getNotificationPageAndWaitForLoad } from '../../../src/playwright/utils/getNotificationPageAndWaitForLoad'
import { createDataTestSelector } from '../../../src/selectors/createDataTestSelector'
import synpress from '../synpress'

const test = synpress

const { describe, expect } = test

const PPOM_ERROR = 'This is a deceptive request'
const PPOM_WARNING = 'Request may not be safe'

describe('using PPOM security mechanism', () => {
  test('should prevent malicious ETH transfer', async ({ context, page, metamask }) => {
    await page.locator('#maliciousRawEthButton').click()

    const notificationPage = await getNotificationPageAndWaitForLoad(context, metamask.extensionId || '')

    await expect(notificationPage.locator(createDataTestSelector('security-provider-banner-alert'))).toContainText(
      PPOM_ERROR
    )
  })

  test.skip('should prevent malicious ERC20 transfer', async ({ context, page, metamask }) => {
    await page.locator('#maliciousERC20TransferButton').click()

    const notificationPage = await getNotificationPageAndWaitForLoad(context, metamask.extensionId || '')

    await expect(notificationPage.locator(createDataTestSelector('security-provider-banner-alert'))).toContainText(
      PPOM_WARNING
    )
  })

  test('should prevent malicious ERC20 approval', async ({ context, page, metamask }) => {
    await page.locator('#maliciousApprovalButton').click()

    const notificationPage = await getNotificationPageAndWaitForLoad(context, metamask.extensionId || '')

    await expect(notificationPage.locator(createDataTestSelector('security-provider-banner-alert'))).toContainText(
      PPOM_ERROR
    )
  })

  test('should prevent malicious approval for all', async ({ context, page, metamask }) => {
    await page.locator('#maliciousSetApprovalForAll').click()

    const notificationPage = await getNotificationPageAndWaitForLoad(context, metamask.extensionId || '')

    await expect(notificationPage.locator(createDataTestSelector('security-provider-banner-alert'))).toContainText(
      PPOM_ERROR
    )
  })

  test('should prevent malicious permit', async ({ context, page, metamask }) => {
    await page.locator('#maliciousPermit').click()

    const notificationPage = await getNotificationPageAndWaitForLoad(context, metamask.extensionId || '')

    await expect(notificationPage.locator(createDataTestSelector('security-provider-banner-alert'))).toContainText(
      PPOM_ERROR
    )
  })

  test('should prevent malicious trade order', async ({ context, page, metamask }) => {
    await page.locator('#maliciousTradeOrder').click()

    const notificationPage = await getNotificationPageAndWaitForLoad(context, metamask.extensionId || '')

    await expect(notificationPage.locator(createDataTestSelector('security-provider-banner-alert'))).toContainText(
      PPOM_ERROR
    )
  })

  test('should prevent malicious seaport', async ({ context, page, metamask }) => {
    await page.locator('#maliciousSeaport').click()

    const notificationPage = await getNotificationPageAndWaitForLoad(context, metamask.extensionId || '')

    await expect(notificationPage.locator(createDataTestSelector('security-provider-banner-alert'))).toContainText(
      PPOM_ERROR
    )
  })
})
