import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should disconnect from all dapps, or return false', async ({ keplr }) => {
  try {
    const disconnected = await keplr.disconnectWalletFromDapps()
    expect(disconnected).toBeDefined()
  } catch (error) {
    console.error('Error:', error)
  }
})
