import './commands';
import { configure } from '@testing-library/cypress';

configure({ testIdAttribute: 'data-testid' });

before(() => {
  cy.setupMetamask();
});
