import { test, expect } from '../../fixtures';
import * as metamask from '../../../../src/commands/metamask';

let sharedPage;

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ page }) => {
  sharedPage = page;
  await sharedPage.goto('http://localhost:3000');
});

test.afterAll(async ({ context }) => {
  await context.close();
});

test('connect wallet using default metamask account', async () => {
  await sharedPage.click('#connectButton');
  await metamask.acceptAccess();
  await expect(sharedPage.locator('#accounts')).toHaveText(
    '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  );
});

test('import private key and connect wallet using imported metamask account', async () => {
  await metamask.disconnectWalletFromAllDapps();
  await metamask.importAccount(
    '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97',
  );
  await sharedPage.click('#connectButton');
  await metamask.acceptAccess();
  await expect(sharedPage.locator('#accounts')).toHaveText(
    '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f',
  );
});
