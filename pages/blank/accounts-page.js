const { getButton, getLink, getForm } = require('../documentUtils');

module.exports = {
  getConfirmCreationButton: async documentNode => {
    return getButton(documentNode, {
      name: /Create/i,
    });
  },
  getCreationForm: async documentNode => {
    return getForm(documentNode, {
      name: /Create account/i,
    });
  },
  getCreateNewAccountButton: async documentNode => {
    return getLink(documentNode, {
      name: /create new account/i,
    });
  },
  getSwitchAccountButton: async (documentNode, accountName) => {
    return getButton(documentNode, {
      name: new RegExp(accountName, 'i'),
    });
  },
};
