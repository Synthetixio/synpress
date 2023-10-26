import path from 'node:path'
import { createCache } from 'core'
import { prepareExtension } from 'metamask'
import { WALLET_SETUP_DIR_NAME } from './constants'

const isForce = process.argv.includes('--force')
const isHeadless = !!process.env.HEADLESS

const walletSetupDirPath = path.join(process.cwd(), 'test', WALLET_SETUP_DIR_NAME)
console.log({ walletSetupDirPath, isForce, isHeadless })

console.log('\t---- ⏳ Triggering the `createCache` function ----\n')

await createCache(walletSetupDirPath, prepareExtension, isForce)

console.log('\n\t---- ✅ `createCache` function finished ----\n')
