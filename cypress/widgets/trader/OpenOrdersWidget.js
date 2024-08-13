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
 * Date: 8/2/24
 * Author(s): Diego Graf 
 */

export default class OpenOrdersWidget {

  getCloseWidgetButton() {
    return cy.xpath("//div[contains(@class,'tab_button')]//div[contains(text(), 'Open Orders')]/following-sibling::div")
  }

  getWidgetNameText() {
    return 'Open Orders'
  }

  getColumnFieldDivByRow(field, row) {
    return cy.xpath(`//div[contains(@id,'contenttableOpenOrdersBlotter')]//div[contains(@id, "row${row}OpenOrdersBlotter")]//div[contains(@class, '${field}')]/div`)
  }

  getAllCreatedDateColumns() {
    return '[class*="col-createdDate"]'
  }

  getHorizontalScrollBar() {
    return cy.xpath('//div[contains(@id, "jqxScrollThumbhorizontalScrollBarOpenOrdersBlotter")]')
  }

  getCancelOrderButtonByRow(row) {
    return cy.get(`[id*='row${row}OpenOrdersBlotter'] [class*='col-actions'] button`)
  }

  getClassIdsColumns() {
    return {
      refId: 'col-refId',
      message: 'col-message'
    }
  }
}