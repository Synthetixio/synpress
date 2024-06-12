import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

export const PRIVATE_KEY = 'ea084c575a01e2bbefcca3db101eaeab1d8af15554640a510c73692db24d0a6a'

export const OPTIMISM_NETWORK_ID = '0xa'

// Relative path to the web3-mock bundle
export const web3MockPath = require.resolve('@depay/web3-mock/dist/umd/index.bundle.js')
