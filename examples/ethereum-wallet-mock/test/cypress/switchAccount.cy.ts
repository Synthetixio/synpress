it('should add new account using MetaMask mock', () => {
  cy.switchAccount('0x4444797cA71d0EaE1be5a7EffD27Fd6C38126801')

  cy.get('#getAccounts').click()

  cy.get('#getAccountsResult').should('have.text', '0x4444797cA71d0EaE1be5a7EffD27Fd6C38126801')
})
