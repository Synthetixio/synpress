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
 * Date: 06/21/24
 * Author(s): Diego Graf 
 */

export default class BalancesWidget {

  getMaximizeWidgetButton() {
    return cy.xpath("//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., 'Balances')]/following-sibling::div/button")
  }

  getRowsQuantity() {
    return cy.xpath("count(//div[contains(@id, 'contenttableBalances-')]//div[contains(@role, 'row') and contains(@id, 'Balances-')]//div[contains(@class, 'col-iso')]//div)")
  }

  getAssetByRow(row) {
    return cy.xpath(`//div[contains(@id, 'contenttableBalances-')]//div[contains(@id, 'row${row}Balances')]//div[contains(@class, 'col-iso')]//div`)
  }
}