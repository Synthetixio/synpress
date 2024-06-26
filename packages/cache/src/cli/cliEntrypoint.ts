import os from 'node:os'
import path from 'node:path'
import chalk from 'chalk'
import { Command } from 'commander'
import { rimraf } from 'rimraf'
import { WALLET_SETUP_DIR_NAME } from '../constants'
import { createCache } from '../createCache'
import { prepareExtension } from '../prepareExtension'
import { compileWalletSetupFunctions } from './compileWalletSetupFunctions'
import { footer } from './footer'

interface CliFlags {
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
    .helpOption(undefined, 'Display help for command')
    .addHelpText('afterAll', `\n${footer}\n`)
    .parse(process.argv)

  let walletSetupDir = program.args[0]
  if (!walletSetupDir) {
    walletSetupDir = path.join(process.cwd(), 'test', WALLET_SETUP_DIR_NAME)
  }

  const flags: CliFlags = program.opts()

  if (flags.headless) {
    process.env.HEADLESS = true
  }

  if (flags.debug) {
    console.log('[DEBUG] Running with the following options:')
    console.log({ cacheDir: walletSetupDir, ...flags, headless: Boolean(process.env.HEADLESS) ?? false }, '\n')
  }

  if (os.platform() === 'win32') {
    console.log(
      [
        chalk.redBright('🚨 Sorry, building cach on Windows is currently not supported. Please use WSL instead! 🚨'),
        chalk.gray('You can still run tests on windows without cache using <Insert command here>! 😇')
      ].join('\n')
    )
    process.exit(1)
  }

  const compiledWalletSetupDirPath = await compileWalletSetupFunctions(walletSetupDir, flags.debug)

  // TODO: We should be using `prepareExtension` function from the wallet itself!
  await createCache(compiledWalletSetupDirPath, prepareExtension, flags.force)

  if (!flags.debug) {
    await rimraf(compiledWalletSetupDirPath)
  }
}
