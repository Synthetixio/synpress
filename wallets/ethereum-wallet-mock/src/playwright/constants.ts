import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

/**
 * The private key used for testing purposes.
 * @constant
 * @type {string}
 */
export const PRIVATE_KEY = 'ea084c575a01e2bbefcca3db101eaeab1d8af15554640a510c73692db24d0a6a'

export const DEFAULT_NETWORK_ID = '0xa'

/**
 * Relative path to the web3-mock bundle.
 * @constant
 * @type {string}
 */
export const web3MockPath = require.resolve('@depay/web3-mock/dist/umd/index.bundle.js')
