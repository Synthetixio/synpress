/*
 * Copyright (C) 2020 BOSONIC, Inc. All rights reserved.
 * 
 * BOSONIC is a trademark of BOSONIC, Inc.
 * 
 * References to third-party marks or brands are the property of their
 * respective owners. No rights or licenses are granted, express or implied,
 * unless set forth in a written agreement signed by BOSONIC, Inc.
 * Dissemination or reproduction of content contained herein is strictly
 * forbidden except as otherwise expressly permitted pursuant to a
 * written agreement signed by BOSONIC, Inc.
 * 
 * -----
 * Date: 06/24/2024
 * Author(s): David Eberle
 * -----
 * Last Modified: 6/24/2024
 * Modified By: David Eberle
 * -----
 * 
 */
export default class WalletModalWidget {

  getConnectWalletButton() {
    return cy.get('button[class="btn-grey token-wallet-button"]')
  }

  getConnectWalletButtonText() {
    return 'CONNECT WALLET'
  }

  getWeb3WalletConnection() {
    return cy.xpath('(//div[@class = "sc-hKwDye iWCqoQ web3modal-provider-container"])[1]')
  }

  getWeb3WalletConnectionText() {
    return 'Web3 Wallet'
  }
} 