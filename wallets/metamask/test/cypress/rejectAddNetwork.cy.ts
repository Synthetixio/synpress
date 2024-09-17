it('should reject new network request', () => {
  cy.get('#addEthereumChain').click()

  cy.rejectNewNetwork().then(() => {
    cy.get('#chainId').should('have.text', '0x7a69')

    cy.emptyAnvilNode()
  })
})
