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
 * Date: 07/26/2024
 * Author(s): David Eberle
 * -----
 * Last Modified: 7/26/2024
 * Modified By: David Eberle
 * -----
 * 
 */
export default class AuditorWalletWidget {


  getNameWidgetText() {
    return "Auditor Wallet"
  }

  getAuthorizeAllButton() {
    return cy.xpath('//button[contains(@class, "btn-positive") and contains(text(), "AUTHORIZE ALL")]')
  }

  getConnectWalletButton() {
    return cy.get('button:contains("CONNECT WALLET")')
  }

  getConfirmButton() {
    return cy.get('button:contains("CONFIRM")')
  }

  getStatusByRow(row) {
    return cy.xpath(`//div[contains(@id, 'contenttableAuditorWidget-')]//div[contains(@id, 'row${row}AuditorWidget-')]//div[6]`)
  }

  getCcnsRunIdByRow(row) {
    return cy.xpath(`//div[contains(@id, 'contenttableAuditorWidget-')]//div[contains(@id, 'row${row}AuditorWidget-')]//div[3]`)
  }

} 