it('should reject approve request', () => {
  cy.get('#tokenAddresses').should('be.empty')
  cy.get('#createToken').click()

  cy.confirmTransaction().then(() => {
    cy.get('#approveTokens').click()

    cy.rejectTokenPermission()
  })
})
