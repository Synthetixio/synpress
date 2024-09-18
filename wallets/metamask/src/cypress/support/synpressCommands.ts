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

import type { Anvil, CreateAnvilOptions } from '@viem/anvil'
import type { GasSettings } from '../../type/GasSettings'
import type { Network } from '../../type/Network'

declare global {
  namespace Cypress {
    interface Chainable {
      importWallet(seedPhrase: string): Chainable<void>
      importWalletFromPrivateKey(privateKey: string): Chainable<void>

      getAccount(): Chainable<string>
      getNetwork(): Chainable<string>

      connectToDapp(accounts?: string[]): Chainable<void>

      addNewAccount(accountName: string): Chainable<void>
      switchAccount(accountName: string): Chainable<void>
      renameAccount(currentAccountName: string, newAccountName: string): Chainable<void>
      getAccountAddress(): Chainable<string>

      switchNetwork(networkName: string, isTestnet?: boolean): Chainable<void>
      createAnvilNode(options?: CreateAnvilOptions): Chainable<{
        anvil: Anvil
        rpcUrl: string
        chainId: number
      }>
      connectToAnvil(): Chainable<void>
      emptyAnvilNode(): Chainable<void>
      addNetwork(network: Network): Chainable<void>
      approveNewNetwork(): Chainable<void>
      approveSwitchNetwork(): Chainable<void>
      rejectNewNetwork(): Chainable<void>
      rejectSwitchNetwork(): Chainable<void>

      deployToken(): Chainable<void>
      addNewToken(): Chainable<void>
      approveTokenPermission(options?: {
        spendLimit?: number | 'max'
        gasSetting?: GasSettings
      }): Chainable<void>
      rejectTokenPermission(): Chainable<void>

      providePublicEncryptionKey(): Chainable<void>
      decrypt(): Chainable<void>
      confirmSignature(): Chainable<void>
      rejectSignature(): Chainable<void>
      confirmTransaction(options?: { gasSetting?: GasSettings }): Chainable<void>
      rejectTransaction(): Chainable<void>
      confirmTransactionAndWaitForMining(): Chainable<void>
      openTransactionDetails(txIndex: number): Chainable<void>
      closeTransactionDetails(): Chainable<void>

      lock(): Chainable<void>
      unlock(): Chainable<void>

      goBackToHomePage(): Chainable<void>
    }
  }
}

export default function synpressCommands() {
  // Wallet

  Cypress.Commands.add('importWallet', (seedPhrase: string) => {
    return cy.task('importWallet', seedPhrase)
  })

  Cypress.Commands.add('importWalletFromPrivateKey', (privateKey: string) => {
    return cy.task('importWalletFromPrivateKey', privateKey)
  })

  Cypress.Commands.add('connectToDapp', () => {
    return cy.task('connectToDapp')
  })

  // Account

  Cypress.Commands.add('getAccount', () => {
    return cy.task('getAccount')
  })
  Cypress.Commands.add('addNewAccount', (accountName: string) => {
    return cy.task('addNewAccount', accountName)
  })
  Cypress.Commands.add('switchAccount', (accountName: string) => {
    return cy.task('switchAccount', accountName)
  })
  Cypress.Commands.add('renameAccount', (currentAccountName: string, newAccountName: string) => {
    return cy.task('renameAccount', { currentAccountName, newAccountName })
  })
  Cypress.Commands.add('getAccountAddress', () => {
    return cy.task('getAccountAddress')
  })

  // Network

  Cypress.Commands.add('getNetwork', () => {
    return cy.task('getNetwork')
  })
  Cypress.Commands.add('switchNetwork', (networkName: string, isTestnet = false) => {
    return cy.task('switchNetwork', { networkName, isTestnet })
  })
  Cypress.Commands.add('createAnvilNode', (options?: CreateAnvilOptions) => {
    return cy.task('createAnvilNode', options)
  })
  Cypress.Commands.add('connectToAnvil', () => {
    return cy.task('createAnvilNode').then((anvilNetwork) => {
      const anvilNetworkDetails = anvilNetwork as {
        anvil: Anvil
        rpcUrl: string
        chainId: number
      }

      const network = {
        name: 'Anvil',
        rpcUrl: anvilNetworkDetails.rpcUrl,
        chainId: anvilNetworkDetails.chainId,
        symbol: 'ETH',
        blockExplorerUrl: 'https://etherscan.io/'
      }

      return cy.task('addNetwork', network)
    })
  })
  Cypress.Commands.add('emptyAnvilNode', () => {
    return cy.task('emptyAnvilNode')
  })
  Cypress.Commands.add('addNetwork', (network: Network) => {
    return cy.task('addNetwork', network)
  })
  Cypress.Commands.add('approveNewNetwork', () => {
    return cy.task('approveNewNetwork')
  })
  Cypress.Commands.add('approveSwitchNetwork', () => {
    return cy.task('approveSwitchNetwork')
  })
  Cypress.Commands.add('rejectNewNetwork', () => {
    return cy.task('rejectNewNetwork')
  })
  Cypress.Commands.add('rejectSwitchNetwork', () => {
    return cy.task('rejectSwitchNetwork')
  })

  // Token

  Cypress.Commands.add('deployToken', () => {
    return cy.task('deployToken')
  })
  Cypress.Commands.add('addNewToken', () => {
    return cy.task('addNewToken')
  })
  Cypress.Commands.add(
    'approveTokenPermission',
    (options?: {
      spendLimit?: number | 'max'
      gasSetting?: GasSettings
    }) => {
      return cy.task('approveTokenPermission', options)
    }
  )
  Cypress.Commands.add('rejectTokenPermission', () => {
    return cy.task('rejectTokenPermission')
  })

  // Lock/Unlock

  Cypress.Commands.add('lock', () => {
    return cy.task('lock')
  })
  Cypress.Commands.add('unlock', () => {
    return cy.task('unlock')
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
  Cypress.Commands.add('rejectSignature', () => {
    return cy.task('rejectSignature')
  })
  Cypress.Commands.add('confirmTransaction', (options?: { gasSetting?: GasSettings }) => {
    return cy.task('confirmTransaction', options)
  })
  Cypress.Commands.add('rejectTransaction', () => {
    return cy.task('rejectTransaction')
  })
  Cypress.Commands.add('confirmTransactionAndWaitForMining', () => {
    return cy.task('confirmTransactionAndWaitForMining')
  })
  Cypress.Commands.add('openTransactionDetails', (txIndex = 0) => {
    return cy.task('openTransactionDetails', txIndex)
  })
  Cypress.Commands.add('closeTransactionDetails', () => {
    return cy.task('closeTransactionDetails')
  })
  Cypress.Commands.add('goBackToHomePage', () => {
    return cy.task('goBackToHomePage')
  })
}
