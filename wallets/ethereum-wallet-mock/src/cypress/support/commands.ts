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

// import type { Network } from "../../type/Network";
import getEthereumWalletMock from '../utils/getEthereumWalletMock'
import type { WalletMock } from '../../type/WalletMock'
import type { Network } from '../../type/Network'

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

Cypress.Commands.add('importWallet', (seedPhrase) => {
  const ethereumWalletMock = getEthereumWalletMock()
  ethereumWalletMock.importWallet(seedPhrase)
})

Cypress.Commands.add('importWalletFromPrivateKey', (privateKey) => {
  const ethereumWalletMock = getEthereumWalletMock()
  ethereumWalletMock.importWalletFromPrivateKey(privateKey)
})

Cypress.Commands.add('addNewAccount', () => {
  const ethereumWalletMock = getEthereumWalletMock()
  return ethereumWalletMock.addNewAccount()
})

Cypress.Commands.add('getAllAccounts', () => {
  const ethereumWalletMock = getEthereumWalletMock()

  return ethereumWalletMock.getAllAccounts()
})

Cypress.Commands.add('getAccountAddress', () => {
  const ethereumWalletMock = getEthereumWalletMock()
  return ethereumWalletMock.getAccountAddress()
})

Cypress.Commands.add('switchAccount', (accountAddress) => {
  const ethereumWalletMock = getEthereumWalletMock()
  ethereumWalletMock.switchAccount(accountAddress)
})

Cypress.Commands.add('addNetwork', (network) => {
  const ethereumWalletMock = getEthereumWalletMock()
  ethereumWalletMock.addNetwork(network)
})

Cypress.Commands.add('switchNetwork', (networkName) => {
  const ethereumWalletMock = getEthereumWalletMock()
  ethereumWalletMock.switchNetwork(networkName)
})

Cypress.Commands.add('connectToDapp', (wallet) => {
  const ethereumWalletMock = getEthereumWalletMock()
  ethereumWalletMock.connectToDapp(wallet)
})
