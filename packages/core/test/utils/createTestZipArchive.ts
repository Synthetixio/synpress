import path from 'node:path'
import archiver from 'archiver'
import fs from 'fs-extra'

/**
 * Zip archive with the following structure:
 * .
 * ├── duck.txt
 *     └──> "Quack! 🐾"
 * └── nested
 *     └── nested-duck.txt
 *         └──> "Nested Quack! 🐾"
 */
const ZIP_ARCHIVE_CONTENT_IN_BASE_64_URL = [
  'UEsDBBQACAAIAOZ2Q1cAAAAAAAAAAAAAAAAIAAAAZHVjay50eHQLLE1MzlZU-DB_wj4AUEsHCBjTmn4N',
  'AAAACwAAAFBLAwQKAAAAAADmdkNXAAAAAAAAAAAAAAAABwAAAG5lc3RlZC9QSwMEFAAIAAgA5nZDVwAA',
  'AAAAAAAAAAAAABYAAABuZXN0ZWQvbmVzdGVkLWR1Y2sudHh080stLklNUQgsTUzOVlT4MH_CPgBQSwcI',
  'gkZm8hQAAAASAAAAUEsBAi0DFAAIAAgA5nZDVxjTmn4NAAAACwAAAAgAAAAAAAAAAAAgAKSBAAAAAGR1',
  'Y2sudHh0UEsBAi0DCgAAAAAA5nZDVwAAAAAAAAAAAAAAAAcAAAAAAAAAAAAQAO1BQwAAAG5lc3RlZC9Q',
  'SwECLQMUAAgACADmdkNXgkZm8hQAAAASAAAAFgAAAAAAAAAAACAApIFoAAAAbmVzdGVkL25lc3RlZC1k',
  'dWNrLnR4dFBLBQYAAAAAAwADAK8AAADAAAAAAAA'
].join('')

export const ARCHIVE_CONTENTS = {
  'duck.txt': 'Quack! 🐾',
  'nested-duck.txt': 'Nested Quack! 🐾'
} as const

export function createTestZipArchive(archivePath: string) {
  const targetDir = path.dirname(archivePath)
  fs.mkdirSync(targetDir, { recursive: true })
  fs.writeFileSync(archivePath, Buffer.from(ZIP_ARCHIVE_CONTENT_IN_BASE_64_URL, 'base64url'))
}

export async function createTestZipArchiveWithIncorrectEntries(archivePath: string) {
  return new Promise<void>((resolve, reject) => {
    const archiveStream = fs.createWriteStream(archivePath)
    const archive = archiver('zip', {
      zlib: { level: 9 } // Compression level
    })

    archiveStream.on('finish', () => {
      resolve()
    })

    archive.on('error', (error: unknown) => {
      reject(error)
    })

    archive.pipe(archiveStream)

    const duckFileName = 'duck.txt'
    archive.append(ARCHIVE_CONTENTS[duckFileName], { name: duckFileName })

    const nestedDuckFileName = 'nested-duck.txt'
    archive.append(ARCHIVE_CONTENTS[nestedDuckFileName], {
      name: path.join('nested', nestedDuckFileName)
    })

    archive.finalize()
  })
}
