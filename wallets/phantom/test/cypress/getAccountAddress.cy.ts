it('should should get account address for Solana network', () => {
  cy.getAccountAddress('solana').should('eq', 'oeYf6KAJkLYhBuR8CiGc6L4D4Xtfepr85fuDgA9kq96')
})
