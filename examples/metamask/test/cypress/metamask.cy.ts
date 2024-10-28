it('should connect to ethereum', () => {
  cy.window().then((window) => {
    // Access the Ethereum provider injected by MetaMask
    // @ts-ignore
    window.ethereum
      .request({
        // Request the current chain ID from the Ethereum provider
        method: 'eth_chainId'
      })
      .then((currentChainId: string) => {
        // Assert that the current chain ID is '0x1' (Ethereum mainnet)
        expect(currentChainId).to.equal('0x1')
      })
  })
})
