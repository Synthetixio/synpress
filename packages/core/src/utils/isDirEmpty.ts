import fs from 'fs-extra'

export async function isDirEmpty(dirPath: string) {
  try {
    const files = await fs.readdir(dirPath)

    return files.length === 0
  } catch (e) {
    if (e instanceof Error && e.message.includes('ENOENT')) {
      return true
    }

    throw e
  }
}
