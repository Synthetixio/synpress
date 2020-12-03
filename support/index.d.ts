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
     * Change network in metamask
     * @example
     * cy.changeMetamaskNetwork('rinkeby')
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
     * Run the flow for metamask setup
     * @example
     * cy.setupMetamask('secret, words, ...', 'rinkeby', 'password for metamask')
     */
    setupMetamask(secretWords, network, password): Chainable<Subject>;
    /**
     * Fetches previous metamask wallet address
     * @example
     * cy.fetchMetamaskWalletAddress().then(address => cy.log(address))
     */
    fetchMetamaskWalletAddress(): Chainable<Subject>;
  }
}
