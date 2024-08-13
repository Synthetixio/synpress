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
 * Date: 06/27/2024
 * Author(s): David Eberle
 * -----
 * Last Modified: 6/27/2024
 * Modified By: David Eberle
 * -----
 * 
 */
export default class CrossCustodianNetSettlementsHistoryWidget {


  getNameWidgetText() {
    return "Cross Custodian Net Settlements History"
  }

  getRunIdInput() {
    return cy.xpath("//input[@placeholder='Run ID']").first()
  }

  getStatusSelect() {
    return cy.xpath("//span[text()='Select Status']").first()
  }

  getStatusCompletedSelectOption() {
    return cy.xpath("//span[contains(text(), 'COMPLETED')]")
  }

  getSearchButton() {
    return cy.xpath("//i[contains(@class, 'fas') and contains(@class, 'fa-search')]").first()
  }

  getStatusValueByRow(row) {
    return cy.xpath(`(//div[contains(@id, "row${row}CrossCustodianSettlementsHistoryWidget")]//div[@role="gridcell"][9])`)
  }
} 