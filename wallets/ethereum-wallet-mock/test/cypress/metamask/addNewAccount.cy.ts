it('should add a new accounts', () => {
  cy.getAllAccounts().then((accounts) => {
    expect(accounts).to.have.length(1)
  })

  cy.addNewAccount().then(() => {
    cy.getAllAccounts().then((accounts) => {
      expect(accounts).to.have.length(2)
    })
  })

  cy.addNewAccount().then(() => {
    cy.addNewAccount().then(() => {
      cy.getAllAccounts().then((accounts) => {
        expect(accounts).to.have.length(4)
      })
    })
  })
})
