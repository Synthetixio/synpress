it("should add new MetaMask account", () => {
  cy.addNewAccount("Synpress with Cypress test");

  cy.wait(10000);
});

it("should open MetaMask settings", () => {
  cy.openSettings();

  cy.wait(10000);
});
