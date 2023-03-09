// trunk-ignore(eslint)
declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Connect playwright with Cypress instance
     * @example
     * cy.initPlaywright()
     */
    initPlaywright(): Chainable<Subject>;
    /**
     * Assign currently open tabs with playwright
     * @example
     * cy.assignWindows()
     */
    assignWindows(): Chainable<Subject>;
    /**
     * Assigns currently active tab
     * @example
     * cy.assignActiveTabName('tabName')
     */
    assignActiveTabName(): Chainable<Subject>;
    /**
     * Checks if current active tab is metamask
     * @example
     * cy.isMetamaskWindowActive()
     */
    isMetamaskWindowActive(): Chainable<Subject>;
    /**
     * Checks if current active tab is cypress
     * @example
     * cy.isCypressWindowActive()
     */
    isCypressWindowActive(): Chainable<Subject>;
    /**
     * Switch to Cypress window
     * @example
     * cy.switchToCypressWindow()
     */
    switchToCypressWindow(): Chainable<Subject>;
    /**
     * Switch to metamask window
     * @example
     * cy.switchToMetamaskWindow()
     */
    switchToMetamaskWindow(): Chainable<Subject>;
    /**
     * Switch to metamask notification window
     * @example
     * cy.switchToMetamaskNotification()
     */
    switchToMetamaskNotification(): Chainable<Subject>;
    /**
     * Get current network
     * @example
     * cy.getNetwork()
     */
    getNetwork(): Chainable<Subject>;
    /**
     * Add network in metamask (and also switch to the newly added network)
     * @example
     * cy.addMetamaskNetwork({networkName: 'name', rpcUrl: 'https://url', chainId: '1', symbol: 'ETH', blockExplorer: 'https://url', isTestnet: true})
     */
    addMetamaskNetwork(network: object): Chainable<Subject>;
    /**
     * Change network in metamask
     * @example
     * cy.changeMetamaskNetwork('goerli')
     * cy.changeMetamaskNetwork('custom network')
     * cy.changeMetamaskNetwork({networkName: 'name'})
     */
    changeMetamaskNetwork(network: string): Chainable<Subject>;
    /**
     * Import new account in metamask using private key
     * @example
     * cy.importMetamaskAccount('private_key')
     */
    importMetamaskAccount(privateKey: string): Chainable<Subject>;
    /**
     * Create new account in metamask
     * @example
     * cy.createMetamaskAccount()
     * cy.createMetamaskAccount('accountName')
     */
    createMetamaskAccount(accountName?: string): Chainable<Subject>;
    /**
     * Switch metamask account
     * @example
     * cy.switchMetamaskAccount(2)
     * cy.switchMetamaskAccount('Account 2')
     */
    switchMetamaskAccount(
      accountNameOrAccountNumber: string | number,
    ): Chainable<Subject>;
    /**
     * Get current wallet address of metamask wallet
     * @example
     * cy.getMetamaskWalletAddress().then(address => cy.log(address))
     */
    getMetamaskWalletAddress(): Chainable<Subject>;
    /**
     * Activate ability (in metamask settings) to specify custom gas price and limit while doing transactions in metamask
     * @example
     * cy.activateAdvancedGasControlInMetamask()
     */
    activateAdvancedGasControlInMetamask(
      skipSetup?: boolean,
    ): Chainable<Subject>;
    /**
     * Activate ability (in metamask settings) to show hex data while doing transaction in metamask
     * @example
     * cy.activateShowHexDataInMetamask()
     */
    activateShowHexDataInMetamask(skipSetup?: boolean): Chainable<Subject>;
    /**
     * Activate ability (in metamask settings) to show fiat conversions on testnets in metamask
     * @example
     * cy.activateTestnetConversionInMetamask()
     */
    activateTestnetConversionInMetamask(
      skipSetup?: boolean,
    ): Chainable<Subject>;
    /**
     * Activate ability (in metamask settings) to show testnet networks in metamask
     * @example
     * cy.activateShowTestnetNetworksInMetamask()
     */
    activateShowTestnetNetworksInMetamask(
      skipSetup?: boolean,
    ): Chainable<Subject>;
    /**
     * Activate ability (in metamask settings) to specify custom nonce while doing transactions in metamask
     * @example
     * cy.activateCustomNonceInMetamask()
     */
    activateCustomNonceInMetamask(skipSetup?: boolean): Chainable<Subject>;
    /**
     * Activate ability (in metamask settings) to dismiss secret recovery phrase reminder in metamask
     * @example
     * cy.activateDismissBackupReminderInMetamask()
     */
    activateDismissBackupReminderInMetamask(
      skipSetup?: boolean,
    ): Chainable<Subject>;
    /**
     * Activate eth sign requests in metamask settings
     * @example
     * cy.activateEthSignRequestsInMetamask()
     */
    activateEthSignRequestsInMetamask(skipSetup?: boolean): Chainable<Subject>;
    /**
     * Activate improved token allowance in metamask settings (experimental)
     * @example
     * cy.activateImprovedTokenAllowanceInMetamask()
     */
    activateImprovedTokenAllowanceInMetamask(
      skipSetup?: boolean,
    ): Chainable<Subject>;
    /**
     * Reset metamask account state in settings
     * @example
     * cy.resetMetamaskAccount()
     */
    resetMetamaskAccount(): Chainable<Subject>;
    /**
     * Disconnects metamask wallet from last connected dapp
     * @example
     * cy.disconnectMetamaskWalletFromDapp()
     */
    disconnectMetamaskWalletFromDapp(): Chainable<Subject>;
    /**
     * Disconnects metamask wallet from all connected dapps
     * @example
     * cy.disconnectMetamaskWalletFromAllDapps()
     */
    disconnectMetamaskWalletFromAllDapps(): Chainable<Subject>;
    /**
     * Confirm metamask permission to sign message
     * @example
     * cy.confirmMetamaskSignatureRequest()
     */
    confirmMetamaskSignatureRequest(): Chainable<Subject>;
    /**
     * Confirm metamask permission to sign Data message
     * @example
     * cy.confirmMetamaskDataSignatureRequest()
     */
    confirmMetamaskDataSignatureRequest(): Chainable<Subject>;
    /**
     * Reject metamask permission to sign message
     * @example
     * cy.rejectMetamaskSignatureRequest()
     */
    rejectMetamaskSignatureRequest(): Chainable<Subject>;
    /**
     * Confirm metamask request for public encryption key
     * @example
     * cy.confirmMetamaskEncryptionPublicKeyRequest()
     */
    confirmMetamaskEncryptionPublicKeyRequest(): Chainable<Subject>;
    /**
     * Reject metamask request for public encryption key
     * @example
     * cy.rejectMetamaskEncryptionPublicKeyRequest()
     */
    rejectMetamaskEncryptionPublicKeyRequest(): Chainable<Subject>;
    /**
     * Confirm metamask request to decrypt message with private key
     * @example
     * cy.confirmMetamaskDecryptionRequest()
     */
    confirmMetamaskDecryptionRequest(): Chainable<Subject>;
    /**
     * Reject metamask request to decrypt message with private key
     * @example
     * cy.rejectMetamaskDecryptionRequest()
     */
    rejectMetamaskDecryptionRequest(): Chainable<Subject>;
    /**
     * Reject metamask permission to sign Data message
     * @example
     * cy.rejectMetamaskDataSignatureRequest()
     */
    rejectMetamaskDataSignatureRequest(): Chainable<Subject>;
    /**
     * Add custom token to metamask
     * @example
     * cy.importMetamaskToken('0x509ee0d083ddf8ac028f2a56731412edd63223b9')
     * cy.importMetamaskToken({ address: '0x509ee0d083ddf8ac028f2a56731412edd63223b9', symbol: 'USDT'})
     */
    importMetamaskToken(tokenConfig?: object | string): Chainable<Subject>;
    /**
     * Confirm metamask request to add token
     * @example
     * cy.confirmMetamaskAddToken()
     */
    confirmMetamaskAddToken(): Chainable<Subject>;
    /**
     * Reject metamask request to add token
     * @example
     * cy.rejectMetamaskAddToken()
     */
    rejectMetamaskAddToken(): Chainable<Subject>;
    /**
     * Confirm metamask permission to spend asset
     * @example
     * cy.confirmMetamaskPermissionToSpend()
     * cy.confirmMetamaskPermissionToSpend('999999999')
     */
    confirmMetamaskPermissionToSpend(spendLimit?: string): Chainable<Subject>;
    /**
     * Reject metamask permission to spend asset
     * @example
     * cy.rejectMetamaskPermissionToSpend()
     */
    rejectMetamaskPermissionToSpend(): Chainable<Subject>;
    /**
     * Accept metamask access request
     * @example
     * cy.acceptMetamaskAccess()
     * cy.acceptMetamaskAccess({allAccounts: true, signInSignature: true})
     */
    acceptMetamaskAccess(options?: {
      allAccounts?: boolean;
      signInSignature?: boolean;
    }): Chainable<Subject>;
    /**
     * Confirm metamask transaction (auto-detects eip-1559 and legacy transactions)
     * @example
     * cy.confirmMetamaskTransaction()
     * cy.confirmMetamaskTransaction({ gasLimit: 1000000, baseFee: 20, priorityFee: 20 }) // eip-1559
     * cy.confirmMetamaskTransaction({ gasLimit: 1000000, gasPrice: 20 }) // legacy
     * cy.confirmMetamaskTransaction('aggressive') // eip-1559 only! => available options: 'low', 'market', 'aggressive', 'site' (site is usually by default)
     */
    confirmMetamaskTransaction(gasConfig?: object | string): Chainable<Subject>;
    /**
     * Reject metamask transaction
     * @example
     * cy.rejectMetamaskTransaction()
     */
    rejectMetamaskTransaction(): Chainable<Subject>;
    /**
     * Allow site to add new network in metamask
     * @example
     * cy.allowMetamaskToAddNetwork()
     * cy.allowMetamaskToAddNetwork('close') // (waitForEvent)
     */
    allowMetamaskToAddNetwork(waitForEvent?: string): Chainable<Subject>;
    /**
     * Reject site to add new network in metamask
     * @example
     * cy.rejectMetamaskToAddNetwork()
     */
    rejectMetamaskToAddNetwork(): Chainable<Subject>;
    /**
     * Allow site to switch network in metamask
     * @example
     * cy.allowMetamaskToSwitchNetwork()
     */
    allowMetamaskToSwitchNetwork(): Chainable<Subject>;
    /**
     * Reject site to switch network in metamask
     * @example
     * cy.rejectMetamaskToSwitchNetwork()
     */
    rejectMetamaskToSwitchNetwork(): Chainable<Subject>;
    /**
     * Allow site to add new network in metamask and switch to it
     * @example
     * cy.allowMetamaskToAddAndSwitchNetwork()
     */
    allowMetamaskToAddAndSwitchNetwork(): Chainable<Subject>;
    /**
     * Unlock metamask
     * @example
     * cy.unlockMetamask('password')
     */
    unlockMetamask(password: string): Chainable<Subject>;
    /**
     * Fetches previous metamask wallet address
     * @example
     * cy.fetchMetamaskWalletAddress().then(address => cy.log(address))
     */
    fetchMetamaskWalletAddress(): Chainable<Subject>;
    /**
     * Run the flow for metamask setup
     * @example
     * cy.setupMetamask() // will use defaults
     * cy.setupMetamask('secret, words, ...', 'goerli', 'password for metamask')
     * cy.setupMetamask('secret, words, ...', {networkName: 'name', rpcUrl: 'https://url', chainId: 1, symbol: 'ETH', blockExplorer: 'https://url', isTestnet: true}, 'password for metamask')
     * cy.setupMetamask('private_key', 'goerli', 'password for metamask')
     * cy.setupMetamask('private_key', {networkName: 'name', rpcUrl: 'https://url', chainId: 1, symbol: 'ETH', blockExplorer: 'https://url', isTestnet: true}, 'password for metamask')
     */
    setupMetamask(
      secretWordsOrPrivateKey?: string,
      network?: string | object,
      password?: string,
      enableAdvancedSettings?: boolean,
      enableExperimentalSettings?: boolean,
    ): Chainable<Subject>;
    /**
     * Execute settle on Exchanger contract
     * @example
     * cy.snxExchangerSettle('sETH', '0x...', '123123123123123123...')
     */
    snxExchangerSettle(
      asset: string,
      walletAddress: string,
      privateKey: string,
    ): Chainable<Subject>;
    /**
     * Check waiting period on Exchanger contract
     * @example
     * cy.snxCheckWaitingPeriod('sETH', '0x...')
     */
    snxCheckWaitingPeriod(
      asset: string,
      walletAddress: string,
    ): Chainable<Subject>;
    /**
     * Get transaction status from Etherscan API
     * @example
     * cy.etherscanGetTransactionStatus('0xf..')
     */
    etherscanGetTransactionStatus(txid: string): Chainable<Subject>;
    /**
     * Wait until transaction is success using Etherscan API
     * @example
     * cy.etherscanWaitForTxSuccess('0xf..')
     */
    etherscanWaitForTxSuccess(txid: string): Chainable<Subject>;
    /**
     * Wait until all XHR requests are finished (networkidle0)
     * @example
     * cy.waitForResources()
     * cy.waitForResources([{name:"fa-solid-900.woff2"}])
     * cy.waitForResources([{name:"fonts.gstatic.com/s/worksans",number:2}])
     */
    waitForResources(
      resources?: Array<{ name: string; number?: number }>,
    ): Chainable<Subject>;
    /**
     * Assert that element top is within viewport
     * @example
     * cy.get('selector').topIsWithinViewport()
     * cy.get('selector').topIsWithinViewport(800)
     */
    topIsWithinViewport(viewportWidth: number): Chainable<Subject>;
    /**
     * Assert that element is within viewport
     * @example
     * cy.get('selector').isWithinViewport()
     * cy.get('selector').isWithinViewport(800, 600)
     */
    isWithinViewport(
      viewportWidth: number,
      viewportHeight: number,
    ): Chainable<Subject>;
  }
}
