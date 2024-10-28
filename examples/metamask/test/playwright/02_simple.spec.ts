import synpress from './synpress'

const test = synpress

const { expect } = test

test('should confirm contract deployment', async ({ page, metamask, connectToAnvil }) => {
  // Connect to Anvil network
  await connectToAnvil()

  // Check if token addresses are initially empty
  await expect(page.locator('#tokenAddresses')).toBeEmpty()

  // Click the button to create a new token
  await page.locator('#createToken').click()

  // Confirm the transaction in MetaMask
  await metamask.confirmTransaction()

  // Verify that the token address is correctly displayed after deployment
  await expect(page.locator('#tokenAddresses')).toHaveText('0x5FbDB2315678afecb367f032d93F642f64180aa3')
})

test('should confirm legacy transaction', async ({ page, metamask, connectToAnvil }) => {
  // Connect to Anvil network
  await connectToAnvil()

  // Click the button to send a transaction
  await page.locator('#sendButton').click()

  // Confirm the transaction in MetaMask
  await metamask.confirmTransaction()
})

test('should confirm EIP-1559 transaction', async ({ page, metamask, connectToAnvil }) => {
  // Connect to Anvil network
  await connectToAnvil()

  // Click the button to send an EIP-1559 transaction
  await page.locator('#sendEIP1559Button').click()

  // Confirm the transaction in MetaMask
  await metamask.confirmTransaction()
})

test('should sign and verify EIP-712 message', async ({ page, metamask }) => {
  // Click the button to sign a typed data (EIP-712) message
  await page.locator('#signTypedDataV4').click()

  // Confirm the signature in MetaMask
  await metamask.confirmSignature()

  // Verify that the signature result is correct
  await expect(page.locator('#signTypedDataV4Result')).toHaveText(
    '0x1cf422c4a319c19ecb89c960e7c296810278fa2bef256c7e9419b285c8216c547b3371fa1ec3987ce08561d3ed779845393d8d3e4311376d0bc0846f37d1b2821c'
  )

  // Click the button to verify the signed message
  await page.locator('#signTypedDataV4Verify').click()

  // Verify that the correct address is returned from the verification
  await expect(page.locator('#signTypedDataV4VerifyResult')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
})
