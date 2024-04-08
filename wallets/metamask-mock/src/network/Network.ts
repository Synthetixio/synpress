export type Network = {
  name: string
  rpcUrl: string
  chainId: number
  blockExplorerUrl?: string
  nativeCurrency?: {
    name: string
    symbol: string
    decimals: number
  }
}
