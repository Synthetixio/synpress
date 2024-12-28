it('should toggle Testnet mode', () => {
  // Turn Testnet mode ON
  cy.toggleTestnetMode()

  cy.goToHomePage()
  cy.shouldHavePhantomPageElement('text=You are currently in Testnet Mode', true)

  // Turn Testnet mode OFF
  cy.toggleTestnetMode()

  cy.goToHomePage()
  cy.shouldHavePhantomPageElement('text=You are currently in Testnet Mode', false)
})
