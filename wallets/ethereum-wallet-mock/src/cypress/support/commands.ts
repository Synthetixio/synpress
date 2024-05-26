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

import type { WalletMock } from '../../EthereumWalletMock'
import type { Network } from '../../network/Network'

declare global {
  namespace Cypress {
    interface Chainable {
      importWallet(seedPhrase: string): Chainable<void>
      importWalletFromPrivateKey(privateKey: `0x${string}`): Chainable<void>
      addNewAccount(): Chainable<void>
      getAllAccounts(): Chainable<Array<`0x${string}`>>
      switchAccount(accountAddress: string): Chainable<void>
      addNetwork(network: Network): Chainable<void>
      getAccountAddress(): Chainable<`0x${string}`>
      switchNetwork(networkName: string): Chainable<void>
      connectToDapp(wallet?: WalletMock): Chainable<void>
    }
  }
}

Cypress.Commands.add('importWallet', (seedPhrase) => cy.task('importWallet', seedPhrase))
Cypress.Commands.add('importWalletFromPrivateKey', (privateKey) => cy.task('importWalletFromPrivateKey', privateKey))
Cypress.Commands.add('addNewAccount', () => cy.task('addNewAccount'))
Cypress.Commands.add('getAllAccounts', () => cy.task('getAllAccounts'))
Cypress.Commands.add('switchAccount', (accountAddress) => cy.task('switchAccount', accountAddress))
Cypress.Commands.add('addNetwork', (network) => cy.task('addNetwork', network))
Cypress.Commands.add('getAccountAddress', () => cy.task('getAccountAddress'))
Cypress.Commands.add('switchNetwork', (networkName) => cy.task('switchNetwork', networkName))
Cypress.Commands.add('connectToDapp', (wallet) => cy.task('connectToDapp', wallet))
