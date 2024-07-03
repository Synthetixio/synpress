import path from 'node:path'
import fs from 'fs-extra'
import { CACHE_DIR_NAME } from './constants'

export function ensureCacheDirExists() {
  const cacheDirPath = path.join(process.cwd(), CACHE_DIR_NAME)
  fs.ensureDirSync(cacheDirPath)
  return cacheDirPath
}
