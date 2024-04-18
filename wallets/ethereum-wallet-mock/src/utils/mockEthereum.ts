export default function mockEthereum(
  wallet: 'metamask' | 'coinbase' | 'phantom' | 'walletconnect' | 'walletlink' = 'metamask',
  accounts: `0x${string}`[] = []
) {
  Web3Mock.mock({
    blockchain: 'ethereum',
    wallet,
    accounts: {
      return: accounts
    }
  })
}
