/* eslint-disable testing-library/await-async-utils */
/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable ui-testing/no-hard-wait */
describe('Blank send flow', () => {
  let accountsInfo = null;
  before(() => {
    cy.fixture('accounts.json').then(info => {
      accountsInfo = info.accounts;
    });
  });
  after(() => {
    //test teardown
    //Return the money from Account 1 => Account 2,
    //This should be a done in the beforeAll hook
    const firstAccount = accountsInfo[0];
    const secondAccount = accountsInfo[1];
    cy.switchBlankAccount(secondAccount.name).then(name => {
      expect(name).to.equal(secondAccount.name);
    });
    cy.sendTransaction(firstAccount.name, '0.1').then(isOk => {
      expect(isOk).to.be.true;
    });
  });
  context('Send flow', () => {
    it(`Set Georli as the desired network`, () => {
      cy.changeBlankNetwork('goerli').then(assigned => {
        expect(assigned).to.be.true;
      });
      cy.getCurrentNetwork().then(network => {
        expect(network).matches(/goerli/i);
      });
    });
    it('Should set the Account 1 selected by default', () => {
      const defaultAccount = accountsInfo[0];
      cy.getBlankAccountName().then(name => {
        expect(name).to.equal(defaultAccount.name);
      });
    });
    it('Should add an account and retrieve the account name', () => {
      const secondAccount = accountsInfo[1];
      cy.createBlankAccount().then(accountName => {
        expect(accountName).to.equal(secondAccount.name);
      });
    });
    it('Should switch to first account and retrieve account name', () => {
      const account = accountsInfo[0];
      cy.switchBlankAccount(account.name).then(name => {
        expect(name).to.equal(account.name);
      });
    });
    it('Should send a transaction from Account 1 to Account 2', () => {
      let transactionIdBeforeSend = '';
      let sentTransactionId = '';
      const firstAccountAddress = accountsInfo[0].address;
      const secondAccountAddress = accountsInfo[1].address;
      cy.getLastTransactionId().then(lastTransactionId => {
        transactionIdBeforeSend = lastTransactionId;
      });
      cy.sendTransaction(accountsInfo[1].name, '0.1').then(isOk => {
        expect(isOk).to.be.true;
      });
      //timeout to await our app to update its internal state...
      cy.wait(3000);
      cy.log('Transaction sent. Now await for confirmation');
      cy.getLastTransactionId().then(txid => {
        sentTransactionId = txid;
        expect(sentTransactionId).not.to.be.empty;
        expect(sentTransactionId).not.to.equal(transactionIdBeforeSend);
        cy.log('Awaiting transaction to be confirmed using etherscan API.');
        cy.etherscanWaitForTxSuccess({ txid }).then(({ result }) => {
          expect(txid).to.equal(result.transactionHash);
          //this API returns addresses in lower-case.
          expect(firstAccountAddress.toLowerCase()).to.equal(
            result.from.toLowerCase(),
          );
          expect(secondAccountAddress.toLowerCase()).to.equal(
            result.to.toLowerCase(),
          );
        });
      });
    });
  });
});
