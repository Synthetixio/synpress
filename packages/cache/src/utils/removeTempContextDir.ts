import { type RimrafAsyncOptions, rimraf } from 'rimraf'

/**
 * Sometimes the browser is still closing when we remove the context directory which results in an error/unwanted behaviour.
 * We retry a few times to make sure it's removed.
 */
const opts: RimrafAsyncOptions = {
  maxRetries: 10
}

/**
 * Removes the temporary context directory created per-worker basis.
 *
 * This function mirrors the one found in the Playwright source code:
 * https://github.com/microsoft/playwright/blob/d1d5fc67dc684a5d4b682749e59bba8cc0ad14de/packages/playwright-core/src/utils/processLauncher.ts#L142
 */
export async function removeTempContextDir(contextDirPath: string) {
  return new Promise<null | Error>((resolve) => {
    rimraf(contextDirPath, opts)
      .then(() => resolve(null))
      .catch((e: Error) => resolve(e))
  })
}
