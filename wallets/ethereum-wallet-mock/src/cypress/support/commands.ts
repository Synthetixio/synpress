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
      importWallet(seedPhrase: string): Chainable<void>
      addNewAccount(): Chainable<void>
      getAllAccounts(): Chainable<void>
    }
  }
}
Cypress.Commands.add('importWallet', (seedPhrase) => cy.task('importWallet', seedPhrase))
Cypress.Commands.add('addNewAccount', () => cy.task('addNewAccount'))
Cypress.Commands.add('getAllAccounts', () => cy.task('getAllAccounts'))
