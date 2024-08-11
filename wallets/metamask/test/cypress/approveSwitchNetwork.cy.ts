it('should switch to the requested network', () => {
  cy.createAnvilNode({
    chainId: 1338,
    port: 8546
  }).then(() => {
    cy.switchNetwork('Ethereum Mainnet').then(() => {
      cy.get('#chainId').should('have.text', '0x1')

      cy.get('#switchEthereumChain').click()

      cy.approveSwitchNetwork().then(() => {
        cy.get('#chainId').should('have.text', '0x53a')
      })
    })
  })
})
