import '@testing-library/cypress/add-commands';
import 'cypress-wait-until';

Cypress.Commands.add(
  'setupMetamask',
  (
    secretWordsOrPrivateKey = 'test test test test test test test test test test test junk',
    network = 'goerli',
    password = 'Tester@1234',
    enableAdvancedSettings = false,
    enableExperimentalSettings = false,
  ) => {
    return cy.task('setupMetamask', {
      secretWordsOrPrivateKey,
      network,
      password,
      enableAdvancedSettings,
      enableExperimentalSettings,
    });
  },
);