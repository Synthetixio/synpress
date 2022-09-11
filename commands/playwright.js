const fetch = require('node-fetch');
const { chromium } = require('@playwright/test');
const sleep = require('util').promisify(setTimeout);

let browser;
let mainWindow;
let metamaskWindow;
let metamaskNotificationWindow;
let activeTabName;

let retries = 0;

module.exports = {
  browser: () => {
    return browser;
  },
  mainWindow: () => {
    return mainWindow;
  },
  metamaskWindow: () => {
    return metamaskWindow;
  },
  metamaskNotificationWindow: () => {
    return metamaskNotificationWindow;
  },
  activeTabName: () => {
    return activeTabName;
  },
  init: async () => {
    const debuggerDetails = await fetch('http://127.0.0.1:9222/json/version'); //DevSkim: ignore DS137138
    const debuggerDetailsConfig = await debuggerDetails.json();
    const webSocketDebuggerUrl = debuggerDetailsConfig.webSocketDebuggerUrl;
    if (process.env.SLOW_MODE) {
      if (!isNaN(process.env.SLOW_MODE)) {
        browser = await chromium.connectOverCDP(webSocketDebuggerUrl, {
          slowMo: Number(process.env.SLOW_MODE),
        });
      } else {
        browser = await chromium.connectOverCDP(webSocketDebuggerUrl, {
          slowMo: 50,
        });
      }
    } else {
      browser = await chromium.connectOverCDP(webSocketDebuggerUrl);
    }
    return browser.isConnected();
  },
  clear: async () => {
    browser = null;
    return true;
  },
  assignWindows: async () => {
    let pages = await browser.contexts()[0].pages();
    for (const page of pages) {
      if (page.url().includes('runner')) {
        mainWindow = page;
      } else if (page.url().includes('extension')) {
        metamaskWindow = page;
      } else if (page.url().includes('notification')) {
        metamaskNotificationWindow = page;
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
    metamaskNotificationWindow = null;
    return true;
  },
  isCypressWindowActive: async () => {
    if (activeTabName === 'cypress') {
      return true;
    } else {
      return false;
    }
  },
  isMetamaskWindowActive: async () => {
    if (activeTabName === 'metamask') {
      return true;
    } else {
      return false;
    }
  },
  isMetamaskNotificationWindowActive: async () => {
    if (activeTabName === 'metamask-notif') {
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
  switchToMetamaskNotificationWindow: async () => {
    await metamaskNotificationWindow.bringToFront();
    await module.exports.assignActiveTabName('metamask-notif');
    return true;
  },
  switchToMetamaskNotification: async () => {
    let pages = await browser.contexts()[0].pages();
    for (const page of pages) {
      if (page.url().includes('notification')) {
        await page.bringToFront();
        await page.waitForLoadState('networkidle');
        metamaskNotificationWindow = page;
        retries = 0;
        return page;
      }
    }
    await sleep(200);
    if (retries < 50) {
      retries++;
      return await module.exports.switchToMetamaskNotification();
    } else if (retries >= 50) {
      retries = 0;
      throw new Error(
        '[switchToMetamaskNotification] Max amount of retries to switch to metamask notification window has been reached. It was never found.',
      );
    }
  },
  waitFor: async (selector, page = metamaskWindow) => {
    await page.waitForSelector(selector, { strict: false });
    const element = await page.locator(selector).first();
    await element.waitFor();
    await element.focus();
    if (process.env.STABLE_MODE) {
      if (!isNaN(process.env.STABLE_MODE)) {
        await page.waitForTimeout(Number(process.env.STABLE_MODE));
      } else {
        await page.waitForTimeout(300);
      }
    }
    return element;
  },
  waitAndClick: async (selector, page = metamaskWindow, args = {}) => {
    const element = await module.exports.waitFor(selector, page);
    if (args.numberOfClicks && !args.waitForEvent) {
      await element.click({
        clickCount: args.numberOfClicks,
        force: args.force,
      });
    } else if (args.numberOfClicks && args.waitForEvent) {
      await Promise.all([
        page.waitForEvent(args.waitForEvent),
        element.click({ clickCount: args.numberOfClicks, force: args.force }),
      ]);
    } else if (args.waitForEvent) {
      if (args.waitForEvent.includes('navi')) {
        await Promise.all([
          page.waitForNavigation(),
          element.click({ force: args.force }),
        ]);
      } else {
        await Promise.all([
          page.waitForEvent(args.waitForEvent),
          element.click({ force: args.force }),
        ]);
      }
    } else {
      await element.click({ force: args.force });
    }

    await page.waitForLoadState();
    await mainWindow.waitForLoadState();
    await metamaskWindow.waitForLoadState();

    return element;
  },
  waitAndClickByText: async (selector, text, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    const element = await page.locator(`text=${text}`);
    await element.click();
  },
  waitAndType: async (selector, value, page = metamaskWindow) => {
    const element = await module.exports.waitFor(selector, page);
    await element.type(value);
  },
  waitAndGetValue: async (selector, page = metamaskWindow) => {
    const element = await module.exports.waitFor(selector, page);
    const value = await element.inputValue();
    return value;
  },
  waitAndSetValue: async (text, selector, page = metamaskWindow) => {
    const element = await module.exports.waitFor(selector, page);
    await element.fill('');
    await element.fill(text);

    await page.waitForLoadState();
    await mainWindow.waitForLoadState();
    await metamaskWindow.waitForLoadState();
  },
  waitAndClearWithBackspace: async (selector, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    const inputValue = await page.evaluate(selector, el => el.value);
    for (let i = 0; i < inputValue.length; i++) {
      await page.keyboard.press('Backspace');
    }
  },
  waitClearAndType: async (text, selector, page = metamaskWindow) => {
    const element = await module.exports.waitAndClick(selector, page, {
      numberOfClicks: 3,
    });
    await element.type(text);
  },
  waitForText: async (selector, text, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    await page.locator(selector, { hasText: text }).waitFor();
  },
};
