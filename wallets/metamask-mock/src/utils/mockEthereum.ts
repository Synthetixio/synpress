export default function mockEthereum() {
  Web3Mock.mock({
    blockchain: 'ethereum',
    wallet: 'metamask',
    accounts: {
      return: ['0xd73b04b0e696b0945283defa3eee453814758f1a']
    }
  })
}
