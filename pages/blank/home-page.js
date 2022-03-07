/* eslint-disable testing-library/no-await-sync-query */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line testing-library/no-await-sync-query
/* eslint-disable testing-library/prefer-screen-queries */
const { queries } = require('pptr-testing-library');
const puppeteer = require('../../commands/puppeteer');
const { getLink, getButton } = require('../documentUtils');
const documentUtils = require('../documentUtils');

module.exports = {
  networkSelector: documentNode => {
    return queries.findByTestId(documentNode, /network-selector/i);
  },
  currentNetwork: documentNode => {
    return queries.findByTestId(documentNode, /selected-network/i);
  },
  showTestNetworkCheckbox: async documentNode => {
    const checkbox = await queries.findByLabelText(
      documentNode,
      /Show Test Networks/i,
    );
    return checkbox;
  },
  findNetworkInSelector: async (documentNode, netId) => {
    try {
      const node = await queries.findByText(
        documentNode,
        new RegExp(netId, 'i'),
      );
      return node;
    } catch (e) {
      return null;
    }
  },
  getSelectedNetwork: async documentNode => {
    const page = puppeteer.blankWindow();
    await page.waitForSelector('[data-testid="selected-network"]');
    let element = await page.$('[data-testid="selected-network"]');
    let value = await page.evaluate(el => el.textContent, element);
    return value;
  },
  getSendTransactionButton: async documentNode => {
    return getLink(documentNode, {
      name: /send/i,
    });
  },
  getAccountAddressButton: async documentNode => {
    return getButton(documentNode, {
      name: /account/i,
    });
  },
  getAccountIcon: async documentNode => {
    return queries.findByTestId(documentNode, /navigate-account-link/i);
  },
  getAccountName: async () => {
    const page = puppeteer.blankWindow();
    await page.waitForSelector('[data-testid="account-name"]');
    let element = await page.$('[data-testid="account-name"]');
    let value = await page.evaluate(el => el.textContent, element);
    return value;
  },
  getActivityButton: async documentNode => {
    return getButton(documentNode, {
      name: /activity/i,
    });
  },
  getActivityList: async documentNode => {
    return queries.findByTestId(documentNode, /activity-list/i);
  },
  getLastTransactionId: async documentNode => {
    const page = puppeteer.blankWindow();
    await page.waitForSelector('[data-testid="activity-list"]');
    await page.waitForTimeout(5000);
    let activityNode = await module.exports.getActivityList(documentNode);
    const activityListButtons = await activityNode.waitForSelector(
      '[role="button"]',
    );
    const txid = await page.evaluate(
      anchor => anchor.getAttribute('data-txid'),
      activityListButtons,
    );
    return txid;
  },
};
