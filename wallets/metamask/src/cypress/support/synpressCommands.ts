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

import type { CreateAnvilOptions, Anvil } from '@viem/anvil'
import type { Network } from '../../type/Network'

declare global {
  namespace Cypress {
    interface Chainable {
      getAccount(): Chainable<string>
      getNetwork(): Chainable<string>

      connectToDapp(accounts?: string[]): Chainable<void>

      addNewAccount(accountName: string): Chainable<void>
      switchAccount(accountName: string): Chainable<void>
      renameAccount(currentAccountName: string, newAccountName: string): Chainable<void>

      switchNetwork(networkName: string, isTestnet?: boolean): Chainable<void>
      createAnvilNode(options?: CreateAnvilOptions): Chainable<{
        anvil: Anvil
        rpcUrl: string
        chainId: number
      }>
      connectToAnvil(): Chainable<void>
      addNetwork(network: Network): Chainable<void>

      deployToken(): Chainable<void>
      addNewToken(): Chainable<void>

      providePublicEncryptionKey(): Chainable<void>
      decrypt(): Chainable<void>
      confirmSignature(): Chainable<void>
      confirmTransaction(): Chainable<void>
    }
  }
}

export default function synpressCommands() {
  Cypress.Commands.add('getAccount', () => {
    return cy.task('getAccount')
  })
  Cypress.Commands.add('getNetwork', () => {
    return cy.task('getNetwork')
  })

  Cypress.Commands.add('connectToDapp', () => {
    return cy.task('connectToDapp')
  })

  // Account

  Cypress.Commands.add('addNewAccount', (accountName: string) => {
    return cy.task('addNewAccount', accountName)
  })
  Cypress.Commands.add('switchAccount', (accountName: string) => {
    return cy.task('switchAccount', accountName)
  })
  Cypress.Commands.add('renameAccount', (currentAccountName: string, newAccountName: string) => {
    return cy.task('renameAccount', { currentAccountName, newAccountName })
  })

  // Network

  Cypress.Commands.add('switchNetwork', (networkName: string, isTestnet = false) => {
    return cy.task('switchNetwork', { networkName, isTestnet })
  })
  Cypress.Commands.add('createAnvilNode', (options?: CreateAnvilOptions) => {
    return cy.task('createAnvilNode', options)
  })
  Cypress.Commands.add('connectToAnvil', () => {
    return cy.task('createAnvilNode').then((anvilNetwork) => {
      const network = {
        name: 'Anvil',
        rpcUrl: anvilNetwork.rpcUrl,
        chainId: anvilNetwork.chainId,
        symbol: 'ETH',
        blockExplorerUrl: 'https://etherscan.io/'
      }

      return cy.task('addNetwork', network)
    })
  })
  Cypress.Commands.add('addNetwork', (network: Network) => {
    return cy.task('addNetwork', network)
  })

  // Token

  Cypress.Commands.add('deployToken', () => {
    return cy.task('deployToken')
  })
  Cypress.Commands.add('addNewToken', () => {
    return cy.task('addNewToken')
  })

  // Others

  Cypress.Commands.add('providePublicEncryptionKey', () => {
    return cy.task('providePublicEncryptionKey')
  })
  Cypress.Commands.add('decrypt', () => {
    return cy.task('decrypt')
  })
  Cypress.Commands.add('confirmSignature', () => {
    return cy.task('confirmSignature')
  })
  Cypress.Commands.add('confirmTransaction', () => {
    return cy.task('confirmTransaction')
  })
}
