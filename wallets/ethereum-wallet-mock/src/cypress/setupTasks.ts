export default function setupTasks(on: Cypress.PluginEvents) {
  on("task", {
  //   // importWallet: function (seedPhrase) {
  //   //   const ethereumWalletMock = getEthereumWalletMock();
  //   //   if (ethereumWalletMock) {
  //   //     ethereumWalletMock.importWallet(seedPhrase);
  //   //     return true;
  //   //   }
  //   //   return false;
  //   // },
  //   importWalletFromPrivateKey: function ({ privateKey }) {
  //     // cy.window().then((cypressWindow) => {
  //     //   cypressWindow.Web3Mock.mock({
  //     //     blockchain: "ethereum",
  //     //     wallet: "metamask",
  //     //     accounts: { return: ["0xd73b04b0e696b0945283defa3eee453814758f1a"] },
  //     //   });
  //     // })
  //     const ethereumWalletMock = getEthereumWalletMock();
  //     if (ethereumWalletMock) {
  //       ethereumWalletMock.importWalletFromPrivateKey(
  //         privateKey
  //       );
  //       return true;
  //     }
  //     return false;
  //   },
  //   // addNewAccount: async function () {
  //   //   const ethereumWalletMock = getEthereumWalletMock();
  //   //   if (ethereumWalletMock) {
  //   //     await ethereumWalletMock.addNewAccount();
  //   //     return true;
  //   //   }
  //   //   return false;
  //   // },
  //   // getAllAccounts: async function () {
  //   //   const ethereumWalletMock = getEthereumWalletMock();
  //   //   if (ethereumWalletMock) {
  //   //     return await ethereumWalletMock.getAllAccounts();
  //   //   }
  //   //   return [];
  //   // },
  //   // connectToDapp: async function (walletName: WalletMock) {
  //   //   const ethereumWalletMock = getEthereumWalletMock();
  //   //
  //   //   if (ethereumWalletMock) {
  //   //     await ethereumWalletMock.connectToDapp(walletName);
  //   //     return true;
  //   //   }
  //   //   return false;
    // },
  });
}
