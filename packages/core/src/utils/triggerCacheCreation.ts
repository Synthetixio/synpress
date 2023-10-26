import path from 'node:path'
import fs from 'fs-extra'
import { ensureCacheDirExists } from '../ensureCacheDirExists'
import { createCacheForWalletSetupFunction } from './createCacheForWalletSetupFunction'
import { getUniqueWalletSetupFunctions } from './getUniqueWalletSetupFunctions'

export async function triggerCacheCreation(
  setupFunctions: Awaited<ReturnType<typeof getUniqueWalletSetupFunctions>>,
  downloadExtension: () => Promise<string>,
  force: boolean
) {
  const cacheDirPath = ensureCacheDirExists()
  const extensionPath = await downloadExtension()

  const cacheCreationPromises = []

  for (const [funcHash, { fileName, setupFunction }] of setupFunctions) {
    const cachePath = path.join(cacheDirPath, funcHash)
    if (await fs.exists(cachePath)) {
      if (!force) {
        console.log(`Cache already exists for ${funcHash}. Skipping...`)
        continue
      }

      console.log(`Cache already exists for ${funcHash} but force flag is set. Deleting cache...`)
      await fs.remove(cachePath)
    }

    console.log(`Triggering cache creation for: ${funcHash} (${fileName})`)

    // We're not inferring the return type here to make sure we don't accidentally await the function.
    const createCachePromise: Promise<void> = createCacheForWalletSetupFunction(extensionPath, cachePath, setupFunction)
    cacheCreationPromises.push(createCachePromise)
  }

  return cacheCreationPromises
}
