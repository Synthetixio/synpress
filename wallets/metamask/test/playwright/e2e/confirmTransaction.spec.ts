import { ZodError } from 'zod'
import synpress from '../synpress'

const testSynpress = synpress

const test = testSynpress.extend<{
  connectAndTriggerEIP1559Transaction: () => Promise<void>
  connectDeployAndMintNft: () => Promise<void>
}>({
  connectAndTriggerEIP1559Transaction: async ({ page, connectToAnvil }, use) => {
    await use(async () => {
      await connectToAnvil()

      await page.locator('#sendEIP1559Button').click()
    })
  },
  connectDeployAndMintNft: async ({ page, connectToAnvil, metamask }, use) => {
    await use(async () => {
      await connectToAnvil()

      await page.locator('#deployNFTsButton').click()
      await metamask.confirmTransaction()

      await page.locator('#mintButton').click()
      await metamask.confirmTransaction()
    })
  }
})

const { expect, describe } = test

describe('with default gas setting', () => {
  test('should confirm contract deployment', async ({ page, metamask, connectToAnvil }) => {
    await connectToAnvil()

    await expect(page.locator('#tokenAddresses')).toBeEmpty()
    await page.locator('#createToken').click()

    await metamask.confirmTransaction()

    await expect(page.locator('#tokenAddresses')).toContainText(/^0x/)
  })

  test('should confirm legacy transaction', async ({ page, metamask, connectToAnvil }) => {
    await connectToAnvil()

    await page.locator('#sendButton').click()

    await metamask.confirmTransaction()
  })

  test('should confirm EIP-1559 transaction', async ({ metamask, connectAndTriggerEIP1559Transaction }) => {
    await connectAndTriggerEIP1559Transaction()

    await metamask.confirmTransaction()
  })

  describe('NFTs', () => {
    test('should confirm `watch NFT` request', async ({ page, metamask, connectDeployAndMintNft }) => {
      await connectDeployAndMintNft()

      await page.locator('#watchNFTButton').click()

      await metamask.confirmTransaction()
    })

    test('should confirm `watch all NFTs` request', async ({ page, metamask, connectDeployAndMintNft }) => {
      await connectDeployAndMintNft()

      await page.locator('#watchNFTsButton').click()

      await metamask.confirmTransaction()
    })

    test('should confirm `approve` transaction', async ({ page, metamask, connectDeployAndMintNft }) => {
      await connectDeployAndMintNft()

      await page.locator('#approveButton').click()

      await metamask.confirmTransaction()

      await expect(page.locator('#nftsStatus')).toHaveText('Approve completed')
    })

    test('should confirm `set approval for all` transaction', async ({ page, metamask, connectDeployAndMintNft }) => {
      await connectDeployAndMintNft()

      await page.locator('#setApprovalForAllButton').click()

      await metamask.confirmTransaction()

      await expect(page.locator('#nftsStatus')).toHaveText('Set Approval For All completed')
    })

    test('should confirm `revoke` transaction', async ({ page, metamask, connectDeployAndMintNft }) => {
      await connectDeployAndMintNft()

      await page.locator('#revokeButton').click()

      await metamask.confirmTransaction()

      await expect(page.locator('#nftsStatus')).toHaveText('Revoke completed')
    })

    test('should confirm `transfer from` transaction', async ({ page, metamask, connectDeployAndMintNft }) => {
      await connectDeployAndMintNft()

      await page.locator('#transferFromButton').click()

      await metamask.confirmTransaction()

      await expect(page.locator('#nftsStatus')).toHaveText('Transfer From completed')
    })
  })
})

describe('with custom gas setting', () => {
  test('should throw due to no estimation for "low" gas setting', async ({
    metamask,
    connectAndTriggerEIP1559Transaction
  }) => {
    await connectAndTriggerEIP1559Transaction()

    await expect(metamask.confirmTransaction({ gasSetting: 'low' })).rejects.toThrowError(
      '[ConfirmTransaction] Estimated fee is not available for the "low" gas setting. By default, MetaMask would use the "site" gas setting in this case, however, this is not YOUR intention.'
    )
  })

  test('should throw due to no estimation for "market" gas setting', async ({
    metamask,
    connectAndTriggerEIP1559Transaction
  }) => {
    await connectAndTriggerEIP1559Transaction()

    await expect(metamask.confirmTransaction({ gasSetting: 'market' })).rejects.toThrowError(
      '[ConfirmTransaction] Estimated fee is not available for the "market" gas setting. By default, MetaMask would use the "site" gas setting in this case, however, this is not YOUR intention.'
    )
  })

  test('should throw due to no estimation for "aggressive" gas setting', async ({
    metamask,
    connectAndTriggerEIP1559Transaction
  }) => {
    await connectAndTriggerEIP1559Transaction()

    await expect(metamask.confirmTransaction({ gasSetting: 'aggressive' })).rejects.toThrowError(
      '[ConfirmTransaction] Estimated fee is not available for the "aggressive" gas setting. By default, MetaMask would use the "site" gas setting in this case, however, this is not YOUR intention.'
    )
  })

  test('should confirm transaction with "site" gas setting', async ({
    metamask,
    connectAndTriggerEIP1559Transaction
  }) => {
    await connectAndTriggerEIP1559Transaction()

    await metamask.confirmTransaction({ gasSetting: 'site' })
  })

  describe('with advanced (manual) gas setting', () => {
    test('should throw if `maxBaseFee` is smaller than `priorityFee`', async ({
      metamask,
      connectAndTriggerEIP1559Transaction
    }) => {
      await connectAndTriggerEIP1559Transaction()

      const promise = metamask.confirmTransaction({
        gasSetting: {
          maxBaseFee: 250,
          priorityFee: 300
        }
      })

      await expect(promise).rejects.toThrowError(
        new ZodError([
          {
            code: 'custom',
            message: 'Max base fee cannot be lower than priority fee',
            path: ['MetaMask', 'confirmTransaction', 'gasSetting', 'maxBaseFee']
          }
        ])
      )
    })

    test('should throw if `gasLimit` is too low', async ({ metamask, connectAndTriggerEIP1559Transaction }) => {
      await connectAndTriggerEIP1559Transaction()

      const promise = metamask.confirmTransaction({
        gasSetting: {
          maxBaseFee: 250,
          priorityFee: 150,
          gasLimit: 10
        }
      })

      await expect(promise).rejects.toThrowError(
        '[ConfirmTransaction] Invalid gas limit: Gas limit must be greater than 20999 and less than 7920027'
      )
    })

    test('should confirm transaction with custom gas limit', async ({
      metamask,
      connectAndTriggerEIP1559Transaction
    }) => {
      await connectAndTriggerEIP1559Transaction()

      await metamask.confirmTransaction({
        gasSetting: {
          maxBaseFee: 250,
          priorityFee: 150,
          gasLimit: 250_000
        }
      })
    })

    test('should confirm transaction with small gas fee', async ({ metamask, connectAndTriggerEIP1559Transaction }) => {
      await connectAndTriggerEIP1559Transaction()

      await metamask.confirmTransaction({
        gasSetting: {
          maxBaseFee: 250,
          priorityFee: 150
        }
      })
    })

    // We're testing huge gas fee here, due to a bug in MetaMask. See comment inside the `confirmTransaction` method.
    test('should confirm transaction with huge gas fee', async ({ metamask, connectAndTriggerEIP1559Transaction }) => {
      await connectAndTriggerEIP1559Transaction()

      await metamask.confirmTransaction({
        gasSetting: {
          maxBaseFee: 250_000,
          priorityFee: 150_000
        }
      })
    })

    test('should confirm `set approval for all` transaction', async ({ page, metamask, connectDeployAndMintNft }) => {
      await connectDeployAndMintNft()

      await page.locator('#setApprovalForAllButton').click()

      await metamask.confirmTransaction({
        gasSetting: {
          maxBaseFee: 250,
          priorityFee: 150
        }
      })

      await expect(page.locator('#nftsStatus')).toHaveText('Set Approval For All completed')
    })
  })
})

describe('with `from` and `to` specified', () => {
  test('should confirm from/to transfer', async ({ page, metamask, deployToken }) => {
    await deployToken()

    const accountAddress = await metamask.getAccountAddress()
    await page.locator('#transferFromSenderInput').fill(accountAddress)
    await page.locator('#transferFromRecipientInput').fill('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')

    await page.locator('#transferFromTokens').click()
    await metamask.confirmTransaction()
  })
})

describe('without gas limit', () => {
  test('should approve tokens', async ({ page, metamask, deployToken }) => {
    await deployToken()

    await page.locator('#approveTokensWithoutGas').click()
    await metamask.approveTokenPermission()
  })

  test('should transfer tokens', async ({ page, metamask, deployToken }) => {
    await deployToken()

    await page.locator('#transferTokensWithoutGas').click()
    await metamask.confirmTransaction()
  })
})

describe('using custom transaction form', () => {
  test('should send defined amount', async ({ page, metamask, connectToAnvil }) => {
    await connectToAnvil()

    await page.locator('#toInput').fill('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    await page.locator('#amountInput').fill('3')
    await page.locator('#gasInput').fill('1000000000')

    await page.locator('#submitForm').click()
    await metamask.confirmTransaction()
  })
})
