const SEED_PHRASE = 'test test test test test test test test test test test junk'

describe('MetaMask Wallet Import', () => {
  it('should go through the onboarding flow and import wallet from seed phrase', () => {
    cy.importWallet(SEED_PHRASE)

    cy.getAccount().should('eq', 'Account 1')
    cy.getAccountAddress().should('eq', '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
  })
})
