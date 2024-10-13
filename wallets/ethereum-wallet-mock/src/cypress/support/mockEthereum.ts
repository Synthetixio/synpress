/**
 * Mock Ethereum Environment for Cypress Tests
 *
 * This module provides a function to set up a mocked Ethereum environment
 * for Cypress tests. It utilizes the Web3Mock library to simulate Ethereum
 * blockchain interactions and MetaMask wallet behavior.
 *
 * @remarks
 * Key features:
 * - Mocks the Ethereum blockchain environment
 * - Simulates MetaMask wallet functionality
 * - Automatically applied before each test suite
 *
 * This function is typically called in the Cypress support file or test
 * setup to ensure all tests run in a controlled, mocked Ethereum environment.
 * It allows for consistent and predictable testing of Ethereum-based
 * applications without the need for a real blockchain or wallet.
 *
 * @example
 * ```typescript
 * // In your Cypress support file
 * import { mockEthereum } from '@synthetixio/synpress';
 *
 * mockEthereum();
 * ```
 */

export default function mockEthereum(): void {
  before(() => {
    cy.visit('/', {
      onBeforeLoad: (window) => {
        window.Web3Mock.mock({
          blockchain: 'ethereum',
          wallet: 'metamask'
        })
      }
    })
  })
}
