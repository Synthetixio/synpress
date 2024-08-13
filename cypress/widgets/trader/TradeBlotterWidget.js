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
 * Date: 7/26/24
 * Author(s): Diego Graf 
 * -----------------------
 * Last Modified: 8/1/24
 * Modified By: Diego Graf
 *
 */

export default class TradeBlotterWidget {

  getHorizontalScrollBar() {
    return cy.xpath("//div[contains(@id, 'jqxScrollThumbhorizontalScrollBarTradeBlotter')]")
  }

  getColumnFieldDivByRow(field, row) {
    return cy.xpath(this.getXpathStringColumnFieldDivByRow(field, row))
  }

  getXpathStringColumnFieldDivByRow(field, row) {
    return `//div[contains(@id, "contenttableTradeBlotter")]//div[contains(@id, "row${row}TradeBlotter")]//div[contains(@class, "${field}")]/div`
  }

  getFieldSpanByRow(field, row) {
    return cy.xpath(this.getXpathFieldSpanByRow(field, row))
  }

  getXpathFieldSpanByRow(field, row) {
    return `//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row${row}TradeBlotter')]//div[contains(@class, '${field}')]/div/span`
  }

  getAllLastResponseDateColumns() {
    return '[id*="contenttableTradeBlotter"] [class*="col-lastResponseDate"]'
  }

  getWidgetTitleLabel() {
    return cy.get('[class*="tab_button_content"]').contains('Trade Blotter')
  }

  getNotEnoughBalanceMessage() {
    return "Not enough balance for USD"
  }

  getNotEnoughBalanceToTradeMessage(asset) {
    return `Not enough total balance to trade ${asset}. Available:`
  }

  getMaximizeButton() {
    return cy.xpath(`//div[contains(text(), "Trade Blotter")]/parent::div/parent::div/following-sibling::div/button`)
  }

  getElementsQuantitySelect() {
    return cy.xpath("//div[contains(@id, 'pagerTradeBlotter')]//div//div//div//div[contains(@id, 'dropdownlistArrowgridpagerlistTradeBlotter')]")
  }

  getElementsQuantitySelectOption(option) {
    return cy.xpath(`//div[contains(@id, 'listBoxContentinnerListBoxgridpagerlistTradeBlotter')]//div//div[@role = 'option']//span[contains(text(), '${option}')]`)
  }

  getWidgetNameText() {
    return 'Trade Blotter'
  }

  getHorizontalScrollBarInRepoLayout() {
    return cy.xpath("//div[contains(@id, 'jqxScrollWraphorizontalScrollBarTradeBlotter')]//div[contains(@id, 'jqxScrollThumbhorizontalScrollBarTradeBlotter')]")
  }

  getCloseWidgetButton() {
    return cy.xpath("//div[contains(@class,'tab_button')]//div[contains(text(), 'Trade Blotter')]/following-sibling::div")
  }

  getClassIdsColumns() {
    return {
      refId: 'col-refId',
      status: 'col-status',
      message: 'col-message',
      id: 'col-id',
      total: 'col-total',
      side: 'col-side',
      asset1: 'col-asset1',
      asset2: 'col-asset2',
      currencyPair: 'col-currencyPair',
      quantity: 'col-quantity',
      avgRate: 'col-avgRate'
    }
  }
}