import type { Page } from "@playwright/test";
import { getNotificationPageAndWaitForLoad } from "../../../utils/getNotificationAndWaitForLoads";
import { notificationPageElements } from "../selectors";

export const rejectSignatureRequest = async (page: Page, extensionId: string) => {
  const notificationPage = await getNotificationPageAndWaitForLoad(page.context(), extensionId);
  await notificationPage.click(notificationPageElements.signaturePageElements.buttons.rejectSign);

  return true;
}