before(() => {
  cy.switchNetwork('Anvil')

  cy.get('#deployERC1155Button').click()

  cy.confirmTransaction().then(() => {
    cy.wait(5000)

    cy.get('#batchMintButton').click()

    cy.confirmTransactionAndWaitForMining()
  })
})

it('should perform batch ERC115 transfer', () => {
  cy.get('#batchTransferFromButton').click()

  cy.confirmTransaction().then(() => {
    cy.get('#erc1155Status').should('have.text', 'Batch Transfer From completed')
  })
})
