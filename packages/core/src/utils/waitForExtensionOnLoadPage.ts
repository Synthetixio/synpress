import { type BrowserContext, errors as playwrightErrors } from 'playwright-core'

export async function waitForExtensionOnLoadPage(context: BrowserContext) {
  try {
    return await context.waitForEvent('page', { timeout: 5000 }) // TODO: Extract & Make this timeout configurable.
  } catch (e) {
    if (e instanceof playwrightErrors.TimeoutError) {
      throw new Error('[WaitForExtensionOnLoadPage] Extension did not load in time!')
    }

    throw e
  }
}
