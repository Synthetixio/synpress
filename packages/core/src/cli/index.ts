#!/usr/bin/env node

import path from 'node:path'
import chalk from 'chalk'
import { Command } from 'commander'
import { WALLET_SETUP_DIR_NAME } from '../constants'
import { createCache } from '../createCache'
import { footer } from './footer'
import { prepareExtension } from './prepareExtension'

interface CliFlags {
  headless: boolean
  force: boolean
}

const dirArgumentWarning = [
  chalk.yellowBright`[TEMPORARY NOTE: You`,
  chalk.red.bold` HAVE `,
  chalk.yellowBright`to create this directory`,
  chalk.red.bold` YOURSELF!`,
  chalk.yellowBright`]`
].join('')

export const main = async () => {
  console.log(`⚠️ ${chalk.yellowBright`The CLI is in alpha so expect breaking changes!`} ⚠️\n`)

  const program = new Command()
    .name(chalk.magenta('core'))
    .description('A CLI for building the cache of wallet setup functions')
    .argument(
      '[dir]',
      `Directory containing the wallet setup functions ${dirArgumentWarning}`,
      path.join('test', WALLET_SETUP_DIR_NAME)
    )
    .option(
      '--headless',
      'Build cache in the headless browser mode. Alternatively, set the `HEADLESS` env variable to `true`',
      false
    )
    .option('-f, --force', 'Force the creation of cache even if it already exists', false)
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

  console.log('[DEBUG] Running with the following options:')
  console.log({ cacheDir: walletSetupDir, ...flags, headless: Boolean(process.env.HEADLESS) ?? false })

  // TODO: We should be using `prepareExtension` function from the wallet itself!
  await createCache(walletSetupDir, prepareExtension, flags.force)
}

main().catch((err) => {
  console.log('Aborting...')

  if (err instanceof Error) {
    console.error(err)
  } else {
    console.error('Unknown error occurred!', err)
  }

  process.exit(1)
})
