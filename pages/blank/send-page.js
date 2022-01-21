/* eslint-disable testing-library/no-await-sync-query */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line testing-library/no-await-sync-query
/* eslint-disable testing-library/prefer-screen-queries */
const { queries } = require('pptr-testing-library');
const { getLink, getButton } = require('../documentUtils');

module.exports = {
  getTargetAccountTransaction: async (documentNode, accountName) => {
    return getButton(documentNode, {
      name: new RegExp(accountName, 'i'),
    });
  },
  getNextButton: async documentNode => {
    return getButton(documentNode, {
      name: /next/i,
    });
  },
  getConfirmButton: async documentNode => {
    return getButton(documentNode, {
      name: /confirm/i,
    });
  },
  getAmountInput: async documentNode => {
    return queries.findByLabelText(documentNode, /Amount/i);
  },
};
