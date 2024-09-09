it('should reject switch network request', () => {
  cy.switchNetwork('Ethereum Mainnet').then(() => {
    cy.get('#chainId').should('have.text', '0x1')

    cy.get('#switchEthereumChain').click()

    cy.rejectSwitchNetwork()

    cy.get('#chainId').should('have.text', '0x1')
  })
})
