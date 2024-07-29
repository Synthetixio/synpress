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
      providePublicEncryptionKey(): Chainable<void>
      decrypt(): Chainable<void>
      confirmSignature(): Chainable<void>
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

  Cypress.Commands.add('addNewAccount', (accountName: string) => {
    return cy.task('addNewAccount', accountName)
  })
  Cypress.Commands.add('switchAccount', (accountName: string) => {
    return cy.task('switchAccount', accountName)
  })
  Cypress.Commands.add('renameAccount', (currentAccountName: string, newAccountName: string) => {
    return cy.task('renameAccount', { currentAccountName, newAccountName })
  })

  Cypress.Commands.add('switchNetwork', (networkName: string, isTestnet = false) => {
    return cy.task('switchNetwork', { networkName, isTestnet })
  })
  Cypress.Commands.add('providePublicEncryptionKey', () => {
    return cy.task('providePublicEncryptionKey')
  })
  Cypress.Commands.add('decrypt', () => {
    return cy.task('decrypt')
  })
  Cypress.Commands.add('confirmSignature', () => {
    return cy.task('confirmSignature')
  })
}
