import { prepareExtensionPhantom } from '../../prepareExtensionPhantom'

/**
 * Initializes Phantom for Cypress tests.
 *
 * This function prepares the Phantom extension for use in Cypress tests.
 * It sets up the necessary browser arguments and extension paths.
 *
 * @async
 * @returns {Promise<{extensions: string[], browserArgs: string[]}>} An object containing the extension path and browser arguments.
 */
export async function initPhantom(): Promise<{ extensions: string[]; browserArgs: string[] }> {
  const phantomPath = await prepareExtensionPhantom(false)

  const extensions = [phantomPath]
  const browserArgs: string[] = []

  if (process.env.HEADLESS) {
    browserArgs.push('--headless=new')
  }

  return { extensions, browserArgs }
}
