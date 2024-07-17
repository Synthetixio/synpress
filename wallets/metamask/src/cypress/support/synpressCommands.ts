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

// TODO: To be implemented
// declare global {
//   namespace Cypress {
//     interface Chainable {
//     }
//   }
// }

// import { connectToDapp } from '../../playwright/pages/NotificationPage/actions'

// import { MetaMask } from '../../playwright/MetaMask'
// import type { BrowserContext, Page } from '@playwright/test'

declare global {
  namespace Cypress {
    interface Chainable {
      connectToDapp(): Chainable<void>
    }
  }
}

export default function synpressCommands() {
  Cypress.Commands.add('connectToDapp', () => {
    return cy.task('connectToDapp')
  })
}
