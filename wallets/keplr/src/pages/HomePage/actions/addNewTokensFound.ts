import type { Page } from "@playwright/test";

export const addNewTokensFound = async (page: Page, switchScreens = true) => {
  console.log('addNewTokensFound', switchScreens, page);
  // if (switchScreens) {
  //   module.exports.switchToKeplrIfNotActive();
  //   await module.exports.goToHome();
  // }
  
  // await page.waitAndClickByText(homePageElements.newTokensFound);
  // await playwright.waitAndClickWithDelay(
  //   homePageElements.selectAllTokensCheck,
  //   2000,
  //   { number: -1, force: true },
  // );
  // await playwright.waitAndClickByText(
  //   homePageElements.addChainsButton,
  //   playwright.keplrWindow(),
  //   true,
  // );

  // if (switchScreens) {
  //   await playwright.switchToCypressWindow();
  // }

  // return true;
}
