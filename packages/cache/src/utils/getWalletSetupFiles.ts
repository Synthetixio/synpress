import fs from 'fs-extra'

const SETUP_FILE_FILTER_REGEX = /\.setup\.(ts|js|mjs)$/

export async function getWalletSetupFiles(walletSetupDirPath: string) {
  await fs.access(walletSetupDirPath).catch((e) => {
    // TODO: This should utilize the `e.code`.
    // TODO: See: https://nodejs.org/api/fs.html#fsexistspath-callback
    // TODO: See fix: https://stackoverflow.com/a/49562477
    // TODO: Replace ALL occurrences of `fs.exists` with `fs.access`.
    if (e instanceof Error && e.message.includes('ENOENT')) {
      throw new Error(`[GetWalletSetupFiles] Wallet setup directory does not exist at ${walletSetupDirPath}`)
    }

    throw e
  })

  const setupFilesFilter = (file: string) => file.match(SETUP_FILE_FILTER_REGEX)
  const fileList = (await fs.readdir(walletSetupDirPath)).filter(setupFilesFilter)

  if (!fileList.length) {
    throw new Error(
      [
        `[GetWalletSetupFiles] No wallet setup files found at ${walletSetupDirPath}`,
        'Remember that all wallet setup files must end with `.setup.{ts,js,mjs}` extension!'
      ].join('\n')
    )
  }

  return fileList.sort()
}
