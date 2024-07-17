it('should connect account to the app', () => {
  cy.get('#connectButton').click()
  cy.connectToDapp()

  cy.get('#accounts').should('have.text', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
})
