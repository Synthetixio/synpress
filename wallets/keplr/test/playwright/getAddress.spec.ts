import test from '../synpress'
import { PASSWORD, SEED_PHRASE } from '../../src'

test('should create address', async ({ keplr }) => {
  try {
    await keplr.setupWallet({ secretWordsOrPrivateKey: SEED_PHRASE, password: PASSWORD })
  } catch (error) {
    console.error('Error:', error)
  
  }
})