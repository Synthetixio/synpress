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
export default class TokenWalletWidget {


  getNameWidgetText() {
    return "Token Wallet"
  }

  getAuthorizeAllButton() {
    return cy.xpath('//button[contains(@class, "btn-positive") and contains(text(), "AUTHORIZE ALL")]')
  }

  getConnectWalletButton() {
    return cy.get('button:contains("CONNECT WALLET")')
  }

  getDepositButton() {
    return cy.get('button:contains("DEPOSIT")')
  }

  getConfirmButton() {
    return cy.get('button:contains("CONFIRM")')
  }

  getSelectTokenSelector() {
    return cy.get('div[id*="TokenWalletWidget"] div[class="Select-input"]')
  }

  getSelectTokenCombo() {
    return cy.xpath('//div[contains(@id, "TokenWalletWidget")]//div[contains(@class, "Select-multi-value-wrapper")]')
  }

  getSelectSpecificToken() {
    return cy.xpath('//div[contains(@class, "Select-menu-outer")]')
  }

  getInputDepositAmount() {
    return cy.get('input[placeholder*="Input deposit amount..."]')
  }

  getInputRedeemAmount() {
    return cy.get('input[placeholder*="Input redeem amount..."]')
  }

  getLockFoundsButton() {
    return cy.get('button:contains("LOCK FUNDS")')
  }

  getConnectYourWalletMessage() {
    return cy.get('b:contains("Connect your wallet to transact.")')
  }
} 