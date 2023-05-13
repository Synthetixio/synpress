describe('SIWE', () => {
  context('Test commands', () => {
    it(`acceptMetamaskAccess should work with SIWE signature request after connecting a wallet`, () => {
      cy.setupMetamask(
        'test test test test test test test test test test test junk',
        'mainnet',
        'Tester@1234',
      );
      cy.origin('https://login.xyz', () => {
        cy.visit('/');
        cy.get('[data-action="submit"]').click();
        cy.get(
          '#WEB3_CONNECT_MODAL_ID .web3modal-provider-wrapper:nth-child(1)',
        ).click();
      });
      cy.acceptMetamaskAccess({ confirmSignatureRequest: true }).then(
        connected => {
          expect(connected).to.be.true;
        },
      );
    });
  });
});
