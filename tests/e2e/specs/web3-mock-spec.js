import { Mock } from '@depay/web3-mock';

/* eslint-disable ui-testing/no-disabled-tests */
describe('Metamask', () => {
  context('Test commands', () => {
    beforeEach(() => {
      Mock.mock(window); // This is a very simplified example, we still need to mock specific behaviors.
    });
    // todo: clear the state of extension and test different combinations of setupMetamask with private key & custom network
    it(`setupMetamask should finish metamask setup using secret words`, () => {
      cy.setupMetamask(
        'test test test test test test test test test test test junk',
        'sepolia',
        'Tester@1234',
      ).then(setupFinished => {
        expect(setupFinished).to.be.true;
      });

    });
  });
});
