const newAccountName = 'New Name'

it('should rename currently connected account with specified name', () => {
  cy.addNewAccount(newAccountName).then(() => {
    cy.renameAccount(newAccountName, 'Renaming test').then(() => {
      cy.goToHomePage()
      cy.getAccount().should('eq', 'Renaming test')
    })
  })
})
