it('should be able to access ethereum API', () => {
  cy.window().then((window) => {
    expect(!!window.ethereum).to.be.true
  })
})

it('should be connected to metamask by default', () => {
  cy.window().then((window) => {
    expect(window.ethereum.isMetaMask).to.be.true
  })
})

it('should connect to ethereum', () => {
  cy.window().then((window) => {
    window.ethereum
      .request({
        method: 'eth_chainId'
      })
      .then((currentChainId: string) => {
        expect(currentChainId).to.equal('0x1')
      })
  })
})

it('should be able to connect to every supported ethereum wallet', () => {
  cy.window().then((window) => {
    expect(!!window.ethereum.isMetaMask).to.be.true
    expect(window.ethereum.isCoinbaseWallet).to.be.undefined
  })

  cy.connectToDapp('coinbase')
  cy.window().then((window) => {
    expect(!!window.ethereum.isCoinbaseWallet).to.be.true
  })

  cy.connectToDapp('walletconnect')
  cy.window().then((window) => {
    expect(!!window.ethereum.isWalletLink).to.be.true
  })
})
