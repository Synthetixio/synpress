import { ZodError } from 'zod'
import { testWithMetaMask } from '../testWithMetaMask'

const test = testWithMetaMask.extend<{
  connectAndTriggerEIP1559Transaction: () => Promise<void>
}>({
  connectAndTriggerEIP1559Transaction: async ({ page, connectToAnvil }, use) => {
    await use(async () => {
      await connectToAnvil()

      await page.locator('#sendEIP1559Button').click()
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
})

describe('with custom gas setting', () => {
  test('should throw due to no estimation for "low" gas setting', async ({
    metamask,
    connectAndTriggerEIP1559Transaction
  }) => {
    await connectAndTriggerEIP1559Transaction()

    await expect(metamask.confirmTransaction('low')).rejects.toThrowError(
      '[ConfirmTransaction] Estimated fee is not available for the "low" gas setting. By default, MetaMask would use the "site" gas setting in this case, however, this is not YOUR intention.'
    )
  })

  test('should throw due to no estimation for "market" gas setting', async ({
    metamask,
    connectAndTriggerEIP1559Transaction
  }) => {
    await connectAndTriggerEIP1559Transaction()

    await expect(metamask.confirmTransaction('market')).rejects.toThrowError(
      '[ConfirmTransaction] Estimated fee is not available for the "market" gas setting. By default, MetaMask would use the "site" gas setting in this case, however, this is not YOUR intention.'
    )
  })

  test('should throw due to no estimation for "aggressive" gas setting', async ({
    metamask,
    connectAndTriggerEIP1559Transaction
  }) => {
    await connectAndTriggerEIP1559Transaction()

    await expect(metamask.confirmTransaction('aggressive')).rejects.toThrowError(
      '[ConfirmTransaction] Estimated fee is not available for the "aggressive" gas setting. By default, MetaMask would use the "site" gas setting in this case, however, this is not YOUR intention.'
    )
  })

  test('should confirm transaction with "site" gas setting', async ({
    metamask,
    connectAndTriggerEIP1559Transaction
  }) => {
    await connectAndTriggerEIP1559Transaction()

    await metamask.confirmTransaction('site')
  })

  describe('with advanced (manual) gas setting', () => {
    test('should throw if `maxBaseFee` is smaller than `priorityFee`', async ({
      metamask,
      connectAndTriggerEIP1559Transaction
    }) => {
      await connectAndTriggerEIP1559Transaction()

      const promise = metamask.confirmTransaction({
        maxBaseFee: 250,
        priorityFee: 300
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
        maxBaseFee: 250,
        priorityFee: 150,
        gasLimit: 10
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
        maxBaseFee: 250,
        priorityFee: 150,
        gasLimit: 250_000
      })
    })

    test('should confirm transaction with small gas fee', async ({ metamask, connectAndTriggerEIP1559Transaction }) => {
      await connectAndTriggerEIP1559Transaction()

      await metamask.confirmTransaction({
        maxBaseFee: 250,
        priorityFee: 150
      })
    })

    // We're testing huge gas fee here, due to a bug in MetaMask. See comment inside the `confirmTransaction` method.
    test('should confirm transaction with huge gas fee', async ({ metamask, connectAndTriggerEIP1559Transaction }) => {
      await connectAndTriggerEIP1559Transaction()

      await metamask.confirmTransaction({
        maxBaseFee: 250_000,
        priorityFee: 150_000
      })
    })
  })
})
