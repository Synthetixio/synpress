import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should create address', async ({ keplr }) => {
  try {
    const address = await keplr.getWalletAddress('Cosmos Hub')
    expect(address).toContain('cosmos')
  } catch (error) {
    console.error('Error:', error)
  }
})
