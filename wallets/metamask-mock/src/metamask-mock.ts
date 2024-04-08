// @ts-ignore
import { connect } from '@depay/web3-mock'
import type { Page } from '@playwright/test'
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
import type { Network } from './network/Network'

export const blockchain = 'ethereum'
export const wallet = 'metamask'

const networkConfig = {
  blockchain,
  wallet
}

const BSC_NETWORK_ID = '0x38'

export const SEED_PHRASE = 'test test test test test test test test test test test junk'

export const PRIVATE_KEY = 'ea084c575a01e2bbefcca3db101eaeab1d8af15554640a510c73692db24d0a6a'

/**
 * This class is the heart of Synpress's MetaMask API.
 */
export class MetaMaskMock {
  seedPhrase = ''

  constructor(
    /**
     * The MetaMask tab page.
     */
    readonly page: Page
  ) {
    this.page = page
  }

  /**
   * Imports a wallet using the given seed phrase.
   *
   * @param seedPhrase - The seed phrase to import.
   */
  importWallet(seedPhrase: string) {
    this.seedPhrase = seedPhrase
  }

  /**
   * Retrieves the current account address.
   */
  async getAllAccounts(): Promise<string[]> {
    return this.page.evaluate(() => {
      return window.ethereum.request({ method: 'eth_requestAccounts' })
    })
  }

  /**
   * Adds a new account. This account is based on the initially imported seed phrase.
   */
  async addNewAccount() {
    const accounts = await this.getAllAccounts()

    const newAccount = mnemonicToAccount(this.seedPhrase, {
      accountIndex: accounts.length
    })

    return this.page.evaluate(
      ([networkConfig, accounts]) => {
        return Web3Mock.mock({
          ...networkConfig,
          accounts: {
            return: accounts
          }
        })
      },
      [networkConfig, [newAccount.address, ...accounts]]
    )
  }

  /**
   * Imports a wallet using the given private key.
   *
   * @param privateKey - The private key to import.
   */
  async importWalletFromPrivateKey(privateKey: `0x${string}`) {
    const newAccount = privateKeyToAccount(privateKey)

    return this.page.evaluate(
      ([networkConfig, account]) => {
        return Web3Mock.mock({
          ...networkConfig,
          accounts: {
            return: account
          }
        })
      },
      [networkConfig, [newAccount.address]]
    )
  }

  /**
   * Switches to the account with the given name.
   *
   * @param accountAddress - The name of the account to switch to.
   */
  async switchAccount(accountAddress: string) {
    return this.page.evaluate(
      ([networkConfig, accountAddress]) => {
        return Web3Mock.mock({
          // @ts-ignore
          ...networkConfig,
          accounts: {
            return: [accountAddress]
          }
        })
      },
      [networkConfig, accountAddress]
    )
  }

  /**
   * Adds a new network.
   *
   * @param network - The network object to use for adding the new network.
   * @param network.name - The name of the network.
   * @param network.rpcUrl - The RPC URL of the network.
   * @param network.chainId - The chain ID of the network.
   * @param network.symbol - The currency symbol of the network.
   * @param network.blockExplorerUrl - The block explorer URL of the network.
   */
  async addNetwork(network: Network) {
    const networkInfo = {
      chainId: network.chainId,
      chainName: network.name,
      nativeCurrency: network.nativeCurrency,
      rpcUrls: [network.rpcUrl],
      blockExplorerUrls: [network.blockExplorerUrl]
    }

    return this.page.evaluate(
      ([networkConfig, networkInfo]) => {
        return Web3Mock.mock({
          ...networkConfig,
          network: {
            add: networkInfo
          }
        })
      },
      [networkConfig, networkInfo]
    )
  }

  /**
   * Retrieves the current account address.
   */
  async getAccountAddress() {
    return (await this.getAllAccounts())[0]
  }

  /**
   * Switches to the network with the given name.
   *
   * @param networkName - The name of the network to switch to.
   */
  async switchNetwork(networkName: string) {
    return this.page.evaluate(
      ([networkConfig, networkName, chainId]) => {
        Web3Mock.mock({
          // @ts-ignore
          ...networkConfig,
          network: {
            switchTo: networkName
          }
        })

        window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          // Mock do not support custom network IDs
          params: [{ chainId }]
        })
      },
      [networkConfig, networkName, BSC_NETWORK_ID]
    )
  }

  /**
   * Connects to the dapp using the currently selected account.
   */
  async connectToDapp(network: string) {
    connect(network)
  }
}
