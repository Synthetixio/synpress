import path from 'node:path'
import fs from 'fs-extra'
import { downloadFile, ensureCacheDirExists, unzipCrxArchive } from '.'

export const PETRA_EXTENSION_ID = 'ejjladinnckdgjemekebdpeokbikhfci'
export const PETRA_EXTENSION_DOWNLOAD_URL = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=9999.0&acceptformat=crx2,crx3&x=id%3D${encodeURIComponent(
  PETRA_EXTENSION_ID
)}%26uc`

export async function prepareExtensionPetra(forceCache = true) {
  let outputDir = ''
  if (forceCache) {
    outputDir = ensureCacheDirExists()
  } else {
    outputDir = process.platform === 'win32' ? `file:\\\\\\${outputDir}` : path.resolve('./', 'downloads')

    if (!(await fs.exists(outputDir))) {
      fs.mkdirSync(outputDir)
    }
  }

  const downloadResult = await downloadFile({
    url: PETRA_EXTENSION_DOWNLOAD_URL,
    outputDir,
    fileName: 'petra-chrome-latest.crx'
  })

  const unzipResult = await unzipCrxArchive({
    archivePath: downloadResult.filePath
  })

  return unzipResult.outputPath
}
