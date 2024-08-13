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
 * Date: 07/18/2024
 * Author(s): Eberle David
 * -----
 * Last Modified: 7/18/2024
 * Modified By: Eberle David
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

  getRunReportButton() {
    return cy.xpath('(//button[contains(text(), "RUN REPORT")])')
  }
} 