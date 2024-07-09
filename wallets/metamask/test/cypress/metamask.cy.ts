it('should connect to ethereum', () => {
  cy.window().then((window) => {
    // @ts-ignore
    window.ethereum
      .request({
        method: 'eth_chainId'
      })
      .then((currentChainId: string) => {
        expect(currentChainId).to.equal('0x1')
      })
  })
})
