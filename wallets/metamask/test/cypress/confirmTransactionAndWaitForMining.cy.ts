it('should confirm contract deployment and wait for mining', () => {
  cy.get('#tokenAddresses').should('be.empty')
  cy.get('#createToken').click()

  cy.confirmTransactionAndWaitForMining().then(() => {
    cy.get('#tokenAddresses').should('include', /^0x/)
  })
})

it('should confirm legacy transaction and wait for mining', () => {
  cy.get('#sendButton').click()

  cy.confirmTransactionAndWaitForMining()
})

it('should confirm EIP-1559 transaction and wait for mining', () => {
  cy.get('#sendEIP1559Button').click()

  cy.confirmTransactionAndWaitForMining().then(() => {
    cy.get('#tokenAddresses').should('include', /^0x/)
  })
})

it('should work correctly when calling sequentially', () => {
  cy.get('#sendEIP1559Button').click()
  cy.confirmTransactionAndWaitForMining().then(() => {
    cy.get('#sendEIP1559Button').click()
    cy.confirmTransactionAndWaitForMining().then(() => {
      cy.get('#tokenAddresses').should('include', /^0x/)
    })
  })
})
