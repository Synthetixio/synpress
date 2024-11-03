import type { Page } from '@playwright/test'
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
import { ACCOUNT_MOCK, BLOCKCHAIN } from '../constants'
import { EthereumWalletMockAbstract } from '../type/EthereumWalletMockAbstract'
import type { Network } from '../type/Network'
import type { WalletMock } from '../type/WalletMock'
import { DEFAULT_NETWORK_ID } from './utils'
import { mockTransaction, sendTransaction } from './utils'

/**
 * Mock implementation of an Ethereum wallet for testing purposes.
 * Simulates wallet behavior in a controlled environment, allowing for consistent
 * and reproducible tests without relying on actual blockchain interactions.
 *
 * @class
 * @extends {EthereumWalletMockAbstract}
 */
export default class EthereumWalletMock extends EthereumWalletMockAbstract {
  /** The Playwright Page object to interact with. */
  page: Page

  /**
   * Creates an instance of EthereumWalletMock.
   * @param page - The Playwright Page object to interact with.
   * @param wallet - The type of wallet to mock.
   */
  constructor(page: Page, wallet: WalletMock = 'metamask') {
    super(wallet)
    this.page = page
    this.wallet = wallet
  }

  /**
   * Imports a wallet using the given seed phrase.
   * @param seedPhrase - The seed phrase to import.
   * @returns A promise that resolves when the wallet is imported.
   */
  importWallet(seedPhrase: string): Promise<void> {
    this.seedPhrase = seedPhrase

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
   * Retrieves all account addresses.
   * @returns A promise that resolves to an array of account addresses.
   */
  async getAllAccounts(): Promise<`0x${string}`[] | undefined> {
    return this.page.evaluate(() => {
      return window.ethereum.request({ method: 'eth_requestAccounts' })
    })
  }

  /**
   * Adds a new account based on the initially imported seed phrase.
   * @returns A promise that resolves when the new account is added.
   */
  async addNewAccount(): Promise<void> {
    const accounts = await this.getAllAccounts()

    const newAccount = mnemonicToAccount(this.seedPhrase || '', {
      accountIndex: accounts?.length
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
      [BLOCKCHAIN, this.wallet, [newAccount.address, ...(accounts || [])]]
    )
  }

  /**
   * Imports a wallet using the given private key.
   * @param privateKey - The private key to import.
   * @returns A promise that resolves when the wallet is imported.
   */
  async importWalletFromPrivateKey(privateKey: `0x${string}`): Promise<void> {
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
   * Switches to the account with the given address.
   * @param accountAddress - The address of the account to switch to.
   * @returns A promise that resolves when the account switch is complete.
   */
  async switchAccount(accountAddress: string): Promise<void> {
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
   * @param network - The network object to use for adding the new network.
   * @returns A promise that resolves when the network is added.
   */
  async addNetwork(network: Network): Promise<void> {
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
   * @returns A promise that resolves to the current account address.
   */
  async getAccountAddress(): Promise<`0x${string}` | undefined> {
    return (await this.getAllAccounts())?.[0]
  }

  /**
   * Switches to the network with the given name.
   * @param networkName - The name of the network to switch to.
   * @returns A promise that resolves when the network switch is complete.
   */
  async switchNetwork(networkName: string): Promise<void> {
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
      [BLOCKCHAIN, this.wallet, networkName, DEFAULT_NETWORK_ID]
    )
  }

  /**
   * Connects wallet to the dapp.
   * @param wallet - The wallet to connect to the dapp.
   * @returns A promise that resolves when the wallet is connected to the dapp.
   */
  connectToDapp(wallet: WalletMock = 'metamask'): Promise<void> {
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

  /**
   * Sends a transaction.
   * @param to - Recipient address.
   * @param value - Transaction value in wei.
   * @returns Promise that resolves to the transaction hash.
   */
  async sendTransaction(to: string, value: string): Promise<string> {
    // Mock the transaction
    await mockTransaction(this.page, [
      to,
      ACCOUNT_MOCK, // from address
      value
    ])

    // Send the transaction
    return this.page.evaluate(sendTransaction, {
      to,
      from: ACCOUNT_MOCK,
      value
    })
  }
}
