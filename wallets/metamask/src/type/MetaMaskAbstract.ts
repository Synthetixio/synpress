import { SettingsSidebarMenus } from '../selectors/pages/HomePage/settings'
import type { GasSettings } from './GasSettings'
import type { Network } from './Network'

export abstract class MetaMaskAbstract {
  /**
   * @param password - The password of the MetaMask wallet.
   * @param extensionId - The extension ID of the MetaMask extension. Optional if no interaction with the dapp is required.
   *
   * @returns A new instance of the MetaMask class.
   */
  constructor(
    /**
     * The password of the MetaMask wallet.
     */
    readonly password: string,
    /**
     * The extension ID of the MetaMask extension. Optional if no interaction with the dapp is required.
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
  abstract importWalletFromPrivateKey(privateKey: string): void

  /**
   * Switches to the account with the given name.
   *
   * @param accountName - The name of the account to switch to.
   */
  abstract switchAccount(accountName: string): void

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
  abstract addNetwork(network: Network): void

  /**
   * Retrieves the current account address.
   */
  abstract getAccountAddress(): void

  /**
   * Switches to the network with the given name.
   *
   * @param networkName - The name of the network to switch to.
   * @param isTestnet - If switch to a test network.
   */
  abstract switchNetwork(networkName: string, isTestnet: boolean): void

  /**
   * Connects to the dapp using the currently selected account.
   */
  abstract connectToDapp(accounts?: string[]): void

  /**
   * Locks MetaMask.
   */
  abstract lock(): void

  /**
   * Unlocks MetaMask.
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
   * Approves a new network request.
   */
  abstract approveNewNetwork(): void

  /**
   * Rejects a new network request.
   */
  abstract rejectNewNetwork(): void

  /**
   * Approves a switch network request.
   */
  abstract approveSwitchNetwork(): void

  /**
   * Rejects a switch network request.
   */
  abstract rejectSwitchNetwork(): void

  /**
   * Approves a new RPC provider request.
   */
  abstract approveNewEthereumRPC(): void

  /**
   * Rejects a new RPC provider request.
   */
  abstract rejectNewEthereumRPC(): void

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
   * Goes back to the home page of MetaMask tab.
   */
  abstract goBackToHomePage(): void

  /**
   * Opens the settings page.
   */
  abstract openSettings(): void

  /**
   * Opens a given menu in the sidebar.
   *
   * @param menu - The menu to open.
   */
  abstract openSidebarMenu(menu: SettingsSidebarMenus): void
  /**
   * Toggles the "Show Test Networks" setting.
   *
   * ::: warning
   * This function requires the correct menu to be already opened.
   * :::
   */
  abstract toggleShowTestNetworks(): void

  /**
   * Toggles the "Dismiss Secret Recovery Phrase Reminder" setting.
   *
   * ::: warning
   * This function requires the correct menu to be already opened.
   * :::
   */
  abstract toggleDismissSecretRecoveryPhraseReminder(): void

  /**
   * Resets the account.
   *
   * ::: warning
   * This function requires the correct menu to be already opened.
   * :::
   */
  abstract resetAccount(): void

  /**
   * Enables the eth_sign feature in MetaMask advanced settings.
   * This method is marked as unsafe because enabling eth_sign can have security implications.
   */
  abstract unsafe_enableEthSign(): void

  /**
   * Disables the eth_sign feature in MetaMask advanced settings.
   */
  abstract disableEthSign(): void

  abstract addNewToken(): void

  abstract providePublicEncryptionKey(): void

  abstract decrypt(): void

  /// -------------------------------------------
  /// ---------- EXPERIMENTAL FEATURES ----------
  /// -------------------------------------------

  /**
   * Confirms a transaction request and waits for the transaction to be mined.
   * This function utilizes the "Activity" tab of the MetaMask tab.
   *
   * @param options - The transaction options.
   * @param options.gasSetting - The gas setting to use for the transaction.
   *
   * @experimental
   * @group Experimental Methods
   */
  abstract confirmTransactionAndWaitForMining(options?: {
    gasSetting?: GasSettings
  }): void

  /**
   * Opens the transaction details.
   *
   * @param txIndex - The index of the transaction in the "Activity" tab. Starts from `0`.
   *
   * @experimental
   * @group Experimental Methods
   */
  abstract openTransactionDetails(txIndex: number): void

  /**
   * Closes the currently opened transaction details.
   *
   * @experimental
   * @group Experimental Methods
   */
  abstract closeTransactionDetails(): void
}
