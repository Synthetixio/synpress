import { getUniqueWalletSetupFunctions } from './utils/getUniqueWalletSetupFunctions'
import { triggerCacheCreation } from './utils/triggerCacheCreation'

export async function createCache(
  walletSetupDirPath: string,
  hashes: string[],
  downloadExtension: () => Promise<string>,
  force = false
) {
  const setupFunctions = await getUniqueWalletSetupFunctions(walletSetupDirPath)

  const cacheCreationOutput = await triggerCacheCreation(setupFunctions, hashes, downloadExtension, force)

  if (cacheCreationOutput.length === 0) {
    console.log('No new setup functions to cache. Exiting...')
    return
  }

  console.log('All wallet setup functions are now cached!')
}
