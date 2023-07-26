/* eslint-disable ui-testing/no-disabled-tests */
describe('Station', () => {
    context('Test commands', () => {
      it(`Setup terraStation with one wallet using recover with seed phrase option`, () => {
        cy.setupTerraStation().then(setupFinished => {
          expect(setupFinished).to.be.true;
        });
      });
      it('Go to the menage wallet screen from home screen and verify its form and elements', () => {
        cy.verifyManageWalletsForm().then(setupFinished => {
            expect(setupFinished).to.be.true;
          });
        cy.wait(1000000);
      });
    });
  });
  