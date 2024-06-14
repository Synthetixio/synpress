import type { Page } from '@playwright/test';

export const getWalletAddress = async (page: Page) => {
  console.log('getWalletAddress', page);
  // return await playwright.waitAndGetValue(homePageElements.walletAddress);
  // playwright.switchToKeplrWindow();
  //   await module.exports.goToHome();
  //   const newTokensSelctorExists =
  //     await playwright.waitForAndCheckElementExistence(
  //       homePageElements.newTokensFoundSelector,
  //     );

  //   if (newTokensSelctorExists) {
  //     await module.exports.addNewTokensFound(false);
  //   }

  //   await playwright.waitAndClickByText(notificationPageElements.copyAddress);
  //   await playwright.waitAndClick(
  //     notificationPageElements.walletSelectors(chainName),
  //   );

  //   walletAddress = clipboardy.readSync();
  //   await playwright.switchToCypressWindow();
  //   return walletAddress;
}