import synpress from '../synpress'

const test = synpress

test('should create address', async ({ keplr }) => {
  try {
    await keplr.getWalletAddress()
  } catch (error) {
    console.error('Error:', error)
  }
})