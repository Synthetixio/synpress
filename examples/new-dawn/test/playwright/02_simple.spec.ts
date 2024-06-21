import synpress from './synpress'

const test = synpress

const { expect } = test

test('should confirm contract deployment', async ({ page, metamask, connectToAnvil }) => {
  await connectToAnvil()

  await expect(page.locator('#tokenAddresses')).toBeEmpty()
  await page.locator('#createToken').click()

  await metamask.confirmTransaction()

  await expect(page.locator('#tokenAddresses')).toHaveText('0x5FbDB2315678afecb367f032d93F642f64180aa3')
})

test('should confirm legacy transaction', async ({ page, metamask, connectToAnvil }) => {
  await connectToAnvil()

  await page.locator('#sendButton').click()

  await metamask.confirmTransaction()
})

test('should confirm EIP-1559 transaction', async ({ page, metamask, connectToAnvil }) => {
  await connectToAnvil()

  await page.locator('#sendEIP1559Button').click()

  await metamask.confirmTransaction()
})

test('should sign and verify EIP-712 message', async ({ page, metamask }) => {
  await page.locator('#signTypedDataV4').click()

  await metamask.confirmSignature()

  await expect(page.locator('#signTypedDataV4Result')).toHaveText(
    '0x1cf422c4a319c19ecb89c960e7c296810278fa2bef256c7e9419b285c8216c547b3371fa1ec3987ce08561d3ed779845393d8d3e4311376d0bc0846f37d1b2821c'
  )

  await page.locator('#signTypedDataV4Verify').click()

  await expect(page.locator('#signTypedDataV4VerifyResult')).toHaveText('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
})
