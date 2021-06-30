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
     * Confirms metamask welcome page
     * @example
     * cy.confirmMetamaskWelcomePage()
     */
    confirmMetamaskWelcomePage(): Chainable<Subject>;
    /**
     * Import metamask wallet using secret words
     * @example
     * cy.importMetamaskWallet('secret, words, ...', 'password for metamask')
     */
    importMetamaskWallet(
      secretWords: string,
      password: string,
    ): Chainable<Subject>;
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
     * Accept metamask access request
     * @example
     * cy.acceptMetamaskAccess()
     */
    acceptMetamaskAccess(): Chainable<Subject>;
      /**
     * Disconnects metamask
     * @example
     * cy.disconnectMetamask()
     */
    disconnectMetamask(): Chainable<Subject>;
    /**
     * Reject metamask access request
     * @example
     * cy.rejectMetamaskAccess()
     */
    rejectMetamaskAccess(): Chainable<Subject>;
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
     */
    setupMetamask(
      secretWords: string,
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
  }
}
