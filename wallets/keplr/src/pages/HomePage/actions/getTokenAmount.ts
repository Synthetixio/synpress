import type { Page } from "@playwright/test";

export const getTokenAmount = async (page: Page, tokenName: string) => {
  console.log('getTokenAmount', tokenName, page);
  // await module.exports.switchToKeplrIfNotActive();
  // await module.exports.goToHome();

  // const tokenLabel = await playwright.waitFor(
  //   homePageElements.tokenNameLabel(tokenName),
  // );
  // const parentElement = tokenLabel.locator(
  //   homePageElements.tokenParentSelector,
  // );
  // const innerTexts = await parentElement.allInnerTexts();
  // const textArray = innerTexts[0].split('\n');

  // const tokenValue = textArray[3];
  // const parsedTokenValue = Number(tokenValue.replace(/,/g, ''));
  // await playwright.switchToCypressWindow();
  // return parsedTokenValue;
}