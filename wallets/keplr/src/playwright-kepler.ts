import fetch from 'node-fetch';
import _ from 'underscore'
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { sleep } from './utils/helpers';

let browser: any;
let mainWindow: any;
let keplrWindow: any;
let keplrNotificationWindow: any;
let activeTabName: string | undefined;
let extensionsData = {};
let retries = 0;

export const playwright = {
  async resetState() {
    console.log('Resetting state of playwright');
    browser = undefined;
    mainWindow = undefined;
    keplrWindow = undefined;
    activeTabName = undefined;
    keplrNotificationWindow = undefined;
    retries = 0;
    extensionsData = {};
  },

  async init(playwrightInstance: any) {
    const chromium = playwrightInstance
      ? playwrightInstance
      : null
    if (!chromium) return;
    const debuggerDetails = await fetch('http://127.0.0.1:9222/json/version'); //DevSkim: ignore DS137138

    const debuggerDetailsConfig = await debuggerDetails.json();
        // @ts-ignore
    const webSocketDebuggerUrl = debuggerDetailsConfig.webSocketDebuggerUrl;
    if (process.env.SLOW_MODE) {
      if (!isNaN(Number(process.env.SLOW_MODE))) {
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
  async assignActiveTabName(tabName: string) {
    activeTabName = tabName;
    return true;
  },

  async isKeplrWindowActive() {
    return activeTabName === 'keplr';
  },

  keplrNotificationWindow() {
    return keplrNotificationWindow;
  },

  async waitAndClickByText(text: string, page = keplrWindow) {
    await this.waitForByText(text, page);
    const element = `:is(:text-is("${text}"), :text("${text}"))`;
    await page.click(element);
    await this.waitUntilStable(page);
  },

  async waitAndSetValue(text: string, selector: string, page = keplrWindow) {
    const element = await this.waitFor(selector, page);
    await element.fill('');
    await this.waitUntilStable(page);
    await element.fill(text);
    await this.waitUntilStable(page);
  },

  async waitAndGetValue(selector: string, page = keplrWindow) {
    const element = await this.waitFor(selector, page);
    await expect(element).toHaveText(/[a-zA-Z0-9]/, {
      ignoreCase: true,
      useInnerText: true,
    });
    const value = await element.innerText();
    return value;
  },

  async waitAndClick(selector: string, page = keplrWindow, args: any = {}) {
    const element = await this.waitFor(
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
    await this.waitUntilStable(page);
    return element;
  },

  async switchToCypressWindow() {
    if (mainWindow) {
      await mainWindow.bringToFront();
      await this.assignActiveTabName('cypress');
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
    await this.assignActiveTabName('keplr');
    return true;
  },

  async waitUntilStable(page: Page) {

    // @ts-ignore
    const keplrExtensionData = (await this.getExtensionsData())

    if (
      page &&
      page
        .url()
        .includes(
          // @ts-ignore
          `chrome-extension://${keplrExtensionData.id}/register.html`,
        )
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

  async waitFor(selector: string, page = keplrWindow, number = 0) {
    await this.waitUntilStable(page);
    await page.waitForSelector(selector, { strict: false });
    const element = page.locator(selector).nth(number);
    await element.waitFor();
    await element.focus();
    if (process.env.STABLE_MODE) {
      if (!isNaN(Number(process.env.STABLE_MODE))) {
        await page.waitForTimeout(Number(process.env.STABLE_MODE));
      } else {
        await page.waitForTimeout(300);
      }
    }
    return element;
  },
  async waitForByText(text: string, page = keplrWindow) {
    await this.waitUntilStable(page);
    // await page.waitForSelector(selector, { strict: false });
    const element = page.getByText(text).first();
    await element.waitFor();
    await element.focus();
    if (process.env.STABLE_MODE) {
      if (!isNaN(Number(process.env.STABLE_MODE))) {
        await page.waitForTimeout(Number(process.env.STABLE_MODE));
      } else {
        await page.waitForTimeout(300);
      }
    }
    return element;
  },

  async waitForByRole(role: any, number = 0, page = keplrWindow) {
    await this.waitUntilStable(page);
    const element = page.getByRole(role).nth(number);
    await element.waitFor();
    await element.focus();
    if (process.env.STABLE_MODE) {
      if (!isNaN(Number(process.env.STABLE_MODE))) {
        await page.waitForTimeout(Number(process.env.STABLE_MODE));
      } else {
        await page.waitForTimeout(300);
      }
    }
    return element;
  },

  async waitAndType(selector: string, value: any, page = keplrWindow) {
    if (typeof value === 'number') {
      value = value.toString();
    }
    const element = await this.waitFor(selector, page);
    await element.type(value);
    await this.waitUntilStable(page);
  },

  async waitAndTypeByLocator(selector: string, value: any, number = 0, page = keplrWindow) {
    if (typeof value === 'number') {
      value = value.toString();
    }
    const element = await this.waitForByRole(selector, number, page);
    await element.type(value);
    await this.waitUntilStable(page);
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

    const extensionDataItems: any = await page.locator('extensions-item').all();
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
      // @ts-ignore
      extensionsData[extensionName] = {
        version: extensionVersion,
        id: extensionId,
      };
    }
    await page.close();

    return extensionsData;
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