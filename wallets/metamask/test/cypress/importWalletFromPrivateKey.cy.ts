describe('Import wallet from private key', () => {
  it('should import a new wallet from private key', () => {
    cy.importWalletFromPrivateKey('ea084c575a01e2bbefcca3db101eaeab1d8af15554640a510c73692db24d0a6a')

    cy.getAccountAddress().should('eq', '0xa2ce797cA71d0EaE1be5a7EffD27Fd6C38126801')
  })
})
