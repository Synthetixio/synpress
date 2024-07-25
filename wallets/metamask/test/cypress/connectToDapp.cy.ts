it('should connect account to the app', () => {
  cy.get('#connectButton').click()
  cy.connectToDapp()

  cy.get('#accounts').should('contain', '0x')
})
