import type { Page } from "@playwright/test";
import { getNotificationPageAndWaitForLoad } from "../../../utils/getNotificationAndWaitForLoads";
import { homePageElements } from "../selectors";

export const closePopupAndTooltips = async (page: Page, extensionId: string) => {
  const notificationPage = await getNotificationPageAndWaitForLoad(page.context(), extensionId);
  // note: this is required for fast execution of e2e tests to avoid flakiness
  // otherwise popup may not be detected properly and not closed
  const popupIsVisible = await notificationPage.locator(homePageElements.popup.container).isVisible()
  const closeIsVisible = await notificationPage.locator(homePageElements.tippyTooltip.closeButton).isVisible()
  const actionableMessageIsVisible = await notificationPage.locator(homePageElements.actionableMessage.closeButton).isVisible()
  if (popupIsVisible) {
    const popupBackground = await notificationPage.locator(homePageElements.popup.background)
    const popupBackgroundBox = await popupBackground.boundingBox();
    await notificationPage.mouse.click(popupBackgroundBox?.x! + 1, popupBackgroundBox?.y! + 1)
  }
  if (closeIsVisible) {
    await page.click(homePageElements.tippyTooltip.closeButton);
  }
  if (actionableMessageIsVisible) {
    await page.click(homePageElements.actionableMessage.closeButton)
  }
  return true;
}