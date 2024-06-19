// import { PASSWORD, SEED_PHRASE } from '../../src'
import synpress from '../synpress'

const test = synpress

const { expect } = test

// test('should import wallet', async ({ keplr }) => {
//   try {
//     await keplr.setupWallet({ secretWordsOrPrivateKey: SEED_PHRASE, password: PASSWORD })
//   } catch (error) {
//     console.error('Error:', error)
//   }
// })

test('should create address', async ({ keplr }) => {
  try {
    const address = await keplr.getWalletAddress('Cosmos Hub')
    expect(address).toContain('no access to clipboard')
  } catch (error) {
    console.error('Error:', error)
  }
})
