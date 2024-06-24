import os from 'node:os'
import path from 'node:path'
import { WALLET_SETUP_DIR_NAME } from '../constants'
import { prepareExtension } from '../prepareExtension'
import chalk from 'chalk'
import { Command } from 'commander'
import { rimraf } from 'rimraf'
import { createCache } from '../createCache'
import { compileWalletSetupFunctions } from './compileWalletSetupFunctions'
import { footer } from './footer'

interface CliFlags {
  keplr: boolean
  metamask: boolean
  headless: boolean
  force: boolean
  debug: boolean
}

// TODO: Add unit tests for the CLI!
export const cliEntrypoint = async () => {
  console.log(`⚠️ ${chalk.yellowBright`The CLI is in alpha so expect breaking changes!`} ⚠️\n`)

  const program = new Command()
    .name(chalk.magenta('synpress'))
    .description('A CLI for building the cache of wallet setup functions')
    .argument('[dir]', 'Directory containing the wallet setup functions', path.join('test', WALLET_SETUP_DIR_NAME))
    .option(
      '--headless',
      'Build cache in the headless browser mode. Alternatively, set the `HEADLESS` env variable to `true`',
      false
    )
    .option('-f, --force', 'Force the creation of cache even if it already exists', false)
    .option('-d, --debug', 'If this flag is present, the compilation files are not going to be deleted', false)
    .option('-k, --keplr', 'Prepare the Keplr extension', false)
    .option('-m, --metamask', 'Prepare the MetaMask extension', false)
    .helpOption(undefined, 'Display help for command')
    .addHelpText('afterAll', `\n${footer}\n`)
    .parse(process.argv)
  let walletSetupDir = program.args[0]
  if (!walletSetupDir) {
    walletSetupDir = path.join(process.cwd(), 'test', WALLET_SETUP_DIR_NAME)
  }

  const flags: CliFlags = program.opts()

  if (flags.debug) {
    console.log('[DEBUG] Running with the following options:')
    console.log({ cacheDir: walletSetupDir, ...flags, headless: flags.headless ?? false }, '\n')
  }

  const extensionsToSetup = () => {
    const extensions = []
    if (flags.keplr) {
      extensions.push('Keplr')
    }
    if (flags.metamask) {
      extensions.push('MetaMask')
    }
    return extensions
  }
  let extensionNames = extensionsToSetup()

  if (!extensionNames.length) {
    extensionNames = ['Keplr']
  }

  if (os.platform() === 'win32') {
    console.log(
      [
        chalk.redBright('🚨 Sorry, Windows is currently not supported. Please use WSL instead! 🚨'),
        chalk.gray(
          'If you want to give it a crack over a hot cup of coffee and add Windows support yourself, please get in touch with the team on Discord so we can offer some guidance! 😇'
        )
      ].join('\n')
    )
    process.exit(1)
  }

  const compiledWalletSetupDirPath = await compileWalletSetupFunctions(walletSetupDir, flags.debug)
  for (const extensionName of extensionNames) {
    await createCache(compiledWalletSetupDirPath, () => prepareExtension(extensionName), flags.force) // Pass extensionName
  }
  // TODO: We should be using `prepareExtension` function from the wallet itself!

  if (!flags.debug) {
    await rimraf(compiledWalletSetupDirPath)
  }
}
