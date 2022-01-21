/* eslint-disable testing-library/prefer-screen-queries */
const { queries } = require('pptr-testing-library');

module.exports = {
  getLink: async (documentNode, queryOptions, timeoutOptions = {}) => {
    return await queries.findByRole(
      documentNode,
      'link',
      queryOptions,
      timeoutOptions,
    );
  },
  getButton: async (documentNode, queryOptions, timeoutOptions = {}) => {
    return await queries.findByRole(
      documentNode,
      'button',
      queryOptions,
      timeoutOptions,
    );
  },
  getForm: async (documentNode, queryOptions = {}, timeoutOptions = {}) => {
    return queries.findByRole(
      documentNode,
      'form',
      queryOptions,
      timeoutOptions,
    );
  },
  getLoadingElement: async (documentNode, timeout = 2000) => {
    return queries.findByRole(
      documentNode,
      'alert',
      {
        name: /loading/i,
      },
      {
        timeout,
      },
    );
  },
  awaitLoadingButtonFinish: async puppeterPage => {
    return puppeterPage.waitForSelector('[aria-label="loading"]', {
      hidden: true,
    });
  },
};
