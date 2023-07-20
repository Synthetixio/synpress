/* eslint-disable ui-testing/no-disabled-tests */
describe('Station', () => {
  context('Test commands', () => {
    it(`Setup terraStation with one wallet using recover with seed phrase option`, () => {
      cy.setupTerraStation().then(setupFinished => {
        expect(setupFinished).to.be.true;
      });
    });
    it('Test happy flow recover wallet from seed',()=>{
      cy.recoverWalletFromSeed().then(recovered => {
        expect(recovered).to.be.true;
      })
    });
  });
});
