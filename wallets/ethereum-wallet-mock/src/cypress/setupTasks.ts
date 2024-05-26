import { getEthereumWalletMock } from "./initEthereumWalletMock";
import type { WalletMock } from "../EthereumWalletMock";

export default function setupTasks(on: Cypress.PluginEvents) {
  on("task", {
    importWallet: async function (seedPhrase: string) {
      const ethereumWalletMock = getEthereumWalletMock();
      if (ethereumWalletMock) {
        await ethereumWalletMock.importWallet(seedPhrase);
        return true;
      }
      return false;
    },
    addNewAccount: async function () {
      const ethereumWalletMock = getEthereumWalletMock();
      if (ethereumWalletMock) {
        await ethereumWalletMock.addNewAccount();
        return true;
      }
      return false;
    },
    getAllAccounts: async function () {
      const ethereumWalletMock = getEthereumWalletMock();
      if (ethereumWalletMock) {
        return await ethereumWalletMock.getAllAccounts();
      }
      return [];
    },
    connectToDapp: async function (walletName: WalletMock) {
      const ethereumWalletMock = getEthereumWalletMock();

      if (ethereumWalletMock) {
        await ethereumWalletMock.connectToDapp(walletName);
        return true;
      }
      return false;
    },
  });
}
