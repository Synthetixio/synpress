import path from 'node:path'
import fs from 'fs-extra'
import { ensureCacheDirExists } from '../ensureCacheDirExists'
import { createCacheForWalletSetupFunction } from './createCacheForWalletSetupFunction'
import { getUniqueWalletSetupFunctions } from './getUniqueWalletSetupFunctions'
import { isDirEmpty } from './isDirEmpty'

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
    const doesCacheDirExist = await fs.exists(cachePath)
    const isCacheDirEmpty = await isDirEmpty(cachePath)

    if (doesCacheDirExist) {
      if (isCacheDirEmpty) {
        // In case of incorrect Playwright setup, the cache dir will be empty. For now, we're just deleting it.
        await fs.remove(cachePath)
      } else {
        if (!force) {
          console.log(`Cache already exists for ${funcHash}. Skipping...`)
          continue
        }

        console.log(`Cache already exists for ${funcHash} but force flag is set. Deleting cache...`)
        await fs.remove(cachePath)
      }
    }

    const fileNameWithCorrectExtension = fileName.replace(/\.(ts|js|mjs)$/, '.{ts,js,mjs}')
    console.log(`Triggering cache creation for: ${funcHash} (${fileNameWithCorrectExtension})`)

    // We're not inferring the return type here to make sure we don't accidentally await the function.
    const createCachePromise: Promise<void> = createCacheForWalletSetupFunction(
      extensionPath,
      cachePath,
      setupFunction,
      fileNameWithCorrectExtension
    )
    cacheCreationPromises.push(createCachePromise)
  }

  return cacheCreationPromises
}
