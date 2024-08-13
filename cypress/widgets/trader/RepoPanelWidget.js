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
 * Date: 7/2/24
 * Author(s): Diego Graf 
 */

export default class RepoPanelWidget {

  getRatePanelDiv() {
    return cy.get(".rate-panel")
  }

  getSendButton() {
    return cy.contains('SEND')
  }

  getContainerBySymbol(symbol) {
    return cy.xpath(`//div[@class='inline-block rate-panel' and div[@class='row header']/div/div/input[@value="${symbol}"]]`)
  }

  getMatchAssetRowToBorrowByAsset1(asset1) {
    return cy.xpath(`(//td[@class='buy' and contains(@title, 'You Borrow ${asset1} ')])[1]`)
  }

  getCustodianSelect() {
    return cy.get('[class*="custodian-select"]')
  }

  getNoResultsFoundMessageInCustodianSelect() {
    return 'No results found'
  }

  getLendButton() {
    return cy.contains('LEND')
  }

  getBorrowButton() {
    return cy.contains('BORROW')
  }

  getPriceInput() {
    return cy.get('.price')
  }

  getAmountInput() {
    return cy.get('.amount')
  }
}