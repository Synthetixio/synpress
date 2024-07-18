import synpress from '../synpress'

const test = synpress

const { expect } = test

test('should confirm approval to transfer all from ERC1155', async ({ page, metamask, deployAndMintERC1155 }) => {
  await deployAndMintERC1155()

  await page.locator('#setApprovalForAllERC1155Button').click()
  await metamask.confirmTransaction()

  await expect(page.locator('#erc1155Status')).toHaveText('Set Approval For All completed')
})

test('should perform batch ERC115 transfer', async ({ page, metamask, deployAndMintERC1155 }) => {
  await deployAndMintERC1155()

  await page.locator('#batchTransferFromButton').click()
  await metamask.confirmTransaction()

  await expect(page.locator('#erc1155Status')).toHaveText('Batch Transfer From completed')
})
