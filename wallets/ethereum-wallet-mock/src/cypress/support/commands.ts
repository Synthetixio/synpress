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
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// import { MetaMask } from "../metamask";
// import { PASSWORD } from "../constants";

declare global {
  namespace Cypress {
    interface Chainable {
      importWallet(seedPhrase: string): Chainable<void>;
      addNewAccount(accountName: string): Chainable<void>;
      importWalletFromPrivateKey(privateKey: string): Chainable<void>;
      openSettings(): Chainable<void>;
    }
  }
}
Cypress.Commands.add("importWallet", (seedPhrase) =>
  cy.task("importWallet", seedPhrase)
);
Cypress.Commands.add("addNewAccount", (accountName) =>
  cy.task("addNewAccount", accountName)
);
Cypress.Commands.add("importWalletFromPrivateKey", (privateKey) =>
  cy.task("importWalletFromPrivateKey", privateKey)
);
Cypress.Commands.add("openSettings", () => cy.task("openSettings"));
