import { getUniqueWalletSetupFunctions } from './utils/getUniqueWalletSetupFunctions'
import { triggerCacheCreation } from './utils/triggerCacheCreation'

export async function createCache(walletSetupDirPath: string, downloadExtension: () => Promise<string>, force = false) {
  const setupFunctions = await getUniqueWalletSetupFunctions(walletSetupDirPath)

  const cacheCreationPromises = await triggerCacheCreation(setupFunctions, downloadExtension, force)

  if (cacheCreationPromises.length === 0) {
    console.log('No new setup functions to cache. Exiting...')
    return
  }

  // TODO: This line has no unit test. Not sure how to do it. Look into it later.
  await Promise.all(cacheCreationPromises)

  console.log('All wallet setup functions are now cached!')
}
