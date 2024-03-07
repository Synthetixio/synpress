declare namespace Cypress {
  interface Chainable<Subject> {

    /**
     * Run the flow for metamask setup
     * List of available presets for networks: https://github.com/wagmi-dev/references/tree/main/packages/chains#chains
     * If preset for your custom chain is not available, you can add custom network by yourself.
     * @example
     * cy.setupMetamask() // will use defaults
     * cy.setupMetamask('secret, words, ...', 'optimism', 'password for metamask') // works only if chain is available as preset
     * cy.setupMetamask('secret, words, ...', {name: 'optimism', rpcUrl: 'https://mainnet.optimism.io', chainId: 10, symbol: 'oETH', blockExplorer: 'https://https://optimistic.etherscan.io', isTestnet: false}, 'password for metamask')
     * cy.setupMetamask('private_key', 'goerli', 'password for metamask')
     * cy.setupMetamask('private_key', {name: 'optimism', rpcUrl: 'https://mainnet.optimism.io', chainId: 10, symbol: 'oETH', blockExplorer: 'https://https://optimistic.etherscan.io', isTestnet: false}, 'password for metamask')
     */
    setupMetamask(
      secretWordsOrPrivateKey?: string,
      network?:
        | string
        | {
            networkName: string;
            rpcUrl: string;
            chainId: number;
            symbol?: string;
            blockExplorer?: string;
            isTestnet: boolean;
          },
      password?: string,
      enableAdvancedSettings?: boolean,
      enableExperimentalSettings?: boolean,
    ): Chainable<Subject>;
  }
}