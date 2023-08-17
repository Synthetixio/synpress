const log = require('debug')('synpress:synpress');
const playwright = require('./playwright');
const metamask = require('./metamask');
const helpers = require('../helpers');

module.exports = {
  async resetState() {
    log('Resetting state of synpress');
    await playwright.resetState();
    await metamask.resetState();
    await helpers.resetState();
  },
};
