const puppeteer = require('puppeteer-core');
const fetch = require('node-fetch');

let puppeteerBrowser;
let mainWindow;
let metamaskWindow;

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
  init: async () => {
    const debuggerDetails = await fetch('http://localhost:9222/json/version'); //DevSkim: ignore DS137138
    const debuggerDetailsConfig = await debuggerDetails.json();
    const webSocketDebuggerUrl = debuggerDetailsConfig.webSocketDebuggerUrl;

    puppeteerBrowser = await puppeteer.connect({
      browserWSEndpoint: webSocketDebuggerUrl,
      ignoreHTTPSErrors: true,
      defaultViewport: null,
    });
    return puppeteerBrowser.isConnected();
  },
  assignWindows: async () => {
    let pages = await puppeteerBrowser.pages();
    for (const page of pages) {
      if (page.url().includes('integration')) {
        mainWindow = page;
      } else if (page.url().includes('extension')) {
        metamaskWindow = page;
      }
    }
    return true;
  },
  getBrowser: async () => {
    return {
      puppeteerBrowser,
    };
  },
  getWindows: async () => {
    return {
      mainWindow,
      metamaskWindow,
    };
  },
  switchToCypressWindow: async () => {
    await mainWindow.bringToFront();
    return true;
  },
  switchToMetamaskWindow: async () => {
    await metamaskWindow.bringToFront();
    return true;
  },
  switchToMetamaskNotification: async () => {
    let pages = await puppeteerBrowser.pages();
    for (const page of pages) {
      if (page.url().includes('notification')) {
        await page.bringToFront();
        return page;
      }
    }
  },
  waitFor: async (selector, page = metamaskWindow) => {
    await page.waitForFunction(
      `document.querySelector('${selector}') && document.querySelector('${selector}').clientHeight != 0`,
      { visible: true },
    );
    // puppeteer going too fast breaks metamask in corner cases
    await page.waitForTimeout(300);
  },
  waitAndClick: async (selector, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    await page.evaluate(
      selector => document.querySelector(selector).click(),
      selector,
    );
  },
  waitAndClickByText: async (selector, text, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    await page.evaluate(() => {
      [...document.querySelectorAll(selector)]
        .find(element => element.textContent === text)
        .click();
    });
  },
  waitAndType: async (selector, value, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    const element = await page.$(selector);
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
    await page.focus(selector);
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
    await module.exports.waitFor(selector, page);
    const input = await page.$(selector);
    await input.click({ clickCount: 3 });
    await input.type(text);
  },
  waitForText: async (selector, text, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    await page.waitForFunction(
      `document.querySelector('${selector}').innerText.toLowerCase().includes('${text}')`,
    );
  },
};
