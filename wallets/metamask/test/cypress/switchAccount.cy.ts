it('should switch back to the `Account 1` account', () => {
  const accountName = 'New Account to test switch'

  cy.addNewAccount(accountName).then(() => {
    cy.getAccount().should('eq', accountName)

    cy.switchAccount('Account 1').then(() => {
      cy.getAccount().should('eq', 'Account 1')
    })
  })
})
