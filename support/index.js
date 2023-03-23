import './commands';
import { configure } from '@testing-library/cypress';
const providersHelper = require('../providers');

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
  if (!Cypress.env('SKIP_SETUP')) {
    const providers = providersHelper.getProviders(Cypress.env('PROVIDERS'));
    for (const provider of providers) {
      cy.setup({ provider: provider.name });
    }
  }
});
