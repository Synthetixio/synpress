it('should reject contract deployment', () => {
  cy.get('#tokenAddresses').should('be.empty')
  cy.get('#createToken').click()

  cy.rejectTransaction().then(() => {
    cy.get('#tokenAddresses').should('have.text', 'Creation Failed')
  })
})
