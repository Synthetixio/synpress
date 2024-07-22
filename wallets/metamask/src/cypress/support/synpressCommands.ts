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
      connectToDapp(): Chainable<void>
      addNewAccount(accountName: string): Chainable<void>
      getAccount(): Chainable<string>
    }
  }
}

export default function synpressCommands() {
  Cypress.Commands.add('connectToDapp', () => {
    return cy.task('connectToDapp')
  })
  Cypress.Commands.add('addNewAccount', (accountName: string) => {
    return cy.task('addNewAccount', accountName)
  })
  Cypress.Commands.add('getAccount', () => {
    return cy.task('getAccount')
  })
}
