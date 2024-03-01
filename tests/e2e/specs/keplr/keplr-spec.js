/* eslint-disable ui-testing/no-disabled-tests */
describe('Keplr', () => {
  context('Test commands', () => {
    it(`should complete Keplr connect with wallet, and confirm transaction after importing an existing wallet using 24 word phrase`, () => {
      cy.setupWallet().then(setupFinished => {
        expect(setupFinished).to.be.true;

        cy.visit('/');
        cy.contains('Connect Wallet').click();
        cy.acceptAccess().then(taskCompleted => {
          expect(taskCompleted).to.be.true;

          cy.contains('Make an Offer').click();
          cy.confirmTransaction().then(taskCompleted => {
            expect(taskCompleted).to.be.true;
          });
        });
      });
    });

    it(`should complete Keplr connect with wallet, and confirm transaction after creating a new wallet using 24 word phrase`, () => {
      cy.switchToExtensionRegistrationWindow().then(() => {
        cy.setupWallet(
          'orbit bench unit task food shock brand bracket domain regular warfare company announce wheel grape trust sphere boy doctor half guard ritual three ecology',
          'Test1234',
          true,
        ).then(setupFinished => {
          expect(setupFinished).to.be.true;

          cy.visit('/');
          cy.contains('Connect Wallet').click();
          cy.acceptAccess().then(taskCompleted => {
            expect(taskCompleted).to.be.true;

            cy.contains('Make an Offer').click();
            cy.confirmTransaction().then(taskCompleted => {
              expect(taskCompleted).to.be.true;
            });
          });
        });
      });
    });

    it(`should complete Keplr setup by importing the wallet using private key`, () => {
      cy.switchToExtensionRegistrationWindow().then(() => {
        cy.setupWallet(
          'A9C09B6E4AF70DE1F1B621CB1AA66CFD0B4AA977E4C18497C49132DD9E579485',
        ).then(setupFinished => {
          expect(setupFinished).to.be.true;
        });
      });
    });
  });
});
