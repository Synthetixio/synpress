import type { Network } from './Network'
import type { WalletMock } from './WalletMock'

export abstract class EthereumWalletMockAbstract {
  seedPhrase: string | undefined
  wallet: WalletMock

  protected constructor(wallet: WalletMock = 'metamask') {
    this.wallet = wallet
  }

  /**
   * Imports a wallet using the given seed phrase.
   *
   * @param seedPhrase - The seed phrase to import.
   */
  abstract importWallet(seedPhrase: string): void

  /**
   * Retrieves the current account address.
   */
  abstract getAllAccounts(): Cypress.Chainable<`0x${string}`[]> | Promise<`0x${string}`[] | undefined>

  /**
   * Adds a new account. This account is based on the initially imported seed phrase.
   */
  abstract addNewAccount(): void

  /**
   * Imports a wallet using the given private key.
   *
   * @param privateKey - The private key to import.
   */
  abstract importWalletFromPrivateKey(privateKey: `0x${string}`): void

  /**
   * Switches to the account with the given name.
   *
   * @param accountAddress - The name of the account to switch to.
   */
  abstract switchAccount(accountAddress: string): void

  /**
   * Adds a new network.
   *
   * @param network - The network object to use for adding the new network.
   */
  abstract addNetwork(network: Network): void

  /**
   * Retrieves the current account address.
   */
  abstract getAccountAddress(): Cypress.Chainable<`0x${string}`> | Promise<`0x${string}` | undefined>

  /**
   * Switches to the network with the given name.
   *
   * @param networkName - The name of the network to switch to.
   */
  abstract switchNetwork(networkName: string): void

  /**
   * Connects wallet to the dapp.
   *
   * @param wallet - The wallet to connect to the dapp.
   */
  abstract connectToDapp(wallet: WalletMock): void
}
