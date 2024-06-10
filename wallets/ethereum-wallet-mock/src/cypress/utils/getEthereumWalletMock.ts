import EthereumWalletMock from "../EthereumWalletMock";

let ethereumWalletMock: EthereumWalletMock | undefined;

export default function getEthereumWalletMock() {
  if (ethereumWalletMock) return ethereumWalletMock;

  return new EthereumWalletMock();
}
