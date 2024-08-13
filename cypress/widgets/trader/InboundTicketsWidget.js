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
 * Date: 06/14/2024
 * Author(s): Victor Fattor
 * -----
 * Last Modified: 7/22/2024
 * Modified By: Victor Fattor
 * -----
 * 
 */
export default class InboundTicketsWidget {

  getInboundTicket() {
    return cy.xpath('//div[@class="ticket inline-block  inbound"]')
  }

  getCustodianSelectOption() {
    return cy.xpath('//div[@class="ticket-meta-label" and text()="Custodian"]/following-sibling::div')
  }

  getAcceptButton() {
    return cy.xpath('//button[. ="Accept"]')
  }

  getCancelButton() {
    return cy.contains('CANCEL')
  }

  getNotEnoughBalanceToSellErrorMessageText(asset, amount) {
    return `you are trying to SELL: ${asset} for ${amount.toLocaleString("en-US")}.00 but you only have`
  }
}