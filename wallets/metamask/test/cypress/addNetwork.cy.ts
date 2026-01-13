it('should add network and close network added popup', () => {

  cy.wait(10000000)

  cy.createAnvilNode().then(({ rpcUrl, chainId }) => {
    const network = {
      name: 'Anvil',
      rpcUrl,
      chainId,
      symbol: 'ETH',
      blockExplorerUrl: 'https://etherscan.io/'
    }

    cy.addNetwork(network).then(() => cy.getNetwork().should('eq', 'Anvil'))
  })
})

it('should add network without block explorer', () => {
  cy.createAnvilNode().then(({ rpcUrl, chainId }) => {
    const network = {
      name: 'Anvil2',
      rpcUrl,
      chainId,
      symbol: 'ETH',
      blockExplorerUrl: undefined
    }

    cy.addNetwork(network).then(() => cy.getNetwork().should('eq', 'Anvil2'))
  })
})

after(() => {
  cy.switchNetwork('Anvil', true)
})
