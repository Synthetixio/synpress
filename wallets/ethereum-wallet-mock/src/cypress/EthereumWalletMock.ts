import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
import { ACCOUNT_MOCK, BLOCKCHAIN } from '../constants'
import { EthereumWalletMockAbstract } from '../type/EthereumWalletMockAbstract'
import type { Network } from '../type/Network'
import type { WalletMock } from '../type/WalletMock'

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
  getAllAccounts(): Cypress.Chainable<`0x${string}`[]> {
    return cy.window().then((cypressWindow) => {
      return cypressWindow.ethereum.request({
        method: 'eth_requestAccounts'
      })
    })
  }

  // /**
  //  * Adds a new account. This account is based on the initially imported seed phrase.
  //  */
  addNewAccount() {
    this.getAllAccounts().then((accounts) => {
      const newAccount = mnemonicToAccount(this.seedPhrase || '', {
        accountIndex: accounts?.length
      })

      cy.window().then((cypressWindow) => {
        cypressWindow.Web3Mock.mock({
          blockchain: BLOCKCHAIN,
          wallet: this.wallet,
          accounts: {
            return: [newAccount.address, ...accounts]
          }
        })
      })
    })
  }

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

  /**
  //  * Switches to the account with the given name.
  //  *
  //  * @param accountAddress - The name of the account to switch to.
  //  */
  switchAccount(accountAddress: string) {
    cy.window().then((cypressWindow) => {
      cypressWindow.Web3Mock.mock({
        blockchain: BLOCKCHAIN,
        wallet: this.wallet,
        accounts: { return: [accountAddress] }
      })
    })
  }

  /**
  //  * Adds a new network.
  //  *
  //  * @param network - The network object to use for adding the new network.
  //  */
  async addNetwork(network: Network) {
    const networkInfo = {
      chainId: network.chainId,
      chainName: network.name,
      nativeCurrency: network.nativeCurrency,
      rpcUrls: [network.rpcUrl],
      blockExplorerUrls: [network.blockExplorerUrl]
    }

    cy.window().then((cypressWindow) => {
      cypressWindow.Web3Mock.mock({
        blockchain: BLOCKCHAIN,
        wallet: this.wallet,
        network: {
          add: networkInfo
        }
      })
    })
  }

  // /**
  //  * Retrieves the current account address.
  //  */
  getAccountAddress() {
    return this.getAllAccounts().then((accounts) => {
      return accounts[0] as `0x${string}`
    })
  }

  // /**
  //  * Switches to the network with the given name.
  //  *
  //  * @param networkName - The name of the network to switch to.
  //  */
  async switchNetwork(networkName: string) {
    cy.window().then((cypressWindow) => {
      cypressWindow.Web3Mock.mock({
        blockchain: BLOCKCHAIN,
        wallet: this.wallet,
        network: {
          add: {
            chainId: 1,
            chainName: networkName,
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['http://localhost:8545']
          }
        }
      })
    })
  }

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
