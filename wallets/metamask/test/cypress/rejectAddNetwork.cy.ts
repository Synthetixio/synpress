it('should reject new network request', () => {
  cy.createAnvilNode({
    chainId: 1338,
    port: 8546
  }).then(() => {
    cy.get('#addEthereumChain').click()

    cy.rejectNewNetwork().then(() => {
      cy.get('#chainId').should('have.text', '0x1')

      cy.emptyAnvilNode()
    })
  })
})

after(() => {
  cy.switchNetwork('Ethereum Mainnet')
})
