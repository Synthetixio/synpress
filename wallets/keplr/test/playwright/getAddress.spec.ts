// import { PASSWORD, SEED_PHRASE } from '../../src'
import synpress from '../synpress'

const test = synpress

// test('should import wallet', async ({ keplr }) => {
//   try {
//     await keplr.setupWallet({ secretWordsOrPrivateKey: SEED_PHRASE, password: PASSWORD })
//   } catch (error) {
//     console.error('Error:', error)
//   }
// })

test('should create address', async ({ keplr }) => {
  try {
    await keplr.getWalletAddress()
  } catch (error) {
    console.error('Error:', error)
  }
})
