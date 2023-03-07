// fixtures.ts
import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';
import waitForExpect from 'wait-for-expect';
import { initialSetup } from '../../commands/metamask';
import { prepareMetamask } from '../../helpers';

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    global.expect = expect;
    const metamaskPath = await prepareMetamask(
      process.env.METAMASK_VERSION || '10.25.0',
    );
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${metamaskPath}`,
        `--load-extension=${metamaskPath}`,
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
    await use(context);
    await context.close();
  },
});
export const expect = test.expect;
