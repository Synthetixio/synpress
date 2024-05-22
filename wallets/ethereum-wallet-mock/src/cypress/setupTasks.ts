import { getEthereumWalletMock } from './initEthereumWalletMock';

export default function setupTasks(on: Cypress.PluginEvents) {
  on("task", {
    importWallet: async function (seedPhrase: string) {
      const ethereumWalletMock = getEthereumWalletMock();
      if (ethereumWalletMock) {
        await ethereumWalletMock.importWallet(seedPhrase);
      }
      return true;
    },
    addNewAccount: async function (accountName: string) {
      const ethereumWalletMock = getEthereumWalletMock();
      if (ethereumWalletMock) {
        await ethereumWalletMock.addNewAccount(accountName);
      }
      return true;
    },
    importWalletFromPrivateKey: async function (privateKey: string) {
      const ethereumWalletMock = getEthereumWalletMock();
      if (ethereumWalletMock) {
        await ethereumWalletMock.importWalletFromPrivateKey(privateKey);
      }
      return true;
    },
    openSettings: async function () {
      const ethereumWalletMock = getEthereumWalletMock();
      if (ethereumWalletMock) {
        await ethereumWalletMock.openSettings();
      }
      return true;
    },
  });
}
