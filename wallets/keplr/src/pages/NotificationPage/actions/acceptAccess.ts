import { playwright } from '../../../playwright-kepler';
import { notificationPageElements } from '../selectors';

export const acceptAccess = async () => {
  const notificationPage = await playwright.switchToKeplrNotification();
  await playwright.waitAndClick(
    notificationPageElements.approveButton,
    notificationPage,
    { waitForEvent: 'close' },
  );
  return true;
}
