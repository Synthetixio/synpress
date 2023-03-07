// fixtures.ts
import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';
import waitForExpect from 'wait-for-expect';
import { init } from '../../commands/playwright';
import { initialSetup } from '../../commands/metamask';

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    const pathToExtension = path.join(__dirname, 'metamask-chrome-10.25.0');
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        `--remote-debugging-port=9222`,
      ],
    });

    // wait for metamask
    await waitForExpect(async () => {
      expect(context.backgroundPages().length).toEqual(1);
    });
    await context.backgroundPages()[0].waitForTimeout(2000);
    // await context.backgroundPages()[0].close();
    await initialSetup(chromium, {
      secretWordsOrPrivateKey:
        'trick turkey ocean picture talk light dinner peasant funny know window claim',
      network: 'mainnet',
      password: 'Tester@1234',
      enableAdvancedSettings: true,
    });

    // context.pages().forEach(page => {
    //   console.log(page.url());
    // });
    // console.log(context.browser().contexts()[0].pages());
    // await assignWindows(context);

    // await getExtensionDetails();
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    /*
    // for manifest v2:
    let [background] = context.backgroundPages()
    if (!background)
      background = await context.waitForEvent('backgroundpage')
    */

    // for manifest v3:
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent('serviceworker');

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});
export const expect = test.expect;
