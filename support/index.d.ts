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
     * Add network in metamask
     * @example
     * cy.addMetamaskNetwork({networkName: 'name', rpcUrl: 'https://url', chainId: '1', symbol: 'ETH', blockExplorer: 'https://url', isTestnet: true})
     */
    addMetamaskNetwork(network: object): Chainable<Subject>;
    /**
     * Change network in metamask
     * @example
     * cy.changeMetamaskNetwork('kovan')
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
    createMetamaskAccount(accountName: string | undefined): Chainable<Subject>;
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
     * Activate ability (in metamask settings) to specify custom nonce while doing transactions in metamask
     * @example
     * cy.activateCustomNonceInMetamask()
     */
    activateCustomNonceInMetamask(): Chainable<Subject>;
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
     * Confirm metamask permission to sign typed data
     * @example
     * cy.confirmMetamaskSignTypedData()
     */
     confirmMetamaskSignTypedData(): Chainable<Subject>;
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
     * Confirm metamask permission to spend asset
     * @example
     * cy.confirmMetamaskPermissionToSpend()
     */
    confirmMetamaskPermissionToSpend(): Chainable<Subject>;
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
     * cy.acceptMetamaskAccess(true)
     */
    acceptMetamaskAccess(allAccounts: boolean | undefined): Chainable<Subject>;
    /**
     * Confirm metamask atransaction
     * @example
     * cy.confirmMetamaskTransaction()
     * cy.confirmMetamaskTransaction({gasFee: 10, gasLimit: 1000000})
     */
    confirmMetamaskTransaction(gasConfig : object | undefined): Chainable<Subject>;
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
     */
    allowMetamaskToAddNetwork(): Chainable<Subject>;
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
     * cy.setupMetamask('secret, words, ...', 'kovan', 'password for metamask')
     * cy.setupMetamask('secret, words, ...', {networkName: 'name', rpcUrl: 'https://url', chainId: 1, symbol: 'ETH', blockExplorer: 'https://url', isTestnet: true}, 'password for metamask')
     * cy.setupMetamask('private_key', 'kovan', 'password for metamask')
     * cy.setupMetamask('private_key', {networkName: 'name', rpcUrl: 'https://url', chainId: 1, symbol: 'ETH', blockExplorer: 'https://url', isTestnet: true}, 'password for metamask')
     */
    setupMetamask(
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
