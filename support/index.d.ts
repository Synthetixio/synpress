declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Get the most popular desktop resolutions
     * @example
     * cy.getDesktopSizes()
     */
    getDesktopSizes(): Chainable<Subject>;
    /**
     * Get the most popular tablet resolutions
     * @example
     * cy.getTabletSizes()
     */
    getTabletSizes(): Chainable<Subject>;
    /**
     * Get the most popular mobile resolutions
     * @example
     * cy.getMobileSizes()
     */
    getMobileSizes(): Chainable<Subject>;
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
     * Get current network
     * @example
     * cy.getNetwork()
     */
    getNetwork(): Chainable<Subject>;
    /**
     * Add network in metamask
     * @example
     * cy.addMetamaskNetwork({networkName: 'name', rpcUrl: 'https://url', chainId: 1, symbol: 'ETH', blockExplorer: 'https://url', isTestnet: true})
     */
    addMetamaskNetwork(object): Chainable<Subject>;
    /**
     * Change network in metamask
     * @example
     * cy.changeMetamaskNetwork('kovan')
     * cy.changeMetamaskNetwork('networkName')
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
     * Get current wallet address of metamask wallet
     * @example
     * cy.getMetamaskWalletAddress().then(address => cy.log(address))
     */
    getMetamaskWalletAddress(): Chainable<Subject>;
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
     * Reject metamask permission to sign message
     * @example
     * cy.rejectMetamaskSignatureRequest()
     */
    rejectMetamaskSignatureRequest(): Chainable<Subject>;
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
     */
    acceptMetamaskAccess(): Chainable<Subject>;
    /**
     * Confirm metamask atransaction
     * @example
     * cy.confirmMetamaskTransaction()
     */
    confirmMetamaskTransaction(): Chainable<Subject>;
    /**
     * Reject metamask transaction
     * @example
     * cy.rejectMetamaskTransaction()
     */
    rejectMetamaskTransaction(): Chainable<Subject>;
    /**
     * Switch to metamask notification window
     * @example
     * cy.switchToMetamaskNotification()
     */
    switchToMetamaskNotification(): Chainable<Subject>;
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
  }
}
