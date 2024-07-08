import type { Page } from "@playwright/test";
import { getNotificationPageAndWaitForLoad } from "../../../utils/getNotificationAndWaitForLoads";
import { notificationPageElements } from "../selectors";

export const selectWallet = async (page: Page, extensionId: string, wallet: string) => {
  const notificationPage = await getNotificationPageAndWaitForLoad(page.context(), extensionId);
  if (wallet === 'metamask') {
    await notificationPage.click(notificationPageElements.selectWalletElements.buttons.continueWithMetamask)
  }
  if (wallet === 'phantom') {
    await notificationPage.click(notificationPageElements.selectWalletElements.buttons.continueWithPhantom)
  }

  return true;
}