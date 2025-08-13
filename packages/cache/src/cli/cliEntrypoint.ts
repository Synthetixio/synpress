import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import chalk from 'chalk'
import { Command } from 'commander'
import { rimraf } from 'rimraf'
import { WALLET_SETUP_DIR_NAME } from '../constants'
import { createCache } from '../createCache'
import { prepareExtension } from '../prepareExtension'
import { prepareExtensionPetra } from '../prepareExtensionPetra'
import { prepareExtensionPhantom } from '../prepareExtensionPhantom'
import { compileWalletSetupFunctions } from './compileWalletSetupFunctions'
import { footer } from './footer'

interface CliFlags {
  headless: boolean
  force: boolean
  debug: boolean
  phantom: boolean
  petra: boolean
}

// Helper function to check if running in WSL
const isRunningInWsl = (): boolean => {
  try {
    const releaseContent = fs.readFileSync('/proc/version', 'utf8').toLowerCase()
    return releaseContent.includes('microsoft') || releaseContent.includes('wsl')
  } catch (error) {
    return false
  }
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
    .option('-p, --phantom', 'If this flag is present, Phantom extension will be installed instead of Metamask', false)
    .option('-ptr, --petra', 'If this flag is present, Petra extension will be installed instead of Metamask', false)
    .helpOption(undefined, 'Display help for command')
    .addHelpText('afterAll', `\n${footer}\n`)
    .parse(process.argv)

  let walletSetupDir = path.join(process.cwd(), 'test', WALLET_SETUP_DIR_NAME)

  if (program.args[0]) {
    walletSetupDir = path.join(process.cwd(), program.args[0])
  }

  const flags: CliFlags = program.opts()

  if (flags.headless) {
    process.env.HEADLESS = true
  }

  if (flags.debug) {
    console.log('[DEBUG] Running with the following options:')
    console.log(
      {
        cacheDir: walletSetupDir,
        ...flags,
        headless: Boolean(process.env.HEADLESS) ?? false
      },
      '\n'
    )
  }

  if (os.platform() === 'win32' && !isRunningInWsl()) {
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

  console.log(chalk.greenBright('🚀 Building the cache for wallet setup functions... 🚀\n'))

  const { outDir: compiledWalletSetupDirPath, setupFunctionHashes } = await compileWalletSetupFunctions(
    walletSetupDir,
    flags.debug
  )

  // TODO: We should be using `prepareExtension` functions from the wallet itself!
  if (flags.phantom) {
    await createCache(compiledWalletSetupDirPath, setupFunctionHashes, prepareExtensionPhantom, flags.force)
  } else if (flags.petra) {
    await createCache(compiledWalletSetupDirPath, setupFunctionHashes, prepareExtensionPetra, flags.force)
  } else {
    await createCache(compiledWalletSetupDirPath, setupFunctionHashes, prepareExtension, flags.force)
  }

  if (!flags.debug) {
    await rimraf(compiledWalletSetupDirPath)
  }
}
