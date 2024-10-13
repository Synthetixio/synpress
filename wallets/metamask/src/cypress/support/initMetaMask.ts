import { prepareExtension } from '../../prepareExtension'

/**
 * Initializes MetaMask for Cypress tests.
 *
 * This function prepares the MetaMask extension for use in Cypress tests.
 * It sets up the necessary browser arguments and extension paths.
 *
 * @async
 * @returns {Promise<{extensions: string[], browserArgs: string[]}>} An object containing the extension path and browser arguments.
 */
export async function initMetaMask(): Promise<{ extensions: string[]; browserArgs: string[] }> {
  const metamaskPath = await prepareExtension(false)

  const extensions = [metamaskPath]
  const browserArgs: string[] = []

  if (process.env.HEADLESS) {
    browserArgs.push('--headless=new')
  }

  return { extensions, browserArgs }
}
