const fetch = require('node-fetch');
const {
  notificationPageElements,
} = require('../pages/metamask/notification-page');
const { pageElements } = require('../pages/metamask/page');
const {
  onboardingWelcomePageElements,
} = require('../pages/metamask/first-time-flow-page');
// const metamask = require('./metamask');
const sleep = require('util').promisify(setTimeout);

let browser;
let mainWindow;
let metamaskWindow;
let metamaskNotificationWindow;
let activeTabName;

let retries = 0;

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
  activeTabName() {
    return activeTabName;
  },
  async init(playwrightInstance) {
    const chromium = playwrightInstance
      ? playwrightInstance
      : require('@playwright/test').chromium;
    const debuggerDetails = await fetch(`http://127.0.0.1:${process.env.DEBUG_PORT}/json/version`); //DevSkim: ignore DS137138
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
  async assignActiveTabName(tabName) {
    activeTabName = tabName;
    return true;
  },
  async clearWindows() {
    mainWindow = null;
    metamaskWindow = null;
    metamaskNotificationWindow = null;
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
  async switchToMetamaskNotification() {
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
    const element = page.locator(`text=${text}`);
    await element.click();
    await module.exports.waitUntilStable();
  },
  async waitAndType(selector, value, page = metamaskWindow) {
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
      if ((await element.isVisible()) && retries < 300) {
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
    if (page && page.url().includes('notification')) {
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
      await page.locator(pageElements.loadingOverlayErrorButtons).isVisible()
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
        if (times < 3) {
          await page.reload();
        } else {
          await module.exports.waitAndClick(
            pageElements.criticalErrorRestartButton,
          );
        }
        await module.exports.waitUntilMetamaskWindowIsStable();
      } else {
        break;
      }
    }
  },
};
