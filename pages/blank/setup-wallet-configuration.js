/* eslint-disable testing-library/no-await-sync-query */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line testing-library/no-await-sync-query
/* eslint-disable testing-library/prefer-screen-queries */
const { queries } = require('pptr-testing-library');
const { getLink, getButton } = require('../documentUtils');

module.exports = {
  isSetupCompleted: async documentNode => {
    try {
      await queries.getByText(documentNode, /set-up completed/i);
    } catch (e) {
      return false;
    }
    return true;
  },
  getStartedButton: async documentNode => {
    return await getLink(documentNode, {
      name: /get started/i,
    });
  },
  modalCosentButton: async documentNode => {
    return await getButton(documentNode, {
      name: /i understand/i,
    });
  },
  importWalletButton: async documnetNode => {
    return await getLink(documnetNode, {
      name: /Import Your wallet/i,
    });
  },
  unlockWalletForm: {
    password: async documentNode => {
      return await queries.getByPlaceholderText(
        documentNode,
        /Enter Password/i,
      );
    },
    submitButton: async documentNode => {
      return await getButton(documentNode, {
        name: /confirm/i,
      });
    },
  },
  importWalletForm: {
    seedPhrase: async documentNode => {
      return await queries.getByPlaceholderText(
        documentNode,
        /Enter Seed Phrase/i,
      );
    },
    password: async documentNode => {
      return await queries.getByPlaceholderText(
        documentNode,
        /Enter New Password/i,
      );
    },
    confirmPassword: async documentNode => {
      return await queries.getByPlaceholderText(
        documentNode,
        /Confirm New Password/i,
      );
    },
    termsAndConditionsCheckbox: async documentNode => {
      return await queries.findByLabelText(
        documentNode,
        /I have read and agree to the Terms of Use/i,
      );
    },
    submitButton: async documentNode => {
      return await getButton(documentNode, {
        name: /import/i,
      });
    },
  },
};
