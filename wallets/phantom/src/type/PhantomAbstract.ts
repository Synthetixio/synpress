import type { GasSettings } from './GasSettings'
import type { Networks } from './Networks'

export abstract class PhantomAbstract {
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
   *
   * @param privateKey - The private key to import.
   */
  abstract importWalletFromPrivateKey(network: Networks, privateKey: string, walletName?: string): void

  /**
   * Switches to the account with the given name.
   *
   * @param accountName - The name of the account to switch to.
   */
  abstract switchAccount(accountName: string): void

  /**
   * Retrieves the current account address.
   */
  abstract getAccountAddress(network: Networks): void

  /**
   * Connects to the dapp using the currently selected account.
   */
  abstract connectToDapp(account?: string): void

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
   * Confirms a signature request with potential risk.
   */
  abstract confirmSignatureWithRisk(): void

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
  abstract confirmTransaction(options?: { gasSetting?: GasSettings }): void

  /**
   * Rejects a transaction request.
   */
  abstract rejectTransaction(): void

  /**
   * Approves a permission request to spend tokens.
   *
   * ::: warning
   * For NFT approvals, use `confirmTransaction` method.
   * :::
   *
   * @param options - The permission options.
   * @param options.spendLimit - The spend limit to use for the permission.
   * @param options.gasSetting - The gas setting to use for the approval transaction.
   */
  abstract approveTokenPermission(options?: {
    spendLimit?: 'max' | number
    gasSetting?: GasSettings
  }): void

  /**
   * Rejects a permission request to spend tokens.
   *
   * ::: warning
   * For NFT approvals, use `confirmTransaction` method.
   * :::
   */
  abstract rejectTokenPermission(): void

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
  abstract toggleTestnetMode(): void

  /**
   * Resets the account.
   *
   * ::: warning
   * This function requires the correct menu to be already opened.
   * :::
   */
  abstract resetApp(): void
}
