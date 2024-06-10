it("should add a new account with specified name", () => {
  cy.getAllAccounts().should("have.length", 1);

  cy.addNewAccount();

  cy.getAllAccounts().should("have.length", 2);

  cy.addNewAccount();
  cy.addNewAccount();

  cy.getAllAccounts().should("have.length", 4);
});
