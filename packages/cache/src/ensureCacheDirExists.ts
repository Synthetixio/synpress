import path from 'node:path'
import fs from 'fs-extra'
import { CACHE_DIR_NAME } from './constants'
import appRoot from 'app-root-path'

export function ensureCacheDirExists() {
  const cacheDirPath =
  process.platform === 'win32' ? appRoot.resolve('/node_modules') : path.join(process.cwd(), CACHE_DIR_NAME)
  fs.ensureDirSync(cacheDirPath)
  return cacheDirPath
}
