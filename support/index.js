/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable ui-testing/no-hard-wait */
/* eslint-disable testing-library/await-async-utils */
import './commands';
import { configure } from '@testing-library/cypress';

configure({ testIdAttribute: 'data-testid' });

// dont fail tests on uncaught exceptions of websites
Cypress.on('uncaught:exception', () => {
  if (!process.env.FAIL_ON_ERROR) {
    return false;
  }
});

Cypress.on('window:before:load', win => {
  cy.stub(win.console, 'error').callsFake(message => {
    cy.now('task', 'error', message);
    // fail test on browser console error
    if (process.env.FAIL_ON_ERROR) {
      throw new Error(message);
    }
  });

  cy.stub(win.console, 'warn').callsFake(message => {
    cy.now('task', 'warn', message);
  });
});

before(() => {
  if (!Cypress.env('SKIP_BLANK_SETUP')) {
    cy.setupBlank();
  }
});
