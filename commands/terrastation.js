const log = require('debug')('synpress:metamask');
const playwright = require('./playwrightTerraStation');

const {portfolioValue, sendButton} = require('../pages/terrastation/main-page');


const terrastation = {
    extensionId: () => {
        return extensionId;
      },
    extensionUrl: () => {
        return extensionHomeUrl
      },
    walletAddress: () => {
        return walletAddress;
      },
    async goTo(url) {
        await Promise.all([
          playwright.terraStationWindow().waitForNavigation(),
          playwright.terraStationWindow().goto(url),
        ]);
        await playwright.waitUntilStable();
      },
      async goToHome() {
        await module.exports.goTo(extensionHomeUrl);
      },
      async getExtensionDetails() {
        extensionInitialUrl = await playwright.terraStationWindow().url();
        extensionId = extensionInitialUrl.match('//(.*?)/')[1];
        extensionHomeUrl = `chrome-extension://${extensionId}/index.html#/`;
        return {
          extensionInitialUrl,
          extensionId,
        };
      },
      async initialSetup(
        playwrightInstance,
      ) {
        if (playwrightInstance) {
          await playwright.init(playwrightInstance);
        } else {
          await playwright.init();
        }
        await playwright.assignWindows();
        await playwright.assignActiveTabName('terraStation');
        await module.exports.getExtensionDetails();
        return true;
      },
}

module.exports = terrastation