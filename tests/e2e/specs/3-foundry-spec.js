/* eslint-disable ui-testing/missing-assertion-in-test */
describe('Foundry', () => {
  context('Anvil commands', () => {
    before(() => {
      cy.setupMetamask();
    });

    it(`forkChains should setup a pool with fork of optimism chain with specified block number (108516344)`, () => {
      cy.forkChains({
        chainsToFork: {
          optimism: {
            forkUrl: 'https://rpc.ankr.com/optimism',
            forkBlockNumber: 108516344,
            host: '0.0.0.0',
            nativeCurrency: {
              decimals: 18,
              name: 'Optimism Ether',
              symbol: 'oETH',
            },
          },
        },
      }).then(data => {
        const chains = Object.keys(data.chains);
        for (const chain of chains) {
          const chainData = data.chains[chain];
          const { anvilChainType } = chainData.anvilClientDetails;
          const networkName = `${anvilChainType.name}-108516344`;
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

      // anvil will be killed automatically with nodejs process, so it's not mandatory to kill it manually
      cy.stopAnvilPool();
    });

    it(`forkChains should setup a pool of forks with ethereum mainnet (without forkUrl) and optimism mainnet (without forkBlockNumber)`, () => {
      cy.forkChains({
        chainsToFork: {
          mainnet: {
            // if forkUrl is undefined, it will use @viem/chains defaults
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
            forkUrl: 'https://rpc.ankr.com/optimism',
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
        const chains = Object.keys(data.chains);
        for (const chain of chains) {
          const chainData = data.chains[chain];
          const { anvilChainType } = chainData.anvilClientDetails;
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

      // anvil will be killed automatically with nodejs process, so it's not mandatory to kill it manually
      cy.stopAnvilPool();
    });
  });
});
