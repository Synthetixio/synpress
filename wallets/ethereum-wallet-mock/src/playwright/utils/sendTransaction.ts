interface SendTransactionParams {
  to: string
  from: string
  value: string
}

/**
 * Sends an Ethereum transaction using Web3Mock
 * @param params - Transaction parameters {to: string, from: string, value: string}
 * @returns Promise that resolves to the transaction hash
 */
export const sendTransaction = (params: SendTransactionParams): Promise<string> => {
  return window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [params]
  })
}
