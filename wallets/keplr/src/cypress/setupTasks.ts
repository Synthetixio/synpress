import { PASSWORD, SEED_PHRASE } from "../utils"
import { getKeplrWallet } from "./initKeplrWallet"

export default function setupTasks(on: Cypress.PluginEvents) {
  on('task', {
    importWallet: async function () {
      const keplrWallet = getKeplrWallet()
      if (keplrWallet) {
        await keplrWallet.importWallet(SEED_PHRASE, PASSWORD)
      }
      return true
    }
  })
}
