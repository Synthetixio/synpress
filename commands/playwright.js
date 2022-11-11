const fetch = require('node-fetch');
const { chromium, expect } = require('@playwright/test');
const {
  notificationPageElements,
} = require('../pages/metamask/notification-page');
const { pageElements } = require('../pages/metamask/page');
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
        metamaskNotificationWindow = page;
        retries = 0;
        await page.bringToFront();
        await module.exports.waitUntilStable(page);
        await module.exports.waitFor(
          notificationPageElements.notificationAppContent,
          page,
        );
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
    await module.exports.waitUntilStable(page);
    await page.waitForSelector(selector, { strict: false });
    const element = page.locator(selector).first();
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
    await module.exports.waitUntilStable(page);
    return element;
  },
  waitAndClickByText: async (selector, text, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    const element = page.locator(`text=${text}`);
    await element.click();
    await module.exports.waitUntilStable(page);
  },
  waitAndType: async (selector, value, page = metamaskWindow) => {
    const element = await module.exports.waitFor(selector, page);
    await element.type(value);
    await module.exports.waitUntilStable(page);
  },
  waitAndGetValue: async (selector, page = metamaskWindow) => {
    const element = await module.exports.waitFor(selector, page);
    await expect(element).toHaveText(/[a-zA-Z0-9]/, {
      ignoreCase: true,
      useInnerText: true,
    });
    const value = await element.innerText();
    return value;
  },
  waitAndGetInputValue: async (selector, page = metamaskWindow) => {
    const element = await module.exports.waitFor(selector, page);
    await expect(element).toHaveValue(/[a-zA-Z1-9]/);
    const value = await element.inputValue();
    return value;
  },
  waitAndGetAttributeValue: async (
    selector,
    attribute,
    page = metamaskWindow,
  ) => {
    const element = await module.exports.waitFor(selector, page);
    await expect(element).toHaveAttribute(attribute, /[a-zA-Z0-9]/);
    const attrValue = await element.getAttribute(attribute);
    return attrValue;
  },
  waitAndSetValue: async (text, selector, page = metamaskWindow) => {
    const element = await module.exports.waitFor(selector, page);
    await element.fill('');
    await module.exports.waitUntilStable(page);
    await element.fill(text);
    await module.exports.waitUntilStable(page);
  },
  waitAndClearWithBackspace: async (selector, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    const inputValue = await page.evaluate(selector, el => el.value);
    for (let i = 0; i < inputValue.length; i++) {
      await page.keyboard.press('Backspace');
      await module.exports.waitUntilStable(page);
    }
  },
  waitClearAndType: async (text, selector, page = metamaskWindow) => {
    const element = await module.exports.waitAndClick(selector, page, {
      numberOfClicks: 3,
    });
    await module.exports.waitUntilStable(page);
    await element.type(text);
    await module.exports.waitUntilStable(page);
  },
  waitForText: async (selector, text, page = metamaskWindow) => {
    await module.exports.waitFor(selector, page);
    const element = page.locator(selector, { hasText: text });
    await element.waitFor();
  },
  waitToBeHidden: async (selector, page = metamaskWindow) => {
    if (await page.locator(selector).isVisible()) {
      // todo: sadly this doesn't work well in case element disappears before it's triggered
      // because it checks if element is visible first! which causes race conditions to happen
      // waitForFunction could be used instead with document.query, however it can't be used
      // without creating new context with bypassCSP enabled which sounds like a lot of work
      await page.waitForSelector(selector, {
        hidden: true,
      });
    }
  },
  waitUntilStable: async page => {
    if (page && page.url().includes('notification')) {
      await page.waitForLoadState('load');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForLoadState('networkidle');
    }
    await metamaskWindow.waitForLoadState('load');
    await metamaskWindow.waitForLoadState('domcontentloaded');
    await metamaskWindow.waitForLoadState('networkidle');
    await mainWindow.waitForLoadState('load');
    await mainWindow.waitForLoadState('domcontentloaded');
    // todo: this may slow down tests and not be necessary but could improve stability
    // await mainWindow.waitForLoadState('networkidle');
  },
  // todo: not meant to be used until waitToBeHidden is fixed
  waitUntilNotificationWindowIsStable: async (
    page = metamaskNotificationWindow,
  ) => {
    await page.waitForLoadState('load');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
    await module.exports.waitToBeHidden(
      notificationPageElements.loadingLogo,
      page,
    );
    await module.exports.waitToBeHidden(
      notificationPageElements.loadingSpinner,
      page,
    );
  },
  // todo: not meant to be used until waitToBeHidden is fixed
  waitUntilMainWindowIsStable: async (page = mainWindow) => {
    await page.waitForLoadState('load');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
  },
  // todo: not meant to be used until waitToBeHidden is fixed
  waitUntilMetamaskWindowIsStable: async (page = metamaskWindow) => {
    await page.waitForLoadState('load');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
    await module.exports.waitToBeHidden(pageElements.loadingLogo, page); // shown on reload
    await module.exports.waitToBeHidden(pageElements.loadingSpinner, page); // shown on reload
    await module.exports.waitToBeHidden(pageElements.loadingOverlay, page); // shown on change network
    await module.exports.waitToBeHidden(
      pageElements.loadingOverlaySpinner,
      page,
    ); // shown on balance load
    // network error handler
    if (
      await page.locator(pageElements.loadingOverlayErrorButtons).isVisible()
    ) {
      await module.exports.waitAndClick(
        pageElements.loadingOverlayErrorButtonsRetryButton,
        page,
      );
      await module.exports.waitToBeHidden(pageElements.loadingOverlay, page);
    }
  },
};
