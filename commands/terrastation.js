const log = require('debug')('synpress:metamask');
const playwright = require('./playwrightTerraStation');

const elements = require('../pages/terrastation/main-page');

const terrastation = {
  extensionId: () => {
    return extensionId;
  },
  extensionUrl: () => {
    return extensionHomeUrl;
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

  async initialSetup(playwrightInstance) {
    if (playwrightInstance) {
      await playwright.init(playwrightInstance);
    } else {
      await playwright.init();
    }

    await playwright.assignPages();
    await playwright.switchToTerraStationWindow();

    return true;
  },
};

module.exports = terrastation;
