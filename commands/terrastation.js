const log = require('debug')('synpress:metamask');
const playwright = require('./playwrightTerraStation');

const elements = require('../pages/terrastation/main-page');

const terrastation = {
  async initialSetup(playwrightInstance) {
    if (playwrightInstance) {
      await playwright.init(playwrightInstance);
    } else {
      await playwright.init();
    }

    await playwright.assignStartPage();
    await playwright.assignOtherPages();
    await playwright.setupQaWalletAndVerify();
    return true;
  },
};

module.exports = terrastation;
