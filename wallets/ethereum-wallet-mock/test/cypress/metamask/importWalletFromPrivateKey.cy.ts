it('should import account using private key', () => {
  cy.importWalletFromPrivateKey('0xea084c575a01e2bbefcca3db101eaeab1d8af15554640a510c73692db24d0a6a')

  cy.get('#getAccounts').click()

  cy.get('#getAccountsResult').should('have.text', '0xa2ce797cA71d0EaE1be5a7EffD27Fd6C38126801')
})
