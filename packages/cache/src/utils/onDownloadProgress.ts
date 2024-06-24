import type { AxiosProgressEvent } from 'axios'
import ProgressBar from 'progress'
import { bytesToMegabytes } from './bytesToMegabytes'

export function onDownloadProgress(url: string, fileName: string) {
  let progressBar: ProgressBar
  let lastDownloadedBytes = 0

  return ({ loaded: downloadedBytes, total: totalDownloadBytes }: AxiosProgressEvent) => {
    if (!totalDownloadBytes) {
      throw new Error(
        `[DownloadFile] Request returned total download bytes as 0. This should never happen, and it means that the target file is empty. URL: ${url}`
      )
    }

    if (!progressBar) {
      progressBar = getDownloadProgressBar(url, fileName, totalDownloadBytes)
    } else {
      const delta = downloadedBytes - lastDownloadedBytes
      lastDownloadedBytes = downloadedBytes
      progressBar.tick(delta)
    }
  }
}

function getDownloadProgressBar(url: string, fileName: string, totalBytes: number) {
  // TODO: This header should be based on the wallet config.
  const barHeader = url.startsWith('https://github.com/MetaMask/metamask-extension/releases/download/')
    ? '🦊 MetaMask'
    : fileName

  const downloadSize = `${bytesToMegabytes(totalBytes)} MB`

  return new ProgressBar(`${barHeader} (${downloadSize}) [:bar] :percent :etas`, {
    width: 20,
    complete: '=',
    incomplete: ' ',
    total: totalBytes
  })
}
