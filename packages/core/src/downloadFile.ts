import path from 'node:path'
import axios from 'axios'
import fs from 'fs-extra'
import { onDownloadProgress } from './utils/onDownloadProgress'

type DownloaderOptions = {
  url: string
  outputDir: string
  fileName: string
  overrideFile?: boolean
}

type DownloadFileResult = {
  filePath: string
  downloadSkipped: boolean
}

export async function downloadFile(options: DownloaderOptions) {
  const { url, outputDir, fileName, overrideFile } = options

  const returnPromise = new Promise<DownloadFileResult>((resolve, reject) => {
    const filePath = path.join(outputDir, fileName)

    const fileExists = fs.existsSync(filePath)
    if (fileExists && !overrideFile) {
      resolve({
        filePath,
        downloadSkipped: true
      })

      return
    }

    console.log(`[DEBUG] Downloading file from ${url}`)

    axios
      .get(url, {
        responseType: 'stream',
        onDownloadProgress: onDownloadProgress(url, fileName)
      })
      .then((response) => {
        const writer = fs.createWriteStream(filePath)

        response.data.pipe(writer)

        writer.on('finish', () => {
          resolve({
            filePath,
            downloadSkipped: false
          })
        })
        writer.on('error', (error) => {
          // TODO: Handle errors in a more sophisticated way
          reject(new Error(`[Writer] ${error.message}`))
        })
      })
      .catch((error: Error) => {
        // TODO: Handle errors in a more sophisticated way
        reject(new Error(`[Axios] ${error.message}`))
      })
  })

  // TODO: This is a workaround to handle errors from both `writer` and `axios` and get 100% test coverage.
  return returnPromise.catch((error: Error) => {
    throw new Error(`[DownloadFile] Error downloading the file - ${error.message}`)
  })
}
