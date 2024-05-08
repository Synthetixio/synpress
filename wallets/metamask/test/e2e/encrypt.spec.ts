import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should provide public encryption key', async ({ page, metamask }) => {
  await page.locator('#getEncryptionKeyButton').click()
  await metamask.providePublicEncryptionKey()

  await expect(page.locator('#encryptionKeyDisplay')).toHaveText('mtrHp1WHZM9rxF2Ilot9Hie5XmQcKCf7oDQ1DpGkTSI=')
})

test('should encrypt and decrypt a message', async ({ page, metamask }) => {
  await page.locator('#getEncryptionKeyButton').click()
  await metamask.providePublicEncryptionKey()
  await expect(page.locator('#encryptionKeyDisplay')).toHaveText('mtrHp1WHZM9rxF2Ilot9Hie5XmQcKCf7oDQ1DpGkTSI=')

  // `fill` does not trigger buttons validation, so we use `type` instead
  await page.locator('#encryptMessageInput').type('Hello, world')

  await page.locator('#encryptButton').click()

  const encryptedMessage = await page.locator('#ciphertextDisplay').textContent()

  expect(encryptedMessage).toContain('0x7b')

  await page.locator('#decryptButton').click()
  await metamask.decrypt()

  const decryptedMessage = await page.locator('#cleartextDisplay').textContent()

  expect(decryptedMessage).toEqual('Hello, world')
})
