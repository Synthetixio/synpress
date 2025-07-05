import type { Page } from '@playwright/test'
import type { NetworkMode } from './Networks'

export abstract class PetraAbstract {
  /**
   * @param password - The password of the Phantom wallet.
   * @param extensionId - The extension ID of the Phantom extension. Optional if no interaction with the dapp is required.
   *
   * @returns A new instance of the Phantom class.
   */
  constructor(
    /**
     * The password of the Phantom wallet.
     */
    readonly password: string,
    /**
     * The extension ID of the Phantom extension. Optional if no interaction with the dapp is required.
     */
    readonly extensionId?: string
  ) {
    this.password = password
    this.extensionId = extensionId
  }

  /**
   * Imports a wallet using the given seed phrase.
   *
   * @param seedPhrase - The seed phrase to import.
   */
  abstract importWallet(seedPhrase: string): void

  /**
   * Adds a new account with the given name. This account is based on the initially imported seed phrase.
   *
   * @param accountName - The name of the new account.
   */
  abstract addNewAccount(accountName: string): void

  /**
   * Imports a wallet using the given private key.
   * @param privateKey - The private key to import.
   */
  abstract importWalletFromPrivateKey(privateKey: string): void

  /**
   * Imports a wallet using the given Mnemonic Phrase.
   * @param seedPhrase - The private key to import.
   */
  abstract importWalletFromMnemonicPhrase(seedPhrase: string): Promise<void>

  /**
   * Switches to the account with the given name.
   *
   * @param accountName - The name of the account to switch to.
   */
  abstract switchAccount(accountName: string): void

  /**
   * Retrieves the current account address.
   */
  abstract getAccountAddress(): void

  /**
   * Connects to the dapp using the currently selected account.
   */
  abstract connectToDapp(account?: string): void

  /**
   * Get's the prompt popup. This is useful for situations where simulated transactions fail
   * and we need to assert that the "Confirm" button is not disabled due to an error during the
   * simulation of the transaction.
   */
  abstract getPromptPage(): Promise<Page>

  /**
   * Locks Phantom.
   */
  abstract lock(): void

  /**
   * Unlocks Phantom.
   */
  abstract unlock(): void

  /**
   * Confirms a signature request. This function supports all types of commonly used signatures.
   */
  abstract confirmSignature(): void

  /**
   * Rejects a signature request. This function supports all types of commonly used signatures.
   */
  abstract rejectSignature(): void

  /**
   * Confirms a transaction request.
   *
   * @param options - The transaction options.
   * @param options.gasSetting - The gas setting to use for the transaction.
   */
  abstract confirmTransaction(): void

  /**
   * Rejects a transaction request.
   */
  abstract rejectTransaction(): void

  /**
   * Navigates to the home page of Phantom tab.
   */
  abstract goToHomePage(): void

  /**
   * Goes back to the home page of Phantom tab.
   */
  abstract goBackToHomePage(): void

  /**
   * Opens the settings page.
   */
  abstract openSettings(): void

  /**
   * Toggles the "Show Test Networks" setting.
   *
   * ::: warning
   * This function requires the correct menu to be already opened.
   * :::
   */
  abstract toggleNetworkMode(networMode: NetworkMode): void
}
