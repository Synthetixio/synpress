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
 * Date: 05/28/2024
 * Author(s): Victor Fattor
 * -----
 * Last Modified: 6/14/2024
 * Modified By: Victor Fattor
 * -----
 * 
 */
export default class OutboundTicketsWidget {
  getCreateOrderBtn() {
    return cy.get('button:contains("CREATE ORDER")')
  }

  getOutboundTicket() {
    return cy.xpath('//div[@class="ticket inline-block  outbound"]')
  }

  getOrderTypeSelectOption() {
    return cy.xpath('//div[@class="ticket-meta-label" and text()="Order Type"]/following-sibling::div')
  }

  getTifSelectOption() {
    return cy.xpath('//div[@class="ticket-meta-label" and text()="TIF"]/following-sibling::div')
  }

  getQuoteTypeSelectOption() {
    return cy.xpath('//div[@class="ticket-meta-label" and text()="Quote Type"]/following-sibling::div')
  }

  getSideSelectOption() {
    return cy.xpath('//div[@class="ticket-meta-label" and text()="Side"]/following-sibling::div')
  }

  getAsset1SelectOption() {
    return cy.xpath('//div[@class="ticket-meta-label" and text()="Asset1"]/following-sibling::div')
  }

  getAsset2SelectOption() {
    return cy.xpath('//div[@class="ticket-meta-label" and text()="Asset2"]/following-sibling::div')
  }

  getCustodianSelectOption() {
    return cy.xpath('//div[@class="ticket-meta-label" and text()="Custodian"]/following-sibling::div')
  }

  getAmountInput() {
    return cy.xpath('//div[@class="ticket-meta-label" and text()="Amount"]/following-sibling::div/div/input[@id="outbound-amount"]')
  }

  getRateInput() {
    return cy.xpath('//div[@class="ticket-meta-label" and text()="Rate"]/following-sibling::div/div/input[@id="rate-by"]')
  }

  getCounterpartySelectOption() {
    return cy.xpath('//div[@class="ticket-meta-label" and text()="Counterparty"]/following-sibling::span[contains(@id, "counterparty-dropdown")]')
  }

  getSendButton() {
    return cy.xpath('//button[. ="SEND"]')
  }

  getCounterpartyInput() {
    return cy.xpath("//input[@placeholder = 'Filter counterparty']")
  }

  getAsset1ListQuantityInDropDown() {
    return cy.xpath("count(//div[contains(@class, 'ReactVirtualized__Grid ReactVirtualized__List VirtualSelectGrid')]//div[contains(@class, 'ReactVirtualized__Grid__innerScrollContainer')]//div[contains(@class, 'VirtualizedSelectOption')])")
  }

  getAsset1ByRow(row) {
    return cy.xpath(`//div[contains(@class, 'ReactVirtualized__Grid ReactVirtualized__List VirtualSelectGrid')]//div[contains(@class, 'ReactVirtualized__Grid__innerScrollContainer')]//div[contains(@class, 'VirtualizedSelectOption')][${row}]`)
  }

  getAsset2ListQuantityInDropDown() {
    return cy.xpath("count(//div[contains(@class, 'ReactVirtualized__Grid ReactVirtualized__List VirtualSelectGrid')]//div[contains(@class, 'ReactVirtualized__Grid__innerScrollContainer')]//div[contains(@class, 'VirtualizedSelectOption')])")
  }

  getAsset2ByRow(row) {
    return cy.xpath(`//div[contains(@class, 'ReactVirtualized__Grid ReactVirtualized__List VirtualSelectGrid')]//div[contains(@class, 'ReactVirtualized__Grid__innerScrollContainer')]//div[contains(@class, 'VirtualizedSelectOption')][${row}]`)
  }
}