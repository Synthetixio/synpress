it('should add new MetaMask account', () => {
  cy.getAllAccounts().should('have.length', 1)

  cy.addNewAccount()

  cy.getAllAccounts().should('have.length', 2)
})
