it('should add a new account with a specified name', () => {
  const accountName = 'Test Account 2'

  cy.addNewAccount(accountName).then(() => {
    cy.getAccount().should('eq', accountName)
  })
})
