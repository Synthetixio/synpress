import { getUniqueWalletSetupFunctions } from './utils/getUniqueWalletSetupFunctions'
import { triggerCacheCreation } from './utils/triggerCacheCreation'

export async function createCache(walletSetupDirPath: string, downloadExtension: () => Promise<string>, force = false) {
  console.log('1. made it in createCache', walletSetupDirPath, downloadExtension)
  const setupFunctions = await getUniqueWalletSetupFunctions(walletSetupDirPath)
  console.log('2. received setup functions', setupFunctions)
  const cacheCreationPromises = await triggerCacheCreation(setupFunctions, downloadExtension, force)
  console.log('3. cache creation promise, triggered', cacheCreationPromises)
  if (cacheCreationPromises.length === 0) {
    console.log('No new setup functions to cache. Exiting...')
    return
  }
  console.log('4. created and exiting')
  // TODO: This line has no unit test. Not sure how to do it. Look into it later.
  await Promise.all(cacheCreationPromises)

  console.log('All wallet setup functions are now cached!')
}
