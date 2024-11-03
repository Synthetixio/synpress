import type { Page } from '@playwright/test'

/**
 * Mocks an Ethereum transaction using Web3Mock
 * @param page - Playwright page instance
 * @param params - Array of transaction parameters [to, from, value]
 * @returns Promise that resolves to the Web3Mock mock result
 */
export const mockTransaction = async (page: Page, params: [string, string, string]) => {
  return page.evaluate(
    ([params]) => {
      return Web3Mock.mock({
        blockchain: 'ethereum',
        transaction: {
          to: params?.[0],
          from: params?.[1],
          value: params?.[2]
        }
      })
    },
    [params]
  )
}
