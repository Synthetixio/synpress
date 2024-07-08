import { notificationPageElements } from "../selectors";
import { getNotificationPageAndWaitForLoad } from "../../../utils/getNotificationAndWaitForLoads";
import type { Page } from "@playwright/test";

export const acceptAccess = async (page: Page, extensionId: string) => {
  const notificationPage = await getNotificationPageAndWaitForLoad(page.context(), extensionId)
  await notificationPage.click(notificationPageElements.buttons.primaryButton);
  return true;
}