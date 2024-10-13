/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import type { Network } from '../../type/Network'
import type { WalletMock } from '../../type/WalletMock'
import getEthereumWalletMock from '../utils/getEthereumWalletMock'

declare global {
  namespace Cypress {
    interface Chainable {
      importWallet(seedPhrase: string): Chainable<void>
      importWalletFromPrivateKey(privateKey: `0x${string}`): Chainable<void>
      addNewAccount(): Chainable<void>
      getAllAccounts(): Chainable<Array<`0x${string}`>>
      getAccountAddress(): Chainable<`0x${string}`>
      switchAccount(accountAddress: string): Chainable<void>
      addNetwork(network: Network): Chainable<void>
      switchNetwork(networkName: string): Chainable<void>
      connectToDapp(wallet?: WalletMock): Chainable<void>
    }

    interface ApplicationWindow {
      Web3Mock: {
        mock: (options: {
          blockchain: string
          wallet: string
          accounts?: { return: Array<string> }
          network?: {
            add: {
              chainId: number
              chainName: string
              nativeCurrency:
                | {
                    name: string
                    symbol: string
                    decimals: number
                  }
                | undefined
              rpcUrls: Array<string>
            }
          }
        }) => void
      }
    }
  }
}

/**
 * Synpress Commands for Ethereum Wallet Mock
 *
 * This module extends Cypress with custom commands for interacting with a mocked Ethereum wallet.
 * It provides functionalities for wallet management, account operations, and network interactions.
 *
 * Key features include:
 * - Wallet: Import wallet from seed phrase or private key
 * - Account: Add new accounts, get all accounts, switch between accounts
 * - Network: Add new networks, switch between networks
 * - dApp Interaction: Connect to dApps
 *
 * These commands enhance the testing capabilities for Ethereum-based applications,
 * allowing for comprehensive end-to-end testing of dApps using a mocked Ethereum wallet.
 * This approach provides a controlled environment for testing without the need for a real wallet,
 * making tests more reliable and easier to set up.
 *
 * @module SynpressCommandsForEthereumWalletMock
 */

/**
 * Initializes Synpress commands for the Ethereum Wallet Mock.
 *
 * This function adds custom Cypress commands for interacting with a mocked Ethereum wallet.
 * These commands include wallet import, account management, network operations, and dApp connections.
 *
 * @example
 * ```typescript
 * import { synpressCommandsForEthereumWalletMock } from '@synthetixio/synpress';
 *
 * synpressCommandsForEthereumWalletMock();
 * ```
 */
export default function synpressCommandsForEthereumWalletMock(): void {
  /**
   * Imports a wallet using a seed phrase.
   * @param seedPhrase - The seed phrase to import the wallet.
   */
  Cypress.Commands.add('importWallet', (seedPhrase: string) => {
    const ethereumWalletMock = getEthereumWalletMock()
    ethereumWalletMock.importWallet(seedPhrase)
  })

  /**
   * Imports a wallet using a private key.
   * @param privateKey - The private key to import the wallet.
   */
  Cypress.Commands.add('importWalletFromPrivateKey', (privateKey: `0x${string}`) => {
    const ethereumWalletMock = getEthereumWalletMock()
    ethereumWalletMock.importWalletFromPrivateKey(privateKey)
  })

  /**
   * Adds a new account to the wallet.
   * @returns A promise that resolves when the account is added.
   */
  Cypress.Commands.add('addNewAccount', () => {
    const ethereumWalletMock = getEthereumWalletMock()
    return ethereumWalletMock.addNewAccount()
  })

  /**
   * Retrieves all accounts in the wallet.
   * @returns A promise that resolves with an array of account addresses.
   */
  Cypress.Commands.add('getAllAccounts', () => {
    const ethereumWalletMock = getEthereumWalletMock()
    return ethereumWalletMock.getAllAccounts()
  })

  /**
   * Gets the current account address.
   * @returns A promise that resolves with the current account address.
   */
  Cypress.Commands.add('getAccountAddress', () => {
    const ethereumWalletMock = getEthereumWalletMock()
    return ethereumWalletMock.getAccountAddress()
  })

  /**
   * Switches to a different account.
   * @param accountAddress - The address of the account to switch to.
   */
  Cypress.Commands.add('switchAccount', (accountAddress: string) => {
    const ethereumWalletMock = getEthereumWalletMock()
    ethereumWalletMock.switchAccount(accountAddress)
  })

  /**
   * Adds a new network to the wallet.
   * @param network - The network configuration to add.
   */
  Cypress.Commands.add('addNetwork', (network: Network) => {
    const ethereumWalletMock = getEthereumWalletMock()
    ethereumWalletMock.addNetwork(network)
  })

  /**
   * Switches to a different network.
   * @param networkName - The name of the network to switch to.
   */
  Cypress.Commands.add('switchNetwork', (networkName: string) => {
    const ethereumWalletMock = getEthereumWalletMock()
    ethereumWalletMock.switchNetwork(networkName)
  })

  /**
   * Connects the wallet to a dApp.
   * @param wallet - Optional wallet configuration to use for the connection.
   */
  Cypress.Commands.add('connectToDapp', (wallet?: WalletMock) => {
    const ethereumWalletMock = getEthereumWalletMock()
    ethereumWalletMock.connectToDapp(wallet)
  })
}
