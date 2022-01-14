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
};
