declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Connect puppeteer with Cypress instance
     * @example
     * cy.initPuppeteer()
     */
    initPuppeteer(): Chainable<Subject>;
    /**
     * Assign currently open tabs with puppeteer
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
     * Checks if current active tab is blank
     * @example
     * cy.isBlankWindowActive()
     */
    isBlankWindowActive(): Chainable<Subject>;
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
     * Switch to blank window
     * @example
     * cy.switchToBlankWindow()
     */
    switchToBlankWindow(): Chainable<Subject>;
    /**
     * Switch to blank notification window
     * @example
     * cy.switchToBlankNotification()
     */
    switchToBlankNotification(): Chainable<Subject>;
    /**
     * Get current network
     * @example
     * cy.getNetwork()
     */
    getNetwork(): Chainable<Subject>;
    /**
     * Get current network
     * @example
     * cy.getNetwork()
     */
    getCurrentNetwork(): Chainable<Subject>;
    /**
     * Add network in blank
     * @example
     * cy.addBlankNetwork({networkName: 'name', rpcUrl: 'https://url', chainId: '1', symbol: 'ETH', blockExplorer: 'https://url', isTestnet: true})
     */
    addBlankNetwork(network: object): Chainable<Subject>;
    /**
     * Change network in blank
     * @example
     * cy.changeBlankNetwork('kovan')
     * cy.changeBlankNetwork('custom network')
     * cy.changeBlankNetwork({networkName: 'name'})
     */
    changeBlankNetwork(network: string): Chainable<Subject>;
    /**
     * Import new account in blank using private key
     * @example
     * cy.importBlankAccount('private_key')
     */
    importBlankAccount(privateKey: string): Chainable<Subject>;
    /**
     * Create new account in blank
     * @example
     * cy.createBlankAccount()
     * cy.createBlankAccount('accountName')
     */
    createBlankAccount(accountName: string | undefined): Chainable<Subject>;
    /**
     * Switch blank account
     * @example
     * cy.switchBlankAccount(2)
     * cy.switchBlankAccount('Account 2')
     */
    switchBlankAccount(
      accountNameOrAccountNumber: string | number,
    ): Chainable<Subject>;
    /**
     * Gets the last transaction Id done by the current Account. 
     * Returns empty if the last activity is not a transaction or there no activities
     * @example
     * cy.getLastTransactionId()
    */
    getLastTransactionId(): Chainable<Subject>;
    /**
     * Sends an ETH transaction from the current account to the given account name and transaction amount.
     * Returns the transaction Id.
     * @example
     * cy.sendTransaction('Account 2','0.1')
    */
    sendTransaction(accountName:string,amount:string): Chainable<Subject>;
    /**
     * Get current wallet address of blank wallet
     * @example
     * cy.getBlankWalletAddress().then(address => cy.log(address))
     */
    getBlankWalletAddress(): Chainable<Subject>;
    /**
   * Get current account name of blank wallet
   * @example
   * cy.getBlankAccountName().then(address => cy.log(address))
   */
    getBlankAccountName(): Chainable<Subject>;
    /**
     * Activate ability (in blank settings) to specify custom nonce while doing transactions in blank
     * @example
     * cy.activateCustomNonceInBlank()
     */
    activateCustomNonceInBlank(): Chainable<Subject>;
    /**
     * Reset blank account state in settings
     * @example
     * cy.resetBlankAccount()
     */
    resetBlankAccount(): Chainable<Subject>;
    /**
     * Disconnects blank wallet from last connected dapp
     * @example
     * cy.disconnectBlankWalletFromDapp()
     */
    disconnectBlankWalletFromDapp(): Chainable<Subject>;
    /**
     * Disconnects blank wallet from all connected dapps
     * @example
     * cy.disconnectBlankWalletFromAllDapps()
     */
    disconnectBlankWalletFromAllDapps(): Chainable<Subject>;
    /**
     * Confirm blank permission to sign message
     * @example
     * cy.confirmBlankSignatureRequest()
     */
    confirmBlankSignatureRequest(): Chainable<Subject>;
    /**
     * Reject blank permission to sign message
     * @example
     * cy.rejectBlankSignatureRequest()
     */
    rejectBlankSignatureRequest(): Chainable<Subject>;
    /**
     * Confirm blank permission to spend asset
     * @example
     * cy.confirmBlankPermissionToSpend()
     */
    confirmBlankPermissionToSpend(): Chainable<Subject>;
    /**
     * Reject blank permission to spend asset
     * @example
     * cy.rejectBlankPermissionToSpend()
     */
    rejectBlankPermissionToSpend(): Chainable<Subject>;
    /**
     * Accept blank access request
     * @example
     * cy.acceptBlankAccess()
     */
    acceptBlankAccess(): Chainable<Subject>;
    /**
     * Confirm blank atransaction
     * @example
     * cy.confirmBlankTransaction()
     * cy.confirmBlankTransaction({gasFee: 10, gasLimit: 1000000})
     */
    confirmBlankTransaction(gasConfig : object | undefined): Chainable<Subject>;
    /**
     * Reject blank transaction
     * @example
     * cy.rejectBlankTransaction()
     */
    rejectBlankTransaction(): Chainable<Subject>;
    /**
     * Allow site to add new network in blank
     * @example
     * cy.allowBlankToAddNetwork()
     */
    allowBlankToAddNetwork(): Chainable<Subject>;
    /**
     * Reject site to add new network in blank
     * @example
     * cy.rejectBlankToAddNetwork()
     */
    rejectBlankToAddNetwork(): Chainable<Subject>;
    /**
     * Allow site to switch network in blank
     * @example
     * cy.allowBlankToSwitchNetwork()
     */
    allowBlankToSwitchNetwork(): Chainable<Subject>;
    /**
     * Reject site to switch network in blank
     * @example
     * cy.rejectBlankToSwitchNetwork()
     */
    rejectBlankToSwitchNetwork(): Chainable<Subject>;
    /**
     * Allow site to add new network in blank and switch to it
     * @example
     * cy.allowBlankToAddAndSwitchNetwork()
     */
    allowBlankToAddAndSwitchNetwork(): Chainable<Subject>;
    /**
     * Unlock blank
     * @example
     * cy.unlockBlank('password')
     */
    unlockBlank(password: string): Chainable<Subject>;
    /**
     * Fetches previous blank wallet address
     * @example
     * cy.fetchBlankWalletAddress().then(address => cy.log(address))
     */
    fetchBlankWalletAddress(): Chainable<Subject>;
    /**
     * Run the flow for blank setup
     * @example
     * cy.setupBlank('secret, words, ...', 'kovan', 'password for blank')
     * cy.setupBlank('secret, words, ...', {networkName: 'name', rpcUrl: 'https://url', chainId: 1, symbol: 'ETH', blockExplorer: 'https://url', isTestnet: true}, 'password for blank')
     * cy.setupBlank('private_key', 'kovan', 'password for blank')
     * cy.setupBlank('private_key', {networkName: 'name', rpcUrl: 'https://url', chainId: 1, symbol: 'ETH', blockExplorer: 'https://url', isTestnet: true}, 'password for blank')
     */
    setupBlank(
      secretWordsOrPrivateKey: string,
      network: string | object,
      password: string,
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
     * Get the lasts 10 transactions for the given from Etherscan API
     * @example
     * cy.etherscanGetAccountTransactions('0xf..')
     */
    etherscanGetAccountTransactions(accountAddress:string): Chainable<Subject>;
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
      resources: Array<{ name: string; number?: number }> | undefined,
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
