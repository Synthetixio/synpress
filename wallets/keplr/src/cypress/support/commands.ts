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
      setupWallet(secretWordsOnPrivateKeys: string, password: string): any
    }
  }
}

// @ts-ignore
Cypress.Commands.add('setupWallet', (seedPhrase, password) => cy.task('setupWallet', seedPhrase, password))
