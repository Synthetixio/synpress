import path from 'node:path'
import fs from 'fs-extra'
import unzipCrx from 'unzip-crx-3'
import unzippper from 'unzipper'

type UnzipArchiveOptions = {
  archivePath: string
  overwrite?: boolean
}

type UnzipArchiveResult = {
  outputPath: string
  unzipSkipped: boolean
}

export async function unzipArchive(options: UnzipArchiveOptions) {
  const { archivePath, overwrite } = options

  const resultPromise = new Promise<UnzipArchiveResult>((resolve, reject) => {
    const archiveFileExtension = archivePath.split('.').slice(-1)
    const outputPath = archivePath.replace(`.${archiveFileExtension}`, '')

    const fileExists = fs.existsSync(outputPath)
    if (fileExists && !overwrite) {
      resolve({
        outputPath,
        unzipSkipped: true
      })

      return
    }

    // Creates the output directory
    fs.mkdirSync(outputPath, { recursive: true })

    fs.createReadStream(archivePath)
      .pipe(unzippper.Parse())
      .on('entry', function (entry) {
        const fileName = entry.path
        const type = entry.type as 'Directory' | 'File'

        if (type === 'Directory') {
          fs.mkdirSync(path.join(outputPath, fileName), { recursive: true })
          return
        }

        if (type === 'File') {
          const outputFilePath = path.join(outputPath, fileName)
          const outputFilePathDir = path.dirname(outputFilePath)

          // Handles the rare case when a file is in a directory which has no entry ¯\_(ツ)_/¯
          if (!fs.existsSync(outputFilePathDir)) {
            fs.mkdirSync(outputFilePathDir, { recursive: true })
          }

          entry.pipe(fs.createWriteStream(outputFilePath))
        }
      })
      .promise()
      .then(() => {
        resolve({
          outputPath,
          unzipSkipped: false
        })
      })
      .catch((error: Error) => {
        fs.unlinkSync(outputPath)
        reject(new Error(`[Pipe] ${error.message}`))
      })
  })

  // TODO: Handle errors in a more sophisticated way
  return resultPromise.catch((error: Error) => {
    throw new Error(`[UnzipFile] Error unzipping the file - ${error.message}`)
  })
}

export async function unzipArchivePhantom(options: UnzipArchiveOptions) {
  const { archivePath, overwrite } = options

  const archiveFileExtension = archivePath.split('.').slice(-1)
  const outputPath = archivePath.replace(`.${archiveFileExtension}`, '')

  const fileExists = fs.existsSync(outputPath)
  if (fileExists && !overwrite) {
    return {
      outputPath,
      unzipSkipped: true
    }
  }

  // Creates the output directory
  fs.mkdirSync(outputPath, { recursive: true })

  await unzipCrx(archivePath, outputPath)

  // TODO: Handle errors

  return { outputPath }
}
