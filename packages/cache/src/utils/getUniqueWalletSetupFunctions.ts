import path from 'node:path'
import type { WalletSetupFunction } from '../defineWalletSetup'
import { getWalletSetupFiles } from './getWalletSetupFiles'
import { importWalletSetupFile } from './importWalletSetupFile'

type DuplicatesMap = Record<string, { fileName: string; setupFunction: WalletSetupFunction }[]>

export async function getUniqueWalletSetupFunctions(walletSetupDirPath: string) {
  const fileList = await getWalletSetupFiles(walletSetupDirPath)

  const setupFunctions = new Map<string, { fileName: string; setupFunction: WalletSetupFunction }>()

  const duplicatesMap: DuplicatesMap = {}

  for (const fileName of fileList) {
    const walletSetupFilePath = path.join(walletSetupDirPath, fileName)
    const { hash, fn } = await importWalletSetupFile(walletSetupFilePath)

    const entry = {
      fileName,
      setupFunction: fn
    }

    // Since we're checking for duplicates later, we can safely forget about overwriting.
    setupFunctions.set(hash, entry)

    if (duplicatesMap[hash]) {
      duplicatesMap[hash]?.push(entry)
    } else {
      duplicatesMap[hash] = [entry]
    }
  }

  throwIfThereAreDuplicatedHashes(duplicatesMap)

  return setupFunctions
}

function throwIfThereAreDuplicatedHashes(duplicatesMap: DuplicatesMap) {
  const duplicatedHashes = Object.entries(duplicatesMap).filter(
    ([, setupFunctionsArray]) => setupFunctionsArray.length > 1
  )

  if (duplicatedHashes.length === 0) {
    return
  }

  const sortedDuplicatedHashes = duplicatedHashes.sort(([hashA], [hashB]) => hashA.localeCompare(hashB))

  throw new Error(
    [
      '[GetUniqueWalletSetupFunctions] There are identical wallet setup functions:',
      sortedDuplicatedHashes
        .map(([hash, setupFunctionsArray]) => {
          return `\t${hash} - [${setupFunctionsArray.map(({ fileName }) => fileName).join(', ')}]`
        })
        .join('\n')
    ].join('\n')
  )
}
