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
    await playwright.assignSeedPage();
    await playwright.setupQaWalletAndVerify();
    return true;
  },
  async recoverWalletFromSeed() {
    await playwright.goToManageWalletsMenuFromHome();
    await playwright.fillImportFromSeedPhraseForm(
      'Test wallet 2',
      'Testtest123!',
    );
  },
  async verifyManageWalletsForm() {
    await playwright.goToManageWalletsMenuFromHome();
    await playwright.verifyElementsManageWalletsForm();
  },
};

module.exports = terrastation;
