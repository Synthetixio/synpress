const log = require('debug')('synpress:playwright');
const fetch = require('node-fetch');
const _ = require('underscore');
const sleep = require('util').promisify(setTimeout);

let browser;
let mainWindow;
let keplrWindow;
let keplrNotificationWindow;
let keplrRegistrationWindow;
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
    keplrRegistrationWindow = undefined;
    retries = 0;
    extensionsData = {};
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

  async assignWindows() {
    const keplrExtensionData = (await module.exports.getExtensionsData()).keplr;

    let pages = await browser.contexts()[0].pages();

    for (const page of pages) {
      if (page.url().includes('specs/runner')) {
        mainWindow = page;
      } else if (
        page
          .url()
          .includes(`chrome-extension://${keplrExtensionData.id}/register.html`)
      ) {
        keplrWindow = page;
      }
    }
    return true;
  },
  async assignActiveTabName(tabName) {
    activeTabName = tabName;
    return true;
  },

  async isKeplrWindowActive() {
    return activeTabName === 'keplr';
  },

  keplrNotificationWindow() {
    return keplrNotificationWindow;
  },

  async waitAndClickByText(text, page = keplrWindow, exact = false) {
    await module.exports.waitForByText(text, page);
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
    const expect = expectInstance
      ? expectInstance
      : require('@playwright/test').expect;
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

  async switchToCypressWindow() {
    if (mainWindow) {
      await mainWindow.bringToFront();
      await module.exports.assignActiveTabName('cypress');
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
    return true;
  },

  async isCypressWindowActive() {
    return activeTabName === 'cypress';
  },

  async switchToKeplrWindow() {
    await keplrWindow.bringToFront();
    await module.exports.assignActiveTabName('keplr');
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

  keplrWindow() {
    return keplrWindow;
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
  async doesElementExist(selector, timeout = 1000, page = keplrWindow) {
    try {
      await page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      return false;
    }
  },
  async waitForByText(text, page = keplrWindow) {
    await module.exports.waitUntilStable(page);
    // await page.waitForSelector(selector, { strict: false });
    const element = page.getByText(text).first();
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
    const element = await module.exports.waitFor(selector, page);
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

  async switchToKeplrRegistrationWindow() {
    const keplrExtensionData = (await module.exports.getExtensionsData()).keplr;
    const browserContext = await browser.contexts()[0];
    keplrRegistrationWindow = await browserContext.newPage();
    await keplrRegistrationWindow.goto(
      `chrome-extension://${keplrExtensionData.id}/register.html`,
    );
    return true;
  },
  async switchToKeplrNotification() {
    const keplrExtensionData = (await module.exports.getExtensionsData()).keplr;

    let pages = await browser.contexts()[0].pages();
    for (const page of pages) {
      if (
        page
          .url()
          .includes(`chrome-extension://${keplrExtensionData.id}/popup.html`)
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
};
