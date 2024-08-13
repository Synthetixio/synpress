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
 * Date: 06/18/2024
 * Author(s): Victor Fattor
 * -----
 * Last Modified: 6/18/2024
 * Modified By: Victor Fattor
 * -----
 * 
 */
export default class CrossCustodianNetSettlementsWidget {


  getNameWidgetText() {
    return "Cross Custodian Net Settlements"
  }

  getMaxMinWidgetButton(name) {
    return cy.xpath(`//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., '${name}')]/following-sibling::div/button`)
  }

  getAcceptAllButton() {
    return cy.xpath('(//button[contains(text(), "ACCEPT ALL")])')
  }

  getRunCcnsIdValueByRow(row) {
    return cy.xpath(`(//div[contains(@id, "row${row}CrossCustodianWidget")]//div[@role="gridcell"][10])`)
  }

  getNoDataToDisplayMessage() {
    return cy.xpath(`//div[contains(@id, 'CrossCustodianWidget')]//span[text()='No data to display']`)
  }
} 