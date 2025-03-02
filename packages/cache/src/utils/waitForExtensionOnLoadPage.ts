import { type BrowserContext, errors as playwrightErrors } from 'playwright-core'

const EXTENSION_LOAD_TIMEOUT = 10000
const MAX_RETRIES = 2

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function waitForExtensionOnLoadPage(context: BrowserContext) {
  let retries = 0

  while (retries <= MAX_RETRIES) {
    try {
      // Attempt to wait for the extension to load
      return await context.waitForEvent('page', { timeout: EXTENSION_LOAD_TIMEOUT })
    } catch (e) {
      if (e instanceof playwrightErrors.TimeoutError) {
        retries++

        if (retries <= MAX_RETRIES) {
          console.warn(
            `[WaitForExtensionOnLoadPage] Extension did not load in time, retrying (attempt ${retries}/${MAX_RETRIES})...`
          )

          await sleep(1000 * retries)
          continue
        }

        throw new Error('[WaitForExtensionOnLoadPage] Extension failed to load after multiple attempts!')
      }
      throw e
    }
  }

  // This should never be reached
  throw new Error('[WaitForExtensionOnLoadPage] Unexpected end of function reached')
}
