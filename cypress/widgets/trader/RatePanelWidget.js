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

export default class RatePanelWidget {

  getCloseWidgetButton() {
    return cy.xpath("//button[contains(@class, 'btn-top btn btn-xs btn-default')]")
  }

  getAssetTitle() {
    return cy.get(".rate-panel")
  }

  getContainerByAsset(asset) {
    return cy.xpath(`//div[@class='inline-block rate-panel' and div[@class='row header']/div/div/input[@value='${asset}']]`)
  }

  getContainerBySymbolXpathSelector(symbol) {
    return `//div[@class='inline-block rate-panel' and div[@class='row header']/div/div/input[@value="${symbol}"]]`
  }

  getRateInput() {
    return cy.xpath("//div[@class='price']//input")
  }

  getAmountInput() {
    return cy.xpath("//div[@class='amount']//input")
  }

  getCustodianSelectArrow() {
    return cy.xpath("//div[contains(@class, 'Select custodian-select')]//span[@class = 'Select-arrow']")
  }

  getCustodianOptionByCustodian(custodian) {
    return cy.xpath(`//div[@role = 'option' and @aria-label = '${custodian}']`)
  }

  getSendButton() {
    return cy.get("button:contains('SEND')")
  }

  getCustodianNotSelectedBlindLabelError() {
    return cy.xpath("//div[@class='Select custodian-select order-error Select--single']")
  }
}