const fetch = require('node-fetch');
const { chromium } = require('@playwright/test');

let puppeteerBrowser;
let mainWindow;
let metamaskWindow;
let activeTabName;

module.exports = {
  puppeteerBrowser: () => {
    return puppeteerBrowser;
  },
  mainWindow: () => {
    return mainWindow;
  },
  metamaskWindow: () => {
    return metamaskWindow;
  },
  activeTabName: () => {
    return activeTabName;
  },
  init: async () => {
    const debuggerDetails = await fetch('http://127.0.0.1:9222/json/version'); //DevSkim: ignore DS137138
    const debuggerDetailsConfig = await debuggerDetails.json();
    const webSocketDebuggerUrl = debuggerDetailsConfig.webSocketDebuggerUrl;
    puppeteerBrowser = await chromium.connectOverCDP(webSocketDebuggerUrl);
    return puppeteerBrowser.isConnected();
  },
  clear: async () => {
    puppeteerBrowser = null;
    return true;
  },
  assignWindows: async () => {
    let pages = await puppeteerBrowser.contexts()[0].pages();
    for (const page of pages) {
      if (page.url().includes('integration')) {
        mainWindow = page;
      } else if (page.url().includes('tests')) {
        mainWindow = page;
      } else if (page.url().includes('runner')) {
        mainWindow = page;
      } else if (page.url().includes('extension')) {
        metamaskWindow = page;
      }
    }
    return true;
  },
  assignActiveTabName: async tabName => {
    activeTabName = tabName;
    return true;
  },
  clearWindows: async () => {
    mainWindow = null;
    metamaskWindow = null;
    return true;
  },
  isMetamaskWindowActive: async () => {
    if (activeTabName === 'metamask') {
      return true;
    } else {
      return false;
    }
  },
  isCypressWindowActive: async () => {
    if (activeTabName === 'cypress') {
      return true;
    } else {
      return false;
    }
  },
  switchToCypressWindow: async () => {
    await mainWindow.bringToFront();
    await module.exports.assignActiveTabName('cypress');
    return true;
  },
  switchToMetamaskWindow: async () => {
    await metamaskWindow.bringToFront();
    await module.exports.assignActiveTabName('metamask');
    return true;
  },
  switchToMetamaskNotification: async () => {
    // todo: wait for page to be initialized before triggering waitFor
    // todo: wait for spinning loader to be gone before triggering waitFor
    // todo: get rid of waitForTimeout after fixing above
    // todo: all of the above are issues related to metamask notification of tx confirmation
    await module.exports.metamaskWindow().waitForTimeout(3000);
    let pages = await puppeteerBrowser.contexts()[0].pages();
    for (const page of pages) {
      if (page.url().includes('notification')) {
        await page.bringToFront();
        return page;
      }
    }
  },
  waitFor: async (selector, page = metamaskWindow) => {
    await page.waitForSelector(selector, { strict: false });
    const element = page.locator(selector).first();
    await element.waitFor();
    await element.focus();
    await page.waitForTimeout(300);
    return element;
  },
  waitAndClick: async (
    selector,
    page = metamaskWindow,
    numberOfClicks,
    force = false,
  ) => {
    const element = await module.exports.waitFor(selector, page);
    if (numberOfClicks) {
      await element.click({ clickCount: numberOfClicks, force });
    } else {
      await element.click({ force });
    }
    return element;
  },
  waitAndClickByText: async (selector, text, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    const elements = await page.$$(selector);
    if (elements) {
      for (let el of elements) {
        const elText = await page.evaluate(el => el.textContent, el);
        if (elText.toLowerCase().includes(text.toLowerCase())) {
          await el.click();
          break;
        }
      }
    }
  },
  waitAndType: async (selector, value, page = metamaskWindow) => {
    const element = await module.exports.waitFor(selector, page);
    await element.type(value);
  },
  waitAndGetValue: async (selector, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    const element = await page.$(selector);
    const property = await element.getProperty('value');
    const value = await property.jsonValue();
    return value;
  },
  waitAndSetValue: async (text, selector, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    await page.evaluate(
      selector => (document.querySelector(selector).value = ''),
      selector,
    );
    await page.keyboard.type(text);
  },
  waitAndClearWithBackspace: async (selector, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    const inputValue = await page.evaluate(selector, el => el.value);
    for (let i = 0; i < inputValue.length; i++) {
      await page.keyboard.press('Backspace');
    }
  },
  waitClearAndType: async (text, selector, page = metamaskWindow) => {
    const element = await module.exports.waitAndClick(selector, page, 3);
    await element.type(text);
  },
  waitForText: async (selector, text, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    await page.locator(selector, { hasText: text }).waitFor();
  },
};
