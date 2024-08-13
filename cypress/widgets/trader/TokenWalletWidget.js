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
 * Date: 7/8/2024
 * Author(s): David Eberle
 * -----
 * Last Modified: 8/9/2024
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

  getDisconnectWalletButton() {
    return cy.xpath('//i[@id="disconnect-wallet-icon" and contains(@class, "fa-power-off")]')
  }

  getDepositButton() {
    return cy.get('button:contains("DEPOSIT")')
  }

  getRedeemButton() {
    return cy.get('button:contains("REDEEM REQUEST")')
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

  getUnlockFoundsButton() {
    return cy.get('button:contains("UNLOCK FUNDS")')
  }

  getWithdrawButton() {
    return cy.get('button[style="display: inline-block;"]:contains("WITHDRAW")')
  }

  getConnectYourWalletMessage() {
    return cy.get('b:contains("Connect your wallet to transact.")')
  }

  getConnectYourWalletMessageText() {
    return "Connect your wallet to transact."
  }

  getWalletAddress() {
    return cy.get("div[class='wallet-connect'] span[class*='badge']")
  }

  getWalletConnectTittle() {
    return cy.get("div[class='wallet-connect'] p[class='title']")
  }

  getWaitingBlockConfirmationsMessageText() {
    return "Waiting for block confirmations to refresh BOSONIC balances."
  }

  getContractLockedBalance() {
    return cy.xpath('//p[contains(text(), "Contract Locked Balance:")]/span[@class="positive-balance"]')
  }

  getStatusByRow(row) {
    return cy.xpath(`//div[contains(@id, 'contenttableTokenWalletWidget-')]//div[contains(@id, 'row${row}TokenWalletWidget')]//div[4]`)
  }

  getRowByPosition(rowNumer) {
    return cy.xpath(`//div[contains(@id, 'contenttableTokenWalletWidget-')]//div[contains(@id, 'row${rowNumer}TokenWalletWidget')]`)
  }

  getRedeemModalWalletAddress() {
    return cy.get('div[class="modal-body"]  > div:nth-child(1)')
  }

  getRedeemModalToken() {
    return cy.get('div[class="modal-body"]  > div:nth-child(3)')
  }

  getRedeemModalAmount() {
    return cy.get('div[class="modal-body"]  > div:nth-child(4)')
  }
} 