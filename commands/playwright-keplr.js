const log = require('debug')('synpress:playwright');
const fetch = require('node-fetch');
const _ = require('underscore');
const sleep = require('util').promisify(setTimeout);

let browser;
let mainWindow;
let keplrWindow;
let keplrNotificationWindow;
let activeTabName;
let extensionsData = {};
let retries = 0;

module.exports = {
  async resetState() {
    log('Resetting state of playwright');
    browser = undefined;
    mainWindow = undefined;
    keplrWindow = undefined;
    activeTabName = undefined;
    keplrNotificationWindow = undefined;
    retries = 0;
    extensionsData = {};
  },
  browser() {
    return browser;
  },
  mainWindow() {
    return mainWindow;
  },
  keplrWindow() {
    return keplrWindow;
  },
  keplrNotificationWindow() {
    return keplrNotificationWindow;
  },
  assignActiveTabName(tabName) {
    activeTabName = tabName;
    return true;
  },
  isKeplrWindowActive() {
    return activeTabName === 'keplr';
  },
  isCypressWindowActive() {
    return activeTabName === 'cypress';
  },
  activeTabName() {
    return activeTabName;
  },
  async switchToKeplrWindow() {
    await keplrWindow.bringToFront();
    module.exports.assignActiveTabName('keplr');
    return true;
  },
  async switchToCypressWindow(page = keplrWindow) {
    await module.exports.waitUntilStable(page);
    if (mainWindow) {
      await mainWindow.bringToFront();
      module.exports.assignActiveTabName('cypress');
    }
    return true;
  },
  async clear() {
    browser = null;
    return true;
  },
  async clearWindows() {
    mainWindow = null;
    keplrWindow = null;
    keplrNotificationWindow = null;
    return true;
  },
  async init(playwrightInstance) {
    const chromium = playwrightInstance
      ? playwrightInstance
      : require('@playwright/test').chromium;
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
  async getExtensionsData() {
    if (!_.isEmpty(extensionsData)) {
      return extensionsData;
    }

    const context = await browser.contexts()[0];
    const page = await context.newPage();

    await page.goto('chrome://extensions');
    await page.waitForLoadState('load');
    await page.waitForLoadState('domcontentloaded');

    const devModeButton = page.locator('#devMode');
    await devModeButton.waitFor();
    await devModeButton.focus();
    await devModeButton.click();

    const extensionDataItems = await page.locator('extensions-item').all();
    for (const extensionData of extensionDataItems) {
      const extensionName = (
        await extensionData
          .locator('#name-and-version')
          .locator('#name')
          .textContent()
      ).toLowerCase();

      const extensionVersion = (
        await extensionData
          .locator('#name-and-version')
          .locator('#version')
          .textContent()
      ).replace(/(\n| )/g, '');

      const extensionId = (
        await extensionData.locator('#extension-id').textContent()
      ).replace('ID: ', '');

      extensionsData[extensionName] = {
        version: extensionVersion,
        id: extensionId,
      };
    }
    await page.close();

    return extensionsData;
  },
  async assignWindows() {
    const keplrExtensionData = (await module.exports.getExtensionsData()).keplr;

    let pages = await browser.contexts()[0].pages();

    for (const page of pages) {
      if (page.url().includes('specs/runner')) {
        mainWindow = page;
      } else if (
        page
          .url()
          .includes(`chrome-extension://${keplrExtensionData.id.trim()}/register.html`)
      ) {
        keplrWindow = page;
      }
    }
    return true;
  },
  async waitUntilStable(page) {
    const keplrExtensionData = (await module.exports.getExtensionsData()).keplr;
    if (
      page &&
      page
        .url()
        .includes(`chrome-extension://${keplrExtensionData.id}/register.html`)
    ) {
      await page.waitForLoadState('load');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForLoadState('networkidle');
    }
    await keplrWindow.waitForLoadState('load');
    await keplrWindow.waitForLoadState('domcontentloaded');
    await keplrWindow.waitForLoadState('networkidle');

    if (mainWindow) {
      await mainWindow.waitForLoadState('load');
      await mainWindow.waitForLoadState('domcontentloaded');
      // todo: this may slow down tests and not be necessary but could improve stability
      // await mainWindow.waitForLoadState('networkidle');
    }
  },
  async waitFor(selector, page = keplrWindow, number = 0) {
    await module.exports.waitUntilStable(page);
    await page.waitForSelector(selector, { strict: false });
    const element = page.locator(selector).nth(number);
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
  async waitForElementsByText(text, page = keplrWindow, exact = false) {
    await module.exports.waitUntilStable(page);
    const elements = await page.getByText(text, { exact: exact }).all();
    await Promise.all(elements.map(element => element.waitFor()));
    if (process.env.STABLE_MODE) {
      if (!isNaN(process.env.STABLE_MODE)) {
        await page.waitForTimeout(Number(process.env.STABLE_MODE));
      } else {
        await page.waitForTimeout(300);
      }
    }
    return elements;
  },
  async waitForByText(text, page = keplrWindow, exact = false) {
    await module.exports.waitUntilStable(page);
    const element = page.getByText(text, { exact: exact }).first();
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
  async waitAndClickByText(text, page = keplrWindow, exact = false) {
    await module.exports.waitForByText(text, page, exact);
    const element = `:is(:text-is("${text}")${exact ? '' : `, :text("${text}")`})`;
    await page.click(element);
    await module.exports.waitUntilStable();
  },
  async waitAndSetValue(text, selector, page = keplrWindow) {
    const element = await module.exports.waitFor(selector, page);
    await element.fill('');
    await module.exports.waitUntilStable(page);
    await element.fill(text);
    await module.exports.waitUntilStable(page);
  },
  async waitAndGetValue(selector, page = keplrWindow) {
    const expect = require('@playwright/test').expect;
    const element = await module.exports.waitFor(selector, page);
    await expect(element).toHaveText(/[a-zA-Z0-9]/, {
      ignoreCase: true,
      useInnerText: true,
    });
    const value = await element.innerText();
    return value;
  },
  async waitAndClick(selector, page = keplrWindow, args = {}) {
    const element = await module.exports.waitFor(
      selector,
      page,
      args.number || 0,
    );
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
    await module.exports.waitUntilStable();
    return element;
  },
  async waitForAndCheckElementExistence(
    selector,
    timeout = 1000,
    page = keplrWindow,
  ) {
    try {
      await module.exports.waitUntilStable(page);
      await page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      return false;
    }
  },
  async waitForByRole(role, number = 0, page = keplrWindow) {
    await module.exports.waitUntilStable(page);
    const element = page.getByRole(role).nth(number);
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
  async waitAndType(selector, value, page = keplrWindow) {
    if (typeof value === 'number') {
      value = value.toString();
    }
    let element;
    if (typeof selector === 'string') {
      element = await module.exports.waitFor(selector, page);
    } else {
      // for locator element
      element = selector;
      await element.waitFor();
    }

    await element.type(value);
    await module.exports.waitUntilStable(page);
  },
  async waitAndTypeByLocator(selector, value, number = 0, page = keplrWindow) {
    if (typeof value === 'number') {
      value = value.toString();
    }
    const element = await module.exports.waitForByRole(selector, number, page);
    await element.type(value);
    await module.exports.waitUntilStable(page);
  },
  async waitAndClickWithRetry(selector, options) {
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        await module.exports.waitAndClick(
          selector,
          module.exports.keplrWindow(),
          options,
        );
        return;
      } catch (error) {
        retries++;
      }
    }

    throw new Error(`Failed to click element after ${maxRetries} attempts`);
  },
  async waitAndClickWithDelay(selector, delay, options) {
    const page = module.exports.keplrWindow();
    await page.waitForTimeout(delay);
    await module.exports.waitAndClick(selector, page, options);
  },
  async switchToKeplrNotification() {
    const keplrExtensionData = (await module.exports.getExtensionsData()).keplr;

    let pages = await browser.contexts()[0].pages();
    for (const page of pages) {
      if (
        page
          .url()
          .includes(`chrome-extension://${keplrExtensionData.id}/popup.html`) &&
        page !== keplrWindow
      ) {
        keplrNotificationWindow = page;
        retries = 0;
        await page.bringToFront();
        await module.exports.waitUntilStable(page);
        return page;
      }
    }
    await sleep(200);
    if (retries < 50) {
      retries++;
      return await module.exports.switchToKeplrNotification();
    } else if (retries >= 50) {
      retries = 0;
      throw new Error(
        '[switchToKeplrNotification] Max amount of retries to switch to keplr notification window has been reached. It was never found.',
      );
    }
  },
  async waitForURLLoad(url, page = keplrWindow) {
    await page.waitForURL(url);
    await module.exports.waitUntilStable(page);
  },
};
