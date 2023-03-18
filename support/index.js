import './commands';
import { configure } from '@testing-library/cypress';
import { ENV_VARS } from '../utils/env';

configure({ testIdAttribute: 'data-testid' });

// dont fail tests on uncaught exceptions of websites
Cypress.on('uncaught:exception', () => {
  if (!ENV_VARS.FAIL_ON_ERROR) return false;
});

Cypress.on('window:before:load', win => {
  cy.stub(win.console, 'error').callsFake(message => {
    cy.now('task', 'error', message);
    // fail test on browser console error
    if (ENV_VARS.FAIL_ON_ERROR) throw new Error(message);
  });

  cy.stub(win.console, 'warn').callsFake(message => {
    cy.now('task', 'warn', message);
  });
});

before(async () => {
  if (
    !Cypress.env('SKIP_METAMASK_SETUP') ||
    !Cypress.env('E2E_SKIP_METAMASK_SETUP')
  ) {
    await cy.setupMetamask();
  }
});
