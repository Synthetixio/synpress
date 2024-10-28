it('should add a new account with a specified name', () => {
  const accountName = 'Test Account 2'

  // Add a new account with the specified name
  cy.addNewAccount(accountName).then(() => {
    // Verify that the current account name matches the newly added account
    cy.getAccount().should('eq', accountName)
  })
})

it('should rename currently newly added account with specified name', () => {
  const newAccountName = 'Rename Account Name'

  // Add a new account with the initial name
  cy.addNewAccount(newAccountName).then(() => {
    // Rename the newly added account
    cy.renameAccount(newAccountName, 'Renaming test').then(() => {
      // Verify that the account name has been updated to the new name
      cy.getAccount().should('eq', 'Renaming test')
    })
  })
})
