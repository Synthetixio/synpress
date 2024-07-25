import { prepareExtension } from '../../prepareExtension'

export async function initMetaMask() {
  const metamaskPath = await prepareExtension(false)

  const extensions = [metamaskPath]
  const browserArgs = []

  if (process.env.HEADLESS) {
    browserArgs.push('--headless=new')
  }

  return { extensions, browserArgs }
}
