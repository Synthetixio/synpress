/* eslint-disable ui-testing/no-disabled-tests */
describe('Keplr', () => {
    context('Test commands', () => {
      it(`setupWallet should finish Keplr setup using secret words`, () => {
        cy.setupWallet().then(setupFinished => {
          expect(setupFinished).to.be.true;
        });
      });
  
      it(`acceptAccess should accept connection request to Keplr`, () => {
        cy.visit('/');
        cy.contains('Connect Wallet').click();
        cy.acceptAccess().then(taskCompleted => {
          expect(taskCompleted).to.be.true;
        });
        cy.get('.card')
          .contains('My Wallet')
          .then(p => console.log(p));
  
        cy.contains('agoric1p2aqakv3ulz4qfy2nut86j9gx0dx0yw09h96md');
      });
  
      it(`confirmTransaction should confirm transaction for token creation (contract deployment) and check tx data`, () => {
        cy.contains('Make an Offer').click();
        cy.confirmTransaction().then(taskCompleted => {
          expect(taskCompleted).to.be.true;
        });
      });
    });
  });