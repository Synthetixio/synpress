import { getMetaMask } from ".";

export default function setupTasks(on: Cypress.PluginEvents) {
  on("task", {
    importWallet: async function (seedPhrase: string) {
      const metamask = getMetaMask();
      if (metamask) {
        await metamask.importWallet(seedPhrase);
      }
      return true;
    },
    addNewAccount: async function (accountName: string) {
      const metamask = getMetaMask();
      if (metamask) {
        await metamask.addNewAccount(accountName);
      }
      return true;
    },
    importWalletFromPrivateKey: async function (privateKey: string) {
      const metamask = getMetaMask();
      if (metamask) {
        await metamask.importWalletFromPrivateKey(privateKey);
      }
      return true;
    },
    openSettings: async function () {
      const metamask = getMetaMask();
      if (metamask) {
        await metamask.openSettings();
      }
      return true;
    },
  });
}
