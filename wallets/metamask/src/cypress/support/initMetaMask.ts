import { prepareExtension } from '../../prepareExtension'

export async function initMetaMask() {
  const metamaskPath = await prepareExtension(false)

  const browserArgs = [`--disable-extensions-except=${metamaskPath}`, `--load-extension=${metamaskPath}`]

  if (process.env.HEADLESS) {
    browserArgs.push('--headless=new')
  }

  return browserArgs
}
