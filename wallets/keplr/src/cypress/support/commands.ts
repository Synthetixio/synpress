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

import synpress from '../../../test/synpress'
;('../../../test/synpress')

const test = synpress

declare global {
  namespace Cypress {
    interface Chainable {
      setupWallet({
        secretWordsOnPrivateKeys,
        password
      }: { secretWordsOnPrivateKeys: string; password: string }): Chainable<void>
      setupPlaywrightContext(): Chainable<void>
    }
  }
}

Cypress.Commands.add('setupWallet', ({ secretWordsOnPrivateKeys, password }) => {
  cy.task('setupWallet', { secretWordsOnPrivateKeys, password })
})

Cypress.Commands.add('setupPlaywrightContext', () => {
  cy.task('setupPlaywrightContext')
})

before(() => {
  cy.setupPlaywrightContext()
})
