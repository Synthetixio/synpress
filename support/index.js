import './commands';
import { configure } from '@testing-library/cypress';

configure({ testIdAttribute: 'data-testid' });

// dont fail tests on uncaught exceptions of websites
Cypress.on('uncaught:exception', () => {
  if (!Cypress.env('FAIL_ON_ERROR')) {
    return false;
  }
});

Cypress.on('window:before:load', win => {
  cy.stub(win.console, 'error').callsFake(message => {
    cy.now('task', 'error', message);
    // fail test on browser console error
    if (Cypress.env('FAIL_ON_ERROR')) {
      throw new Error(message);
    }
  });

  cy.stub(win.console, 'warn').callsFake(message => {
    cy.now('task', 'warn', message);
  });
});

let anvilPool;

before(() => {
  if (!Cypress.env('SKIP_ANVIL_SETUP')) {
    cy.forkChains({
      chainsToFork: {
        mainnet: {
          forkUrl: undefined,
          forkBlockNumber: undefined,
          host: '0.0.0.0',
          nativeCurrency: {
            decimals: 18,
            name: 'Ether',
            symbol: 'ETH',
          },
        },
        optimism: {
          forkUrl:
            'https://optimism-mainnet.infura.io/v3/f0dd294635f945c88a1a618b5c0fa779',
          forkBlockNumber: undefined,
          host: '0.0.0.0',
          nativeCurrency: {
            decimals: 18,
            name: 'Optimism Ether',
            symbol: 'oETH',
          },
        },
      },
    }).then(data => {
      if (!Cypress.env('SKIP_METAMASK_SETUP')) {
        cy.setupMetamask();
      }

      const chains = Object.keys(data.chains);
      for (const chain of chains) {
        const chainData = data.chains[chain];
        const { anvilChainType } = chainData.anvilClientDetails;
        anvilPool = anvilChainType.anvilPool;
        const networkName = anvilChainType.name;
        const rpcUrl = anvilChainType.rpcUrls.default.http[0];
        const chainId = anvilChainType.id;
        const symbol = anvilChainType.nativeCurrency.symbol;
        cy.addMetamaskNetwork({
          networkName,
          rpcUrl,
          chainId,
          symbol,
          isTestnet: true,
        });
      }
    });
  } else if (!Cypress.env('SKIP_METAMASK_SETUP')) {
    cy.setupMetamask();
  }
});

// after(() => {
//   if (!Cypress.env('SKIP_ANVIL_SETUP')) {
//     cy.stopAnvil(anvilInstance);
//   }
// });
