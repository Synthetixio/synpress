const log = require('debug')('synpress:playwright');
const fetch = require('node-fetch');
const {
  notificationPageElements,
} = require('../pages/metamask/notification-page');
const { pageElements } = require('../pages/metamask/page');
const {
  onboardingWelcomePageElements,
} = require('../pages/metamask/first-time-flow-page');
// const metamask = require('./metamask');
const { app } = require('../pages/phantom/notification-page');
const sleep = require('util').promisify(setTimeout);

let browser;
let mainWindow;
let activeTabName;
let retries = 0;

let pageWindows = {};
let notificationWindows = {};
let extensions = {}; // name, id

module.exports = {
  browser() {
    return browser;
  },
  mainWindow() {
    return mainWindow;
  },
  notificationWindow(provider) {
    return notificationWindows[provider];
  },
  windows(provider) {
    return pageWindows[provider];
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

    // get extension details
    const pagesResponse = await fetch('http://127.0.0.1:9222/json');
    const pages = await pagesResponse.json();

    extensions = pages
      .filter(
        page =>
          page.url.startsWith('chrome-extension://') &&
          !page.url.endsWith('/_generated_background_page.html'), // cypress
      )
      .map(extension => {
        const matches = extension.url.match(/chrome-extension:\/\/(.*)\/.*/);
        return {
          name:
            extension.title === 'Phantom Wallet'
              ? 'phantom'
              : extension.title.toLowerCase(),
          id: matches[1],
        };
      })
      .reduce((prev, curr) => ({ ...prev, [curr.name]: curr }), {});

    return browser.isConnected();
  },
  async clear() {
    browser = null;
    return true;
  },
  async assignWindows(provider) {
    let pages = await browser.contexts()[0].pages();
    for (const page of pages) {
      if (page.url().includes('runner')) {
        mainWindow = page;
      } else if (
        page.url().includes(extensions[provider].id) &&
        page.url().includes('notification')
      ) {
        notificationWindows[provider] = page;
      } else if (page.url().includes(extensions[provider].id)) {
        pageWindows[provider] = page;
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
    pageWindows = {};
    notificationWindows = {};
    return true;
  },
  async isCypressWindowActive() {
    return activeTabName === 'cypress';
  },
  async isWindowActive(provider) {
    return activeTabName === provider;
  },
  async isNotificationWindowActive(provider) {
    return activeTabName === `${provider}-notif`;
  },
  async switchToCypressWindow() {
    if (mainWindow) {
      await mainWindow.bringToFront();
      await module.exports.assignActiveTabName('cypress');
    }
    return true;
  },
  switchToWindow: async provider => {
    if (module.exports.windows(provider).isClosed()) {
      const newPage = await browser.contexts()[0].newPage();
      if (provider === 'phantom') {
        await Promise.all([
          newPage.waitForNavigation(),
          newPage.goto(
            module.exports
              .windows(provider)
              .url()
              .replace('onboarding.html', 'popup.html'),
          ),
        ]);
      } else {
        await Promise.all([
          newPage.waitForNavigation(),
          newPage.goto(module.exports.windows(provider).url()),
        ]);
        await newPage.waitUntilStable(provider);
      }

      pageWindows[provider] = newPage;
    }

    await module.exports.windows(provider).bringToFront();
    await module.exports.assignActiveTabName(provider);
    return true;
  },
  async switchToNotificationWindow(provider) {
    await notificationWindows[provider].bringToFront();
    await module.exports.assignActiveTabName(`${provider}-notif`);
    return true;
  },
  async switchToNotification(provider) {
    let pages = await browser.contexts()[0].pages();

    // loop reverse, chance is very high that it's the last window
    for (let i = pages.length - 1; i >= 0; i--) {
      const page = pages[i];
      if (page.url().includes('notification')) {
        notificationWindows[provider] = page;
        retries = 0;
        await page.bringToFront();
        if (provider == 'metamask') {
          await module.exports.waitUntilStable(provider, page);
        }
        if (provider === 'phantom') {
          await module.exports.waitFor(provider, app.root, page);
        } else {
          await module.exports.waitFor(
            provider,
            notificationPageElements.notificationAppContent,
            page,
          );
        }

        return page;
      }
    }
    await sleep(200);
    if (retries < 50) {
      retries++;
      return await module.exports.switchToNotification(provider);
    } else if (retries >= 50) {
      retries = 0;
      throw new Error(
        `[switchToNotification: ${provider}] Max amount of retries to switch to metamask notification window has been reached. It was never found.`,
      );
    }
  },
  async waitFor(provider, selector, page = module.exports.windows(provider)) {
    if (provider == 'metamask') {
      await module.exports.waitUntilStable(provider, page);
    }
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
  async waitAndClick(
    provider,
    selector,
    page = module.exports.windows(provider),
    args = {},
  ) {
    const element = await module.exports.waitFor(provider, selector, page);
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
    if (provider === 'metamask') {
      await module.exports.waitUntilStable(provider);
    }
    return element;
  },
  async waitAndClickByText(
    provider,
    selector,
    text,
    page = module.exports.windows(provider),
  ) {
    await module.exports.waitFor(selector, page);
    const element = `:is(:text-is("${text}"), :text("${text}"))`;
    await page.click(element);
    if (provider === 'metamask') {
      await module.exports.waitUntilStable(provider);
    }
  },
  async waitAndType(
    provider,
    selector,
    value,
    page = module.exports.windows(provider),
  ) {
    if (typeof value === 'number') {
      value = value.toString();
    }
    const element = await module.exports.waitFor(provider, selector, page);
    await element.type(value);
    if (provider === 'metamask') {
      await module.exports.waitUntilStable(provider, page);
    }
  },
  async waitAndGetValue(
    provider,
    selector,
    page = module.exports.windows(provider),
  ) {
    const expect = global.expect
      ? global.expect
      : require('@playwright/test').expect;
    const element = await module.exports.waitFor(provider, selector, page);
    await expect(element).toHaveText(/[a-zA-Z0-9]/, {
      ignoreCase: true,
      useInnerText: true,
    });
    const value = await element.innerText();
    return value;
  },
  async waitAndGetInputValue(
    provider,
    selector,
    page = module.exports.windows(provider),
  ) {
    const expect = global.expect
      ? global.expect
      : require('@playwright/test').expect;
    const element = await module.exports.waitFor(provider, selector, page);
    await expect(element).toHaveValue(/[a-zA-Z1-9]/);
    const value = await element.inputValue();
    return value;
  },
  async waitAndGetAttributeValue(
    provider,
    selector,
    attribute,
    page = module.exports.windows(provider),
  ) {
    const expect = global.expect
      ? global.expect
      : require('@playwright/test').expect;
    const element = await module.exports.waitFor(provider, selector, page);
    await expect(element).toHaveAttribute(attribute, /[a-zA-Z0-9]/);
    const attrValue = await element.getAttribute(attribute);
    return attrValue;
  },
  async waitAndSetValue(
    provider,
    text,
    selector,
    page = module.exports.windows(provider),
  ) {
    const element = await module.exports.waitFor(provider, selector, page);
    await element.fill('');
    await module.exports.waitUntilStable(provider, page);
    await element.fill(text);
    await module.exports.waitUntilStable(provider, page);
  },
  async waitAndClearWithBackspace(
    provider,
    selector,
    page = module.exports.windows(provider),
  ) {
    await module.exports.waitFor(provider, selector, page);
    const inputValue = await page.evaluate(selector, el => el.value);
    for (let i = 0; i < inputValue.length; i++) {
      await page.keyboard.press('Backspace');
      await module.exports.waitUntilStable(provider, page);
    }
  },
  async waitClearAndType(
    provider,
    text,
    selector,
    page = module.exports.windows(provider),
  ) {
    const element = await module.exports.waitAndClick(
      provider,
      selector,
      page,
      {
        numberOfClicks: 3,
      },
    );
    await module.exports.waitUntilStable(provider, page);
    await element.type(text);
    await module.exports.waitUntilStable(provider, page);
  },
  async waitForText(
    provider,
    selector,
    text,
    page = module.exports.windows(provider),
  ) {
    await module.exports.waitFor(provider, selector, page);
    const element = page.locator(selector, { hasText: text });
    await element.waitFor();
  },
  async waitToBeHidden(
    provider,
    selector,
    page = module.exports.windows(provider),
  ) {
    // info: waits for 60 seconds
    const locator = page.locator(selector);
    for (const element of await locator.all()) {
      if ((await element.count()) > 0 && retries < 300) {
        retries++;
        await page.waitForTimeout(200);
        await module.exports.waitToBeHidden(provider, selector, page);
      } else if (retries >= 300) {
        retries = 0;
        throw new Error(
          `[waitToBeHidden] Max amount of retries reached while waiting for ${selector} to disappear.`,
        );
      }
      retries = 0;
    }
  },
  async waitUntilStable(provider, page) {
    if (page && page.url().includes('notification')) {
      await page.waitForLoadState('load');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForLoadState('networkidle');
      await module.exports.waitUntilNotificationWindowIsStable(provider);
    }
    await module.exports.windows(provider).waitForLoadState('load');
    await module.exports.windows(provider).waitForLoadState('domcontentloaded');
    await module.exports.windows(provider).waitForLoadState('networkidle');
    if (provider != 'phantom') {
      await module.exports.waitUntilWindowIsStable(provider);
    }
    if (mainWindow) {
      await mainWindow.waitForLoadState('load');
      await mainWindow.waitForLoadState('domcontentloaded');
      // todo: this may slow down tests and not be necessary but could improve stability
      // await mainWindow.waitForLoadState('networkidle');
    }
  },
  async waitUntilNotificationWindowIsStable(
    provider,
    page = module.exports.windows(provider),
  ) {
    await module.exports.waitToBeHidden(
      provider,
      notificationPageElements.loadingLogo,
      page,
    );
    await module.exports.waitToBeHidden(
      provider,
      notificationPageElements.loadingSpinner,
      page,
    );
  },
  async waitUntilWindowIsStable(
    provider,
    page = module.exports.windows(provider),
  ) {
    await module.exports.waitToBeHidden(
      provider,
      pageElements.loadingLogo,
      page,
    ); // shown on reload
    await module.exports.waitToBeHidden(
      provider,
      pageElements.loadingSpinner,
      page,
    ); // shown on reload
    await module.exports.waitToBeHidden(
      provider,
      pageElements.loadingOverlay,
      page,
    ); // shown on change network
    await module.exports.waitToBeHidden(
      provider,
      pageElements.loadingOverlaySpinner,
      page,
    ); // shown on balance load
    // network error handler
    if (
      (await page.locator(pageElements.loadingOverlayErrorButtons).count()) > 0
    ) {
      await module.exports.waitAndClick(
        provider,
        pageElements.loadingOverlayErrorButtonsRetryButton,
        page,
      );
      await module.exports.waitToBeHidden(
        provider,
        pageElements.loadingOverlay,
        page,
      );
    }
    await module.exports.fixCriticalError(provider, page);
  },
  // workaround for metamask random blank page on first run
  async fixBlankPage(
    provider,
    page = module.exports.windows(provider),
    appRoot = onboardingWelcomePageElements.app,
  ) {
    await page.waitForTimeout(1000);
    for (let times = 0; times < 5; times++) {
      if ((await page.locator(appRoot).count()) === 0) {
        await page.reload();
        await module.exports.waitUntilWindowIsStable(provider, page);
      } else {
        break;
      }
    }
  },
  async fixCriticalError(provider, page = module.exports.windows(provider)) {
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
            provider,
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
};
