# Synpress Commands

| Command                                                           | Description                                                                                                        |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `cy.initPlaywright()`                                             | Connect playwright with Cypress instance                                                                           |
| `cy.assignWindows()`                                              | Assign currently open tabs with playwright                                                                         |
| `cy.assignActiveTabName()`                                        | Assigns currently active tab                                                                                       |
| `cy.isMetamaskWindowActive()`                                     | Checks if current active tab is metamask                                                                           |
| `cy.isCypressWindowActive()`                                      | Checks if current active tab is cypress                                                                            |
| `cy.switchToCypressWindow()`                                      | Switch to Cypress window                                                                                           |
| `cy.switchToMetamaskWindow()`                                     | Switch to metamask window                                                                                          |
| `cy.switchToMetamaskNotification()`                               | Switch to metamask notification window                                                                             |
| `cy.getNetwork()`                                                 | Get current network                                                                                                |
| `cy.addMetamaskNetwork()`                                         | Add network in metamask (and also switch to the newly added network)                                               |
| `cy.changeMetamaskNetwork()`                                      | Change network in metamask                                                                                         |
| `cy.importMetamaskAccount()`                                      | Import new account in metamask using private key                                                                   |
| `cy.createMetamaskAccount(accountName?: string)`                  | Create new account in metamask                                                                                     |
| `cy.getMetamaskWalletAddress()`                                   | Get current wallet address of metamask wallet                                                                      |
| `cy.activateAdvancedGasControlInMetamask()`                       | Activate ability (in metamask settings) to specify custom gas price and limit while doing transactions in metamask |
| `cy.activateEnhancedTokenDetectionInMetamask()`                   | Activate ability (in metamask settings) to detect custom tokens using ConsenSys API in metamask                    |
| `cy.activateShowHexDataInMetamask()`                              | Activate ability (in metamask settings) to show hex data while doing transaction in metamask                       |
| `cy.activateTestnetConversionInMetamask()`                        | Activate ability (in metamask settings) to show fiat conversions on testnets in metamask                           |
| `cy.activateShowTestnetNetworksInMetamask()`                      | Activate ability (in metamask settings) to show testnet networks in metamask                                       |
| `cy.activateCustomNonceInMetamask(skipSetup?: boolean)`           | Activate ability (in metamask settings) to specify custom nonce while doing transactions in metamask               |
| `cy.activateDismissBackupReminderInMetamask(skipSetup?: boolean)` | Activate ability (in metamask settings) to dismiss secret recovery phrase reminder in metamask                     |
| `cy.activateEnhancedGasFeeUIInMetamask(skipSetup?: bolean)`       | Activate enhanced gas fee UI in metamask settings                                                                  |
| `cy.activateShowCustomNetworkListInMetamask()`                    | Activate showing of custom network list in metamask settings                                                       |
| `cy.resetMetamaskAccount()`                                       | Reset metamask account state in settings                                                                           |
| `cy.disconnectMetamaskWalletFromDapp()`                           | Disconnects metamask wallet from last connected dapp                                                               |
| `cy.disconnectMetamaskWalletFromAllDapps()`                       | Disconnects metamask wallet from all connected dapps                                                               |
| `cy.confirmMetamaskSignatureRequest()`                            | Confirm metamask permission to sign message                                                                        |
| `cy.confirmMetamaskDataSignatureRequest()`                        | Confirm metamask permission to sign Data message                                                                   |
| `cy.rejectMetamaskSignatureRequest()`                             | Reject metamask permission to sign message                                                                         |
| `cy.rejectMetamaskEncryptionPublicKeyRequest()`                   | Reject metamask request for public encryption key                                                                  |
| `cy.confirmMetamaskDecryptionRequest()`                           | Confirm metamask request to decrypt message with private key                                                       |
| `cy.confirmMetamaskEncryptionPublicKeyRequest()`                  | Confirm metamask request for public encryption key                                                                 |
| `cy.rejectMetamaskDecryptionRequest()`                            | Reject metamask permission to sign Data message                                                                    |
| `cy.rejectMetamaskDataSignatureRequest()`                         | Confirm metamask request for public encryption key                                                                 |
| `cy.importMetamaskToken()`                                        | Add custom token to metamask                                                                                       |
| `cy.confirmMetamaskAddToken()`                                    | Confirm metamask request to add token                                                                              |
| `cy.rejectMetamaskAddToken()`                                     | Reject metamask request to add token                                                                               |
| `cy.confirmMetamaskPermissionToSpend()`                           | Confirm metamask request for public encryption key                                                                 |
| `cy.rejectMetamaskPermissionToSpend()`                            | Reject metamask permission to spend asset                                                                          |
| `cy.acceptMetamaskAccess()`                                       | Accept metamask access request                                                                                     |
| `cy.confirmMetamaskTransaction()`                                 | Confirm metamask transaction (auto-detects eip-1559 and legacy transactions)                                       |
| `cy.rejectMetamaskTransaction()`                                  | Reject metamask transaction                                                                                        |
| `cy.allowMetamaskToAddNetwork()`                                  | Allow site to add new network in metamask                                                                          |
| `cy.allowMetamaskToSwitchNetwork()`                               | Allow site to switch network in metamask                                                                           |
| `cy.rejectMetamaskToSwitchNetwork()`                              | Reject site to switch network in metamask                                                                          |
| `cy.allowMetamaskToAddAndSwitchNetwork()`                         | Allow site to add new network in metamask and switch to it                                                         |
| `cy.unlockMetamask()`                                             | Unlock metamask                                                                                                    |
| `cy.fetchMetamaskWalletAddress()`                                 | Fetches previous metamask wallet address                                                                           |
| `cy.setupMetamask()`                                              | Run the flow for metamask setup                                                                                    |
| `cy.snxExchangerSettle()`                                         | Execute settle on Exchanger contract                                                                               |
| `cy.snxCheckWaitingPeriod()`                                      | Check waiting period on Exchanger contract                                                                         |
| `cy.etherscanGetTransactionStatus()`                              | Get transaction status from Etherscan API                                                                          |
| `cy.etherscanWaitForTxSuccess()`                                  | Wait until transaction is success using Etherscan API                                                              |
| `cy.waitForResources()`                                           | Wait until all XHR requests are finished (networkidle0)                                                            |
| `cy.topIsWithinViewport()`                                        | Assert that element top is within viewport                                                                         |
| `cy.isWithinViewport()`                                           | Assert that element is within viewport                                                                             |
