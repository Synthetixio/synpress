import { SEED_PHRASE, PASSWORD, KeplrWallet } from "../../src"

it('should import a wallet', () => {
  cy.setupWallet({ secretWordsOnPrivateKeys: SEED_PHRASE, password: PASSWORD }).then((wallet: KeplrWallet) => {
    expect(wallet).to.be.true
  })
}) 