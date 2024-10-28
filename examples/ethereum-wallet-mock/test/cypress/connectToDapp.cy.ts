it('should mock MetaMask in the Test Dapp', () => {
  cy.connectToDapp()

  cy.get('#getAccounts').click()

  cy.get('#getAccountsResult').should('have.text', '0xd73b04b0e696b0945283defa3eee453814758f1a')
})
