it('should add a new network', () => {
  cy.createAnvilNode({
    chainId: 1338,
    port: 8546
  }).then(() => {
    cy.get('#addEthereumChain').click()

    cy.approveNewNetwork().then(() => {
      cy.approveSwitchNetwork().then(() => {
        cy.get('#chainId').should('have.text', '0x53a')

        cy.emptyAnvilNode()
      })
    })
  })
})

after(() => {
  cy.switchNetwork('Ethereum Mainnet')
})
