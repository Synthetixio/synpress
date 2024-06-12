import { getKeplrWallet } from "./initKeplrWallet"

export default function setupTasks(on: Cypress.PluginEvents) {
  on('task', {
    importWallet: async function (seedPhrase: string, password: string) {
      const keplrWallet = getKeplrWallet()
      if (keplrWallet) {
        await keplrWallet.importWallet(seedPhrase, password)
      }
      return true
    },
  })
}
