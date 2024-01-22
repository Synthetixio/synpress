import fs from 'fs-extra'

export async function isDirEmpty(dirPath: string) {
  const files = await fs.readdir(dirPath)

  return files.length === 0
}
