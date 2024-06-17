import { ANVIL_CHAIN_ID, ANVIL_URL_URL } from '../../../src/constants'

function createAnvilNetwork() {
  return {
    name: 'Anvil',
    rpcUrl: ANVIL_URL_URL,
    chainId: ANVIL_CHAIN_ID,
    blockExplorerUrl: 'https://etherscan.io/',
    nativeCurrency: {
      decimals: 18,
      name: 'Anvil',
      symbol: 'ETH'
    }
  }
}

it('should switch network', () => {
  const network = createAnvilNetwork()

  cy.addNetwork(network)

  cy.switchNetwork(network.name)

  cy.window().then((cypressWindow) => {
    cypressWindow.ethereum.request({ method: 'eth_chainId' }).then((chainId: string) => {
      expect(chainId).to.equal('0xa')
    })
  })
})
