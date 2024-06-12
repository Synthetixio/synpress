import { getEthereumWalletMock } from './initEthereumWalletMock'

export default function setupTasks(on: Cypress.PluginEvents) {
  on('task', {
    importWallet: async function (seedPhrase: string) {
      const ethereumWalletMock = getEthereumWalletMock()
      if (ethereumWalletMock) {
        await ethereumWalletMock.importWallet(seedPhrase)
      }
      return true
    },
    addNewAccount: async function () {
      const ethereumWalletMock = getEthereumWalletMock()
      if (ethereumWalletMock) {
        await ethereumWalletMock.addNewAccount()
      }
      return true
    },
    getAllAccounts: async function () {
      const ethereumWalletMock = getEthereumWalletMock()
      if (ethereumWalletMock) {
        return await ethereumWalletMock.getAllAccounts()
      }
      return []
    }
  })
}
