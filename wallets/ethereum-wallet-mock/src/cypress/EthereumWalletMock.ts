import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
import { EthereumWalletMockAbstract } from '../type/EthereumWalletMockAbstract'
import type { WalletMock } from '../type/WalletMock'
import { ACCOUNT_MOCK, BLOCKCHAIN } from './const/mocks'

export default class EthereumWalletMock extends EthereumWalletMockAbstract {
  constructor(wallet: WalletMock = 'metamask') {
    super(wallet)
    this.wallet = wallet
  }

  // /**
  //  * Imports a wallet using the given seed phrase.
  //  *
  //  * @param seedPhrase - The seed phrase to import.
  //  */
  importWallet(seedPhrase: string) {
    this.seedPhrase = seedPhrase

    cy.window().then((cypressWindow) => {
      cypressWindow.Web3Mock.mock({
        blockchain: BLOCKCHAIN,
        wallet: this.wallet,
        accounts: { return: [ACCOUNT_MOCK] }
      })
    })
  }

  // /**
  //  * Retrieves the current account address.
  //  */
  async getAllAccounts(): Promise<`0x${string}`[]> {
    let accounts: `0x${string}`[] = []

    cy.window().then((cypressWindow) => {
      accounts = cypressWindow.ethereum.request({
        method: 'eth_requestAccounts'
      })
    })

    console.log(accounts)

    return accounts
  }

  // /**
  //  * Adds a new account. This account is based on the initially imported seed phrase.
  //  */
  // async addNewAccount() {
  //   const accounts = await this.getAllAccounts();
  // }

  // /**
  //  * Imports a wallet using the given private key.
  //  *
  //  * @param privateKey - The private key to import.
  //  */
  importWalletFromPrivateKey(privateKey: `0x${string}`) {
    const newAccount = privateKeyToAccount(privateKey)

    cy.window().then((cypressWindow) => {
      cypressWindow.Web3Mock.mock({
        blockchain: BLOCKCHAIN,
        wallet: this.wallet,
        accounts: { return: [newAccount.address] }
      })
    })
  }

  // /**
  //  * Switches to the account with the given name.
  //  *
  //  * @param accountAddress - The name of the account to switch to.
  //  */
  // async switchAccount(accountAddress: string) {}
  //
  // /**
  //  * Adds a new network.
  //  *
  //  * @param network - The network object to use for adding the new network.
  //  */
  // async addNetwork(network: Network) {}
  //
  // /**
  //  * Retrieves the current account address.
  //  */
  // async getAccountAddress() {
  //   return (await this.getAllAccounts())[0];
  // }
  //
  // /**
  //  * Switches to the network with the given name.
  //  *
  //  * @param networkName - The name of the network to switch to.
  //  */
  // async switchNetwork(networkName: string) {}

  // /**
  //  * Connects wallet to the dapp.
  //  *
  //  * @param wallet - The wallet to connect to the dapp.
  //  */
  async connectToDapp(wallet: WalletMock = 'metamask') {
    this.wallet = wallet

    cy.window().then((cypressWindow) => {
      class WalletConnectStub {}

      let connector: WalletConnectStub | undefined

      if (wallet === 'walletconnect') {
        connector = WalletConnectStub
      }

      cypressWindow.Web3Mock.mock({
        blockchain: BLOCKCHAIN,
        wallet,
        accounts: { return: [ACCOUNT_MOCK] },
        // @ts-ignore
        connector
      })
    })
  }
}
