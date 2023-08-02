const log = require('debug')('synpress:playwright');
const fetch = require('node-fetch');
const {
  notificationPageElements,
} = require('../pages/metamask/notification-page');
const { pageElements } = require('../pages/metamask/page');
const {
  onboardingWelcomePageElements,
} = require('../pages/metamask/first-time-flow-page');
const sleep = require('util').promisify(setTimeout);
const _ = require('underscore');

let browser;
let mainWindow;
let metamaskWindow;
let metamaskNotificationWindow;
let metamaskPopupWindow;
let activeTabName;

let retries = 0;

let extensionsData = {};

module.exports = {
  browser() {
    return browser;
  },
  mainWindow() {
    return mainWindow;
  },
  metamaskWindow() {
    return metamaskWindow;
  },
  metamaskNotificationWindow() {
    return metamaskNotificationWindow;
  },
  metamaskPopupWindow() {
    return metamaskPopupWindow;
  },
  activeTabName() {
    return activeTabName;
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
  async clear() {
    browser = null;
    return true;
  },
  async assignWindows() {
    const metamaskExtensionData = (await module.exports.getExtensionsData())
      .metamask;

    let pages = await browser.contexts()[0].pages();
    for (const page of pages) {
      if (page.url().includes('specs/runner')) {
        mainWindow = page;
      } else if (
        page
          .url()
          .includes(`chrome-extension://${metamaskExtensionData.id}/home.html`)
      ) {
        metamaskWindow = page;
      } else if (
        page
          .url()
          .includes(
            `chrome-extension://${metamaskExtensionData.id}/notification.html`,
          )
      ) {
        metamaskNotificationWindow = page;
      } else if (
        page
          .url()
          .includes(`chrome-extension://${metamaskExtensionData.id}/popup.html`)
      ) {
        metamaskPopupWindow = page;
      }
    }
    return true;
  },
  async assignActiveTabName(tabName) {
    activeTabName = tabName;
    return true;
  },
  async clearWindows() {
    mainWindow = null;
    metamaskWindow = null;
    metamaskNotificationWindow = null;
    metamaskPopupWindow = null;
    return true;
  },
  async isCypressWindowActive() {
    return activeTabName === 'cypress';
  },
  async isMetamaskWindowActive() {
    return activeTabName === 'metamask';
  },
  async isMetamaskNotificationWindowActive() {
    return activeTabName === 'metamask-notif';
  },
  async switchToCypressWindow() {
    if (mainWindow) {
      await mainWindow.bringToFront();
      await module.exports.assignActiveTabName('cypress');
    }
    return true;
  },
  async switchToMetamaskWindow() {
    await metamaskWindow.bringToFront();
    await module.exports.assignActiveTabName('metamask');
    return true;
  },
  async switchToMetamaskNotificationWindow() {
    await metamaskNotificationWindow.bringToFront();
    await module.exports.assignActiveTabName('metamask-notif');
    return true;
  },
  async switchToMetamaskPopupWindow() {
    await metamaskPopupWindow.bringToFront();
    await module.exports.assignActiveTabName('metamask-popup');
    return true;
  },
  async switchToMetamaskNotification() {
    const metamaskExtensionData = (await module.exports.getExtensionsData())
      .metamask;

    let pages = await browser.contexts()[0].pages();
    for (const page of pages) {
      if (
        page
          .url()
          .includes(
            `chrome-extension://${metamaskExtensionData.id}/notification.html`,
          )
      ) {
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
  async waitFor(selector, page = metamaskWindow) {
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
  async waitAndClick(selector, page = metamaskWindow, args = {}) {
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
    await module.exports.waitUntilStable();
    return element;
  },
  async waitAndClickByText(selector, text, page = metamaskWindow) {
    await module.exports.waitFor(selector, page);
    const element = `:is(:text-is("${text}"), :text("${text}"))`;
    await page.click(element);
    await module.exports.waitUntilStable();
  },
  async waitAndType(selector, value, page = metamaskWindow) {
    if (typeof value === 'number') {
      value = value.toString();
    }
    const element = await module.exports.waitFor(selector, page);
    await element.type(value);
    await module.exports.waitUntilStable(page);
  },
  async waitAndGetValue(selector, page = metamaskWindow) {
    const expect = global.expect
      ? global.expect
      : require('@playwright/test').expect;
    const element = await module.exports.waitFor(selector, page);
    await expect(element).toHaveText(/[a-zA-Z0-9]/, {
      ignoreCase: true,
      useInnerText: true,
    });
    const value = await element.innerText();
    return value;
  },
  async waitAndGetInputValue(selector, page = metamaskWindow) {
    const expect = global.expect
      ? global.expect
      : require('@playwright/test').expect;
    const element = await module.exports.waitFor(selector, page);
    await expect(element).toHaveValue(/[a-zA-Z1-9]/);
    const value = await element.inputValue();
    return value;
  },
  async waitAndGetAttributeValue(selector, attribute, page = metamaskWindow) {
    const expect = global.expect
      ? global.expect
      : require('@playwright/test').expect;
    const element = await module.exports.waitFor(selector, page);
    await expect(element).toHaveAttribute(attribute, /[a-zA-Z0-9]/);
    const attrValue = await element.getAttribute(attribute);
    return attrValue;
  },
  async waitAndSetValue(text, selector, page = metamaskWindow) {
    const element = await module.exports.waitFor(selector, page);
    await element.fill('');
    await module.exports.waitUntilStable(page);
    await element.fill(text);
    await module.exports.waitUntilStable(page);
  },
  async waitAndClearWithBackspace(selector, page = metamaskWindow) {
    await module.exports.waitFor(selector, page);
    const inputValue = await page.evaluate(selector, el => el.value);
    for (let i = 0; i < inputValue.length; i++) {
      await page.keyboard.press('Backspace');
      await module.exports.waitUntilStable(page);
    }
  },
  async waitClearAndType(text, selector, page = metamaskWindow) {
    const element = await module.exports.waitAndClick(selector, page, {
      numberOfClicks: 3,
    });
    await module.exports.waitUntilStable(page);
    await element.type(text);
    await module.exports.waitUntilStable(page);
  },
  async waitForText(selector, text, page = metamaskWindow) {
    await module.exports.waitFor(selector, page);
    const element = page.locator(selector, { hasText: text });
    await element.waitFor();
  },
  async waitToBeHidden(selector, page = metamaskWindow) {
    // info: waits for 60 seconds
    const locator = page.locator(selector);
    for (const element of await locator.all()) {
      if ((await element.count()) > 0 && retries < 300) {
        retries++;
        await page.waitForTimeout(200);
        await module.exports.waitToBeHidden(selector, page);
      } else if (retries >= 300) {
        retries = 0;
        throw new Error(
          `[waitToBeHidden] Max amount of retries reached while waiting for ${selector} to disappear.`,
        );
      }
      retries = 0;
    }
  },
  async waitUntilStable(page) {
    const metamaskExtensionData = (await module.exports.getExtensionsData())
      .metamask;

    if (
      page &&
      page
        .url()
        .includes(
          `chrome-extension://${metamaskExtensionData.id}/notification.html`,
        )
    ) {
      await page.waitForLoadState('load');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForLoadState('networkidle');
      await module.exports.waitUntilNotificationWindowIsStable();
    }
    await metamaskWindow.waitForLoadState('load');
    await metamaskWindow.waitForLoadState('domcontentloaded');
    await metamaskWindow.waitForLoadState('networkidle');
    await module.exports.waitUntilMetamaskWindowIsStable();
    if (mainWindow) {
      await mainWindow.waitForLoadState('load');
      await mainWindow.waitForLoadState('domcontentloaded');
      // todo: this may slow down tests and not be necessary but could improve stability
      // await mainWindow.waitForLoadState('networkidle');
    }
  },
  async waitUntilNotificationWindowIsStable(page = metamaskNotificationWindow) {
    await module.exports.waitToBeHidden(
      notificationPageElements.loadingLogo,
      page,
    );
    await module.exports.waitToBeHidden(
      notificationPageElements.loadingSpinner,
      page,
    );
  },
  async waitUntilMetamaskWindowIsStable(page = metamaskWindow) {
    await module.exports.waitToBeHidden(pageElements.loadingLogo, page); // shown on reload
    await module.exports.waitToBeHidden(pageElements.loadingSpinner, page); // shown on reload
    await module.exports.waitToBeHidden(pageElements.loadingOverlay, page); // shown on change network
    await module.exports.waitToBeHidden(
      pageElements.loadingOverlaySpinner,
      page,
    ); // shown on balance load
    // network error handler
    if (
      (await page.locator(pageElements.loadingOverlayErrorButtons).count()) > 0
    ) {
      await module.exports.waitAndClick(
        pageElements.loadingOverlayErrorButtonsRetryButton,
        page,
      );
      await module.exports.waitToBeHidden(pageElements.loadingOverlay, page);
    }
    await module.exports.fixCriticalError();
  },
  // workaround for metamask random blank page on first run
  async fixBlankPage(page = metamaskWindow) {
    await page.waitForTimeout(1000);
    for (let times = 0; times < 5; times++) {
      if (
        (await page.locator(onboardingWelcomePageElements.app).count()) === 0
      ) {
        await page.reload();
        await module.exports.waitUntilMetamaskWindowIsStable();
      } else {
        break;
      }
    }
  },
  async fixCriticalError(page = metamaskWindow) {
    for (let times = 0; times < 5; times++) {
      if ((await page.locator(pageElements.criticalError).count()) > 0) {
        log(
          '[fixCriticalError] Metamask crashed with critical error, refreshing..',
        );
        if (times <= 3) {
          await page.reload();
          await module.exports.waitUntilMetamaskWindowIsStable();
        } else if (times === 4) {
          await module.exports.waitAndClick(
            pageElements.criticalErrorRestartButton,
          );
          await module.exports.waitUntilMetamaskWindowIsStable();
        } else {
          throw new Error(
            '[fixCriticalError] Max amount of retries to fix critical metamask error has been reached.',
          );
        }
      } else if ((await page.locator(pageElements.errorPage).count()) > 0) {
        log('[fixCriticalError] Metamask crashed with error, refreshing..');
        if (times <= 4) {
          await page.reload();
          await module.exports.waitUntilMetamaskWindowIsStable();
        } else {
          throw new Error(
            '[fixCriticalError] Max amount of retries to fix critical metamask error has been reached.',
          );
        }
      } else {
        break;
      }
    }
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
};
