import { notificationPageElements } from "../selectors";

export const confirmTransaction = async () => {
  console.log('Confirming transaction in Keplr wallet', notificationPageElements)
    // const notificationPage = await playwright.switchToKeplrNotification();
    // await playwright.waitAndClick(
    //   notificationPageElements.approveButton,
    //   notificationPage,
    //   { waitForEvent: 'close' },
    // );
    return true;
  }