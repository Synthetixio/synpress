import type { Page } from '@playwright/test'
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
import type { Network } from './network/Network'
import { ACCOUNT_MOCK, BLOCKCHAIN, OPTIMISM_NETWORK_ID } from './utils'

export type WalletMock = 'metamask' | 'coinbase' | 'phantom' | 'walletconnect' | 'walletlink'

export class EthereumWalletMock {
  seedPhrase = ''
  wallet: WalletMock = 'metamask'

  constructor(readonly page: Page, wallet: WalletMock = 'metamask') {
    this.page = page
    this.wallet = wallet
  }

  /**
   * Imports a wallet using the given seed phrase.
   *
   * @param seedPhrase - The seed phrase to import.
   */
  importWallet(seedPhrase: string) {
    this.seedPhrase = seedPhrase

    console.log(this.wallet)

    return this.page.evaluate(
      ([blockchain, wallet, accounts]) => {
        class WalletConnectStub {}

        let connector: WalletConnectStub | undefined

        if (wallet === 'walletconnect') {
          connector = WalletConnectStub
        }

        return Web3Mock.mock({
          blockchain,
          wallet,
          accounts: {
            return: accounts
          },
          connector
        })
      },
      [BLOCKCHAIN, this.wallet, [ACCOUNT_MOCK]]
    )
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
      ([blockchain, wallet, accounts]) => {
        return Web3Mock.mock({
          blockchain,
          wallet,
          accounts: {
            return: accounts
          }
        })
      },
      [BLOCKCHAIN, this.wallet, [newAccount.address, ...accounts]]
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
      ([blockchain, wallet, account]) => {
        return Web3Mock.mock({
          blockchain,
          wallet,
          accounts: {
            return: account
          }
        })
      },
      [BLOCKCHAIN, this.wallet, [newAccount.address]]
    )
  }

  /**
   * Switches to the account with the given name.
   *
   * @param accountAddress - The name of the account to switch to.
   */
  async switchAccount(accountAddress: string) {
    return this.page.evaluate(
      ([blockchain, wallet, accountAddress]) => {
        return Web3Mock.mock({
          blockchain,
          wallet,
          accounts: {
            return: [accountAddress]
          }
        })
      },
      [BLOCKCHAIN, this.wallet, accountAddress]
    )
  }

  /**
   * Adds a new network.
   *
   * @param network - The network object to use for adding the new network.
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
      ([blockchain, wallet, networkInfo]) => {
        return Web3Mock.mock({
          blockchain,
          wallet,
          network: {
            add: networkInfo
          }
        })
      },
      [BLOCKCHAIN, this.wallet, networkInfo]
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
      ([blockchain, wallet, networkName, chainId]) => {
        Web3Mock.mock({
          blockchain,
          wallet,
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
      [BLOCKCHAIN, this.wallet, networkName, OPTIMISM_NETWORK_ID]
    )
  }

  /**
   * Connects wallet to the dapp.
   *
   * @param wallet - The wallet to connect to the dapp.
   */
  async connectToDapp(wallet: WalletMock = 'metamask') {
    this.wallet = wallet

    return this.page.evaluate(
      ([blockchain, accounts, wallet]) => {
        // Cannot pass custom class as an argument to `page.evaluate`
        class WalletConnectStub {}

        let connector: WalletConnectStub | undefined

        if (wallet === 'walletconnect') {
          connector = WalletConnectStub
        }

        return Web3Mock.mock({
          blockchain,
          wallet,
          accounts: {
            return: accounts
          },
          connector
        })
      },
      [BLOCKCHAIN, [ACCOUNT_MOCK], wallet]
    )
  }
}
