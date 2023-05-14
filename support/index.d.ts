declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Connect playwright with Cypress instance
     * @example
     * cy.initPlaywright()
     */
    initPlaywright(): Chainable<boolean>;
    /**
     * Assign currently open tabs with playwright
     * @example
     * cy.assignWindows()
     */
    assignWindows(): Chainable<boolean>;
    /**
     * Assigns currently active tab
     * @example
     * cy.assignActiveTabName('tabName')
     */
    assignActiveTabName(tabName: string): Chainable<boolean>;
    /**
     * Checks if current active tab is metamask
     * @example
     * cy.isMetamaskWindowActive()
     */
    isMetamaskWindowActive(): Chainable<boolean>;
    /**
     * Checks if current active tab is cypress
     * @example
     * cy.isCypressWindowActive()
     */
    isCypressWindowActive(): Chainable<boolean>;
    /**
     * Switch to Cypress window
     * @example
     * cy.switchToCypressWindow()
     */
    switchToCypressWindow(): Chainable<boolean>;
    /**
     * Switch to metamask window
     * @example
     * cy.switchToMetamaskWindow()
     */
    switchToMetamaskWindow(): Chainable<boolean>;
    /**
     * Switch to metamask notification window
     * @example
     * cy.switchToMetamaskNotification()
     */
    switchToMetamaskNotification(): Chainable<boolean>;
    /**
     * Get current network
     * @example
     * cy.getCurrentNetwork()
     */
    getCurrentNetwork(): Chainable<Subject>;
    /**
     * Add network in metamask (and also switch to the newly added network)
     * List of available presets for networks: https://github.com/wagmi-dev/references/tree/main/packages/chains#chains
     * If preset for your custom chain is not available, you can add custom network by yourself.
     * @example
     * cy.addMetamaskNetwork('optimism') // works only if chain is available as preset
     * cy.addMetamaskNetwork({name: 'optimism', rpcUrl: 'https://mainnet.optimism.io', chainId: 10, symbol: 'oETH', blockExplorer: 'https://https://optimistic.etherscan.io', isTestnet: false})
     * cy.addMetamaskNetwork({id: 10, name: 'optimism', nativeCurrency: { symbol: 'OP' }, rpcUrls: { default: { http: ['https://mainnet.optimism.io'] } }, testnet: false })
     */
    addMetamaskNetwork(
      network:
        | string
        | {
            networkName: string;
            rpcUrl: string;
            chainId: number;
            symbol?: string;
            blockExplorer?: string;
            isTestnet: boolean;
          },
    ): Chainable<boolean>;
    /**
     * Change network in metamask (if network is not present, it will be added)
     * List of available presets for networks: https://github.com/wagmi-dev/references/tree/main/packages/chains#chains
     * If preset for your custom chain is not available, you can add custom network by yourself with `cy.addMetamaskNetwork()`.
     * @example
     * cy.changeMetamaskNetwork('goerli')
     * cy.changeMetamaskNetwork('custom network name')
     */
    changeMetamaskNetwork(network: string): Chainable<boolean>;
    /**
     * Import new account in metamask using private key
     * @example
     * cy.importMetamaskAccount('private_key')
     */
    importMetamaskAccount(privateKey: string): Chainable<boolean>;
    /**
     * Create new account in metamask
     * @example
     * cy.createMetamaskAccount()
     * cy.createMetamaskAccount('accountName')
     */
    createMetamaskAccount(accountName?: string): Chainable<boolean>;
    /**
     * Switch metamask account
     * @example
     * cy.switchMetamaskAccount(2)
     * cy.switchMetamaskAccount('Account 2')
     */
    switchMetamaskAccount(
      accountNameOrAccountNumber: string | number,
    ): Chainable<boolean>;
    /**
     * Get current wallet address of metamask wallet
     * @example
     * cy.getMetamaskWalletAddress().then(address => cy.log(address))
     */
    getMetamaskWalletAddress(): Chainable<string>;
    /**
     * Activate ability (in metamask settings) to specify custom gas price and limit while doing transactions in metamask
     * @example
     * cy.activateAdvancedGasControlInMetamask()
     */
    activateAdvancedGasControlInMetamask(
      skipSetup?: boolean,
    ): Chainable<boolean>;
    /**
     * Activate ability (in metamask settings) to show hex data while doing transaction in metamask
     * @example
     * cy.activateShowHexDataInMetamask()
     */
    activateShowHexDataInMetamask(skipSetup?: boolean): Chainable<boolean>;
    /**
     * Activate ability (in metamask settings) to show fiat conversions on testnets in metamask
     * @example
     * cy.activateTestnetConversionInMetamask()
     */
    activateTestnetConversionInMetamask(
      skipSetup?: boolean,
    ): Chainable<boolean>;
    /**
     * Activate ability (in metamask settings) to show testnet networks in metamask
     * @example
     * cy.activateShowTestnetNetworksInMetamask()
     */
    activateShowTestnetNetworksInMetamask(
      skipSetup?: boolean,
    ): Chainable<boolean>;
    /**
     * Activate ability (in metamask settings) to specify custom nonce while doing transactions in metamask
     * @example
     * cy.activateCustomNonceInMetamask()
     */
    activateCustomNonceInMetamask(skipSetup?: boolean): Chainable<boolean>;
    /**
     * Activate ability (in metamask settings) to dismiss secret recovery phrase reminder in metamask
     * @example
     * cy.activateDismissBackupReminderInMetamask()
     */
    activateDismissBackupReminderInMetamask(
      skipSetup?: boolean,
    ): Chainable<boolean>;
    /**
     * Activate eth sign requests in metamask settings
     * @example
     * cy.activateEthSignRequestsInMetamask()
     */
    activateEthSignRequestsInMetamask(skipSetup?: boolean): Chainable<boolean>;
    /**
     * Activate improved token allowance in metamask settings (experimental)
     * @example
     * cy.activateImprovedTokenAllowanceInMetamask()
     */
    activateImprovedTokenAllowanceInMetamask(
      skipSetup?: boolean,
    ): Chainable<boolean>;
    /**
     * Reset metamask account state in settings
     * @example
     * cy.resetMetamaskAccount()
     */
    resetMetamaskAccount(): Chainable<boolean>;
    /**
     * Disconnects metamask wallet from last connected dapp
     * @example
     * cy.disconnectMetamaskWalletFromDapp()
     */
    disconnectMetamaskWalletFromDapp(): Chainable<boolean>;
    /**
     * Disconnects metamask wallet from all connected dapps
     * @example
     * cy.disconnectMetamaskWalletFromAllDapps()
     */
    disconnectMetamaskWalletFromAllDapps(): Chainable<boolean>;
    /**
     * Confirm metamask permission to sign message
     * @example
     * cy.confirmMetamaskSignatureRequest()
     */
    confirmMetamaskSignatureRequest(): Chainable<boolean>;
    /**
     * Confirm metamask permission to sign Data message
     * @example
     * cy.confirmMetamaskDataSignatureRequest()
     */
    confirmMetamaskDataSignatureRequest(): Chainable<boolean>;
    /**
     * Reject metamask permission to sign message
     * @example
     * cy.rejectMetamaskSignatureRequest()
     */
    rejectMetamaskSignatureRequest(): Chainable<boolean>;
    /**
     * Confirm metamask request for public encryption key
     * @example
     * cy.confirmMetamaskEncryptionPublicKeyRequest()
     */
    confirmMetamaskEncryptionPublicKeyRequest(): Chainable<boolean>;
    /**
     * Reject metamask request for public encryption key
     * @example
     * cy.rejectMetamaskEncryptionPublicKeyRequest()
     */
    rejectMetamaskEncryptionPublicKeyRequest(): Chainable<boolean>;
    /**
     * Confirm metamask request to decrypt message with private key
     * @example
     * cy.confirmMetamaskDecryptionRequest()
     */
    confirmMetamaskDecryptionRequest(): Chainable<boolean>;
    /**
     * Reject metamask request to decrypt message with private key
     * @example
     * cy.rejectMetamaskDecryptionRequest()
     */
    rejectMetamaskDecryptionRequest(): Chainable<boolean>;
    /**
     * Reject metamask permission to sign Data message
     * @example
     * cy.rejectMetamaskDataSignatureRequest()
     */
    rejectMetamaskDataSignatureRequest(): Chainable<boolean>;
    /**
     * Add custom token to metamask
     * @example
     * cy.importMetamaskToken('0x509ee0d083ddf8ac028f2a56731412edd63223b9')
     * cy.importMetamaskToken({ address: '0x509ee0d083ddf8ac028f2a56731412edd63223b9', symbol: 'USDT'})
     */
    importMetamaskToken(
      tokenConfig?:
        | {
            address: string;
            symbol: string;
          }
        | string,
    ): Chainable<boolean>;
    /**
     * Confirm metamask request to add token
     * @example
     * cy.confirmMetamaskAddToken()
     */
    confirmMetamaskAddToken(): Chainable<boolean>;
    /**
     * Reject metamask request to add token
     * @example
     * cy.rejectMetamaskAddToken()
     */
    rejectMetamaskAddToken(): Chainable<boolean>;
    /**
     * Confirm metamask permission to spend asset
     * @example
     * cy.confirmMetamaskPermissionToSpend()
     * cy.confirmMetamaskPermissionToSpend('999999999')
     */
    confirmMetamaskPermissionToSpend(spendLimit?: string): Chainable<string>;
    /**
     * Confirm metamask permission to access all elements (example: collectibles)
     * @example
     * cy.confirmMetamaskPermisionToApproveAll()
     */
    confirmMetamaskPermisionToApproveAll(): Chainable<boolean>;
    /**
     * Reject metamask permission to access all elements (example: collectibles)
     * @example
     * cy.rejectMetamaskPermisionToApproveAll()
     */
    rejectMetamaskPermisionToApproveAll(): Chainable<boolean>;
    /**
     * Reject metamask permission to spend asset
     * @example
     * cy.rejectMetamaskPermissionToSpend()
     */
    rejectMetamaskPermissionToSpend(): Chainable<boolean>;
    /**
     * Accept metamask access request
     * @example
     * cy.acceptMetamaskAccess()
     * cy.acceptMetamaskAccess({allAccounts: true, confirmSignatureRequest: true})
     */
    acceptMetamaskAccess(options?: {
      allAccounts?: boolean;
      confirmSignatureRequest?: boolean;
      confirmDataSignatureRequest?: boolean;
    }): Chainable<boolean>;
    /**
     * Reject metamask access request
     * @example
     * cy.rejectMetamaskAccess()
     */
    rejectMetamaskAccess(): Chainable<boolean>;
    /**
     * Confirm metamask transaction (auto-detects eip-1559 and legacy transactions)
     * @example
     * cy.confirmMetamaskTransaction()
     * cy.confirmMetamaskTransaction({ gasLimit: 1000000, baseFee: 20, priorityFee: 20 }) // eip-1559
     * cy.confirmMetamaskTransaction({ gasLimit: 1000000, gasPrice: 20 }) // legacy
     * cy.confirmMetamaskTransaction('aggressive') // eip-1559 only! => available options: 'low', 'market', 'aggressive', 'site' (site is usually by default)
     */
    confirmMetamaskTransaction(
      gasConfig?:
        | {
            gasLimit?: number;
            baseFee?: number;
            priorityFee?: number;
          }
        | {
            gasLimit?: number;
            gasPrice?: number;
          }
        | 'low'
        | 'market'
        | 'aggressive'
        | 'site',
    ): Chainable<Subject>;
    /**
     * Reject metamask transaction
     * @example
     * cy.rejectMetamaskTransaction()
     */
    rejectMetamaskTransaction(): Chainable<boolean>;
    /**
     * Allow site to add new network in metamask
     * @example
     * cy.allowMetamaskToAddNetwork()
     * cy.allowMetamaskToAddNetwork('close') // waitForEvent
     */
    allowMetamaskToAddNetwork(waitForEvent?: string): Chainable<boolean>;
    /**
     * Reject site to add new network in metamask
     * @example
     * cy.rejectMetamaskToAddNetwork()
     */
    rejectMetamaskToAddNetwork(): Chainable<boolean>;
    /**
     * Allow site to switch network in metamask
     * @example
     * cy.allowMetamaskToSwitchNetwork()
     */
    allowMetamaskToSwitchNetwork(): Chainable<boolean>;
    /**
     * Reject site to switch network in metamask
     * @example
     * cy.rejectMetamaskToSwitchNetwork()
     */
    rejectMetamaskToSwitchNetwork(): Chainable<boolean>;
    /**
     * Allow site to add new network in metamask and switch to it
     * @example
     * cy.allowMetamaskToAddAndSwitchNetwork()
     */
    allowMetamaskToAddAndSwitchNetwork(): Chainable<boolean>;
    /**
     * Unlock metamask
     * @example
     * cy.unlockMetamask('password')
     */
    unlockMetamask(password: string): Chainable<boolean>;
    /**
     * Fetches previous metamask wallet address
     * @example
     * cy.fetchMetamaskWalletAddress().then(address => cy.log(address))
     */
    fetchMetamaskWalletAddress(): Chainable<boolean>;
    /**
     * Run the flow for metamask setup
     * List of available presets for networks: https://github.com/wagmi-dev/references/tree/main/packages/chains#chains
     * If preset for your custom chain is not available, you can add custom network by yourself.
     * @example
     * cy.setupMetamask() // will use defaults
     * cy.setupMetamask('secret, words, ...', 'optimism', 'password for metamask') // works only if chain is available as preset
     * cy.setupMetamask('secret, words, ...', {name: 'optimism', rpcUrl: 'https://mainnet.optimism.io', chainId: 10, symbol: 'oETH', blockExplorer: 'https://https://optimistic.etherscan.io', isTestnet: false}, 'password for metamask')
     * cy.setupMetamask('private_key', 'goerli', 'password for metamask')
     * cy.setupMetamask('private_key', {name: 'optimism', rpcUrl: 'https://mainnet.optimism.io', chainId: 10, symbol: 'oETH', blockExplorer: 'https://https://optimistic.etherscan.io', isTestnet: false}, 'password for metamask')
     */
    setupMetamask(
      secretWordsOrPrivateKey?: string,
      network?:
        | string
        | {
            networkName: string;
            rpcUrl: string;
            chainId: number;
            symbol?: string;
            blockExplorer?: string;
            isTestnet: boolean;
          },
      password?: string,
      enableAdvancedSettings?: boolean,
      enableExperimentalSettings?: boolean,
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
    etherscanWaitForTxSuccess(txid: string): Chainable<boolean>;
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
