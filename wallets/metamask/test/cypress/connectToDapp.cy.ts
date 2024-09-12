before(() => {
  cy.get('#revokeAccountsPermission').click()
})

it('should connect account to the app', () => {
  cy.get('#connectButton').click()
  cy.connectToDapp()

  cy.get('#accounts').should('include', /^0x/)
})
