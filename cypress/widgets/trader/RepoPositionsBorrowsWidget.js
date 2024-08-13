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
 * Date: 7/25/24
 * Author(s): Diego Graf 
 * -----------------------
 * Last Modified: 8/1/24
 * Modified By: Diego Graf
 *
 */

export default class RepoPositionsBorrowsWidget {

  getHorizontalScrollBar() {
    return cy.xpath('//div[contains(@id, "jqxScrollThumbhorizontalScrollBarRepoPositionsBorrows")]')
  }

  getFieldByRow(field, row) {
    return cy.xpath(this.getXpathStringFieldByRow(field, row))
  }

  getXpathStringFieldByRow(field, row) {
    return `//div[contains(@id, "contenttableRepoPositionsBorrows")]//div[contains(@id, "row${row}RepoPositionsBorrows")]//div[contains(@class, '${field}')]//div`
  }

  getElapsedTimeFieldByRow(row) {
    return cy.xpath(this.getXpathStringElapsedTimeFieldByRow(row))
  }

  getXpathStringElapsedTimeFieldByRow(row) {
    return `//div[contains(@id, 'contenttableRepoPositionsBorrows')]//div[contains(@id, 'row${row}RepoPositionsBorrows')]//div[contains(@class, 'col-elapsedTimeId')]//div//div//span[contains(@id, 'elapsed-time-span')]`
  }

  getMaximizeButton() {
    return cy.xpath(`//div[contains(text(), "Repo Positions - Borrows")]/parent::div/parent::div/following-sibling::div/button`)
  }

  getWidgetNameText() {
    return "Repo Positions - Borrows"
  }

  getClassIdsColumns() {
    return {
      id: 'col-id',
      status: 'col-status',
      earlyCloseTimeStamp: 'col-earlyCloseTimestamp',
      openTimeStamp: 'col-openTimestamp',
      closeTimestamp: 'col-closeTimestamp',
      lentRefPrice: 'col-lentRefPrice'      
    }
  }
}