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
  if (!Cypress.env('SKIP_METAMASK_INSTALL')) {
    if (!Cypress.env('SKIP_METAMASK_SETUP')) {
      // todo: make sure metamask window is open (inside setup and reset)
      if (Cypress.config('isInteractive')) {
        cy.resetMetamask({ setupExtensionAfterReset: true });
      } else {
        cy.setupMetamask();
      }
    } else {
      cy.resetMetamask();
    }
  }
});

// todo: na czym skonczylem?
// tutaj w before cos jest zjebane chyba
// motalem cos z synpress run/open w package.json
// aaa dodatkowo byl jakis problem, ze nie otwieral sie metamask domyslnie w synpress open
// moze trzeba to sprawdzac i otwierac go samemu w takiej sytuacji
// nie wiem czy domyslny reset to dobra opcja
// jest jeszcze before run is before spec obczaj to dla synpress open
