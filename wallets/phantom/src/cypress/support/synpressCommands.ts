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

import type { GasSettings } from '../../type/GasSettings'

declare global {
  namespace Cypress {
    interface Chainable {
      importWallet(seedPhrase: string): Chainable<void>
      importWalletFromPrivateKey(privateKey: string): Chainable<void>

      getAccount(): Chainable<string>

      connectToDapp(accounts?: string[]): Chainable<void>

      addNewAccount(accountName: string): Chainable<void>
      switchAccount(accountName: string): Chainable<void>
      renameAccount(currentAccountName: string, newAccountName: string): Chainable<void>
      getAccountAddress(): Chainable<string>
      resetApp(): Chainable<void>

      approveTokenPermission(options?: {
        spendLimit?: number | 'max'
        gasSetting?: GasSettings
      }): Chainable<void>
      rejectTokenPermission(): Chainable<void>

      confirmSignature(): Chainable<void>
      rejectSignature(): Chainable<void>
      confirmTransaction(options?: {
        gasSetting?: GasSettings
      }): Chainable<void>
      rejectTransaction(): Chainable<void>

      lock(): Chainable<void>
      unlock(): Chainable<void>

      toggleTestnetMode(): Chainable<void>

      goToHomePage(): Chainable<void>
      goBackToHomePage(): Chainable<void>
      openSettings(): Chainable<void>
    }
  }
}

/**
 * Synpress Commands for Phantom
 *
 * This module extends Cypress with custom commands for interacting with Phantom and Ethereum networks.
 * It provides a wide range of functionalities including wallet management, account operations,
 * network interactions, token handling, transaction management, and Phantom UI interactions.
 *
 * @module SynpressCommandsForPhantom
 *
 * Key features:
 * - Wallet: Import wallet, connect to dApps
 * - Account: Add, switch, rename, reset accounts
 * - Network: Switch networks
 * - Tokens: Deploy tokens, add new tokens, approve token permissions
 * - Transactions: Confirm, reject, and view transaction details
 * - Phantom UI: Lock/unlock, toggle settings, navigate UI
 *
 * These commands enhance the testing capabilities for Ethereum-based applications,
 * allowing for comprehensive end-to-end testing of dApps integrated with Phantom.
 */

/**
 * Initializes Synpress commands for Phantom
 */
export default function synpressCommandsForPhantom(): void {
  // Wallet

  /**
   * Imports a wallet using a seed phrase
   * @param seedPhrase - The seed phrase to import
   */
  Cypress.Commands.add('importWallet', (seedPhrase: string) => {
    return cy.task('importWallet', seedPhrase)
  })

  /**
   * Imports a wallet using a private key
   * @param privateKey - The private key to import
   */
  Cypress.Commands.add('importWalletFromPrivateKey', (privateKey: string) => {
    return cy.task('importWalletFromPrivateKey', privateKey)
  })

  /**
   * Connects to a dApp
   */
  Cypress.Commands.add('connectToDapp', () => {
    return cy.task('connectToDapp')
  })

  // Account

  /**
   * Gets the current account
   */
  Cypress.Commands.add('getAccount', () => {
    return cy.task('getAccount')
  })

  /**
   * Adds a new account
   * @param accountName - The name of the new account
   */
  Cypress.Commands.add('addNewAccount', (accountName: string) => {
    return cy.task('addNewAccount', accountName)
  })

  /**
   * Switches to a different account
   * @param accountName - The name of the account to switch to
   */
  Cypress.Commands.add('switchAccount', (accountName: string) => {
    return cy.task('switchAccount', accountName)
  })

  /**
   * Renames an account
   * @param currentAccountName - The current name of the account
   * @param newAccountName - The new name for the account
   */
  Cypress.Commands.add('renameAccount', (currentAccountName: string, newAccountName: string) => {
    return cy.task('renameAccount', { currentAccountName, newAccountName })
  })

  /**
   * Gets the address of the current account
   * @returns The account address
   */
  Cypress.Commands.add('getAccountAddress', () => {
    return cy.task('getAccountAddress')
  })

  /**
   * Resets the current account
   */
  Cypress.Commands.add('resetApp', () => {
    return cy.task('resetApp')
  })

  // Token

  /**
   * Approves token permission
   * @param options - Options for approving token permission
   * @param options.spendLimit - The spend limit for the token
   * @param options.gasSetting - Gas settings for the transaction
   */
  Cypress.Commands.add(
    'approveTokenPermission',
    (options?: { spendLimit?: number | 'max'; gasSetting?: GasSettings }) => {
      return cy.task('approveTokenPermission', options)
    }
  )

  /**
   * Rejects token permission
   */
  Cypress.Commands.add('rejectTokenPermission', () => {
    return cy.task('rejectTokenPermission')
  })

  // Lock/Unlock

  /**
   * Locks Phantom
   */
  Cypress.Commands.add('lock', () => {
    return cy.task('lock')
  })

  /**
   * Unlocks Phantom
   */
  Cypress.Commands.add('unlock', () => {
    return cy.task('unlock')
  })

  // Toggles

  /**
   * Toggles showing test networks
   */
  Cypress.Commands.add('toggleTestnetMode', () => {
    return cy.task('toggleTestnetMode')
  })

  // Others

  /**
   * Confirms a signature
   */
  Cypress.Commands.add('confirmSignature', () => {
    return cy.task('confirmSignature')
  })

  /**
   * Rejects a signature
   */
  Cypress.Commands.add('rejectSignature', () => {
    return cy.task('rejectSignature')
  })

  /**
   * Confirms a transaction
   * @param options - Options for confirming the transaction
   * @param options.gasSetting - Gas settings for the transaction
   */
  Cypress.Commands.add('confirmTransaction', (options?: { gasSetting?: GasSettings }) => {
    return cy.task('confirmTransaction', options)
  })

  /**
   * Rejects a transaction
   */
  Cypress.Commands.add('rejectTransaction', () => {
    return cy.task('rejectTransaction')
  })

  /**
   * Navigates to the Phantom extension home page
   */
  Cypress.Commands.add('goToHomePage', () => {
    return cy.task('goToHomePage')
  })

  /**
   * Goes back to the home page
   */
  Cypress.Commands.add('goBackToHomePage', () => {
    return cy.task('goBackToHomePage')
  })

  /**
   * Opens settings
   */
  Cypress.Commands.add('openSettings', () => {
    return cy.task('openSettings')
  })
}
