import path from 'node:path'
import fs from 'fs-extra'
import { CACHE_DIR_NAME } from './constants'
// import appRoot from 'app-root-path'

export function ensureCacheDirExists() {
  const cacheDirPath = path.join(process.cwd(), CACHE_DIR_NAME)
  console.log(cacheDirPath)
  fs.ensureDirSync(cacheDirPath)
  return cacheDirPath
}
