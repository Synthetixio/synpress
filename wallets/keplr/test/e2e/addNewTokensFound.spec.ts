import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should fail to add new tokens', async ({ keplr }) => {
  try {
    const newTokensResult = await keplr.addNewTokensFound()
    expect(newTokensResult).toBe('No new tokens found')
  } catch (error) {
    console.error('Error:', error)
  }
})
