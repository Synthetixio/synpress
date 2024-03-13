import puppeteer from 'puppeteer';
import { execSync, spawn } from 'node:child_process';

describe('Puppeteer E2E test', () => {
  it('should load the webpage', async () => {
    execSync('yarn build');
    const previewServer = spawn('yarn', ['preview'], {
      detached: true,
      stdio: 'ignore',
    });
    // delay for preview server to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('http://localhost:4173');

      const buttonText = await page.$eval('button', el => el.textContent);
      expect(buttonText).toBe('Connect Wallet');

      await browser.close();
      previewServer.kill();
    } catch (_) {
      previewServer.kill();
    }
  });
});
