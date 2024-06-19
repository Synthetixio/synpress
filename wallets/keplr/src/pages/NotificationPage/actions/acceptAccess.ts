import { notificationPageElements } from '../selectors'

export const acceptAccess = async () => {
  console.log('Accepting access in Keplr wallet', notificationPageElements)
  // const notificationPage = await playwright.switchToKeplrNotification();
  // await playwright.waitAndClick(
  //   notificationPageElements.approveButton,
  //   notificationPage,
  //   { waitForEvent: 'close' },
  // );
  // return true;
}
