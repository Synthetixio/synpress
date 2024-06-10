before(() => {
  cy.visit("/", {
    onBeforeLoad: (window) => {
      window.Web3Mock.mock({
        blockchain: "ethereum",
        wallet: "metamask",
      });
    },
  });
});
