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
 * Date: 06/12/24
 * Author(s): Diego Graf
 * -----
 * Last Modified: 7/24/2024
 * Modified By: Diego Graf
 * -----
 * 
 */

export default class PaymentsWidget {

  getInvalidUserMessage() {
    return "Invalid user. User can't pay to itself"
  }

  getWidgetNameText() {
    return 'Payments'
  }

  getPayeeInput() {
    return cy.get('#payee')
  }

  getAmountInput() {
    return cy.get('#amount')
  }

  getAssetSelect() {
    return cy.xpath('//p[text() = "Asset *"]/following-sibling::div')
  }

  getCustodianSelect() {
    return cy.xpath('//p[text() = "Custodian *"]/following-sibling::div')
  }

  getSendButton() {
    return cy.xpath('//div[contains(@class,"one-way-payment")]//button[contains(@class, "positive")]')
  }

  getConfirmPaymentButton() {
    return cy.xpath('//button[text() = "CONFIRM"]')
  }

  getNotEnoughFundsErrorMessage() {
    return "REJECTED: NOT ENOUGH FUNDS"
  }

  getAllRowsInColumnTime() {
    return cy.get('[id*="contenttableOneWayPaymentWidget"] [class*="col-time"]')
  }

  getHorizontalScrollBar() {
    return cy.xpath('//div[contains(@id, "jqxScrollThumbhorizontalScrollBarOneWayPaymentWidget")]')
  }

  getFieldEventIdByIndex(index) {
    return cy.xpath(`//div[contains(@id, "row${index}OneWayPaymentWidget")]//div[contains(@class, "col-eventId")]//div`)
  }

  getFieldStatusByIndex(index) {
    return cy.xpath(`//div[contains(@id, "row${index}OneWayPaymentWidget")]//div[contains(@class, "col-status")]//div`)
  }

  getUserNotExistErrorMessage() {
    return "User does not exist or is in invalid state:"
  }

  getPaymentCreationProcessStartedMessage() {
    return "Payment creation process started."
  }

  get2FANeedToBeActivatedErrorMessageText() {
    return "You must activate 2FA on Bosonic for this operation."
  }

  getModalConfirmButton() {
    return cy.xpath("//div[contains(@role,'document')]//div[contains(@class, 'footer')]//button[contains(@class, 'positive')]")
  }
}