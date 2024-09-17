it('should lock & unlock the wallet without any error', () => {
  cy.lock().then(() => {
    cy.unlock()
  })
})
