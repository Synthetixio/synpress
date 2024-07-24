it('should switch network', () => {
  cy.getNetwork().should('eq', 'Ethereum Mainnet')

  const targetNetwork = 'Linea Mainnet'
  cy.switchNetwork(targetNetwork).then(() => {
    cy.getNetwork().should('eq', targetNetwork)
  })
})

it('should switch network to the testnet', () => {
  cy.getNetwork().should('eq', 'Linea Mainnet')

  const targetNetwork = 'Sepolia'
  cy.switchNetwork(targetNetwork, true).then(() => {
    cy.getNetwork().should('eq', targetNetwork)
  })
})
