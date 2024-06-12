import EthereumWalletMock from '../EthereumWalletMock'
import { SEED_PHRASE } from '../../constants'

let ethereumWalletMock: EthereumWalletMock | undefined

export default function getEthereumWalletMock() {
  if (ethereumWalletMock) return ethereumWalletMock

  ethereumWalletMock = new EthereumWalletMock()
  ethereumWalletMock.importWallet(SEED_PHRASE)

  return ethereumWalletMock
}
