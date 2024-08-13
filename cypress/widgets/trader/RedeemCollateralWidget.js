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
 * Date: 06/26/24
 * Author(s): Diego Graf
 * -----
 * Last Modified: 7/30/2024
 * Modified By: Diego Graf
 * -----
 * 
 */

export default class RedeemCollateralWidget {

  getWidgetName() {
    return 'Redeem Collateral'
  }

  getAssetSelect() {
    return cy.xpath('//div[@class = "collateral_container"]//div//div//div//p[contains(text(),"Asset")]//following-sibling::div')
  }

  getIssuerSelect() {
    return cy.xpath('//div[@class = "collateral_container"]//div//div//div//p[contains(text(),"Issuer")]//following-sibling::div')
  }

  getQuantityInput() {
    return cy.xpath('//p[contains(text(), "Quantity")]/following-sibling::div//input')
  }

  getQuantityDivContainer() {
    return cy.xpath('//p[contains(text(), "Quantity")]/following-sibling::div')
  }

  getAcceptButton() {
    return cy.xpath('//button[contains(@class, "btn-positive")]')
  }

  getConfirmButton() {
    return cy.xpath('//*[text() = "CONFIRM"]')
  }

  getNotEnoughFundsToRedeemErrorMessage() {
    return "You can't redeem more than your current available amount."
  }

  get2FANeedToBeActivatedErrorMessageText() {
    return "You must activate 2FA on Bosonic for this operation."
  }

  getHorizontalScrollBar() {
    return cy.xpath("//div[contains(@id, 'jqxScrollWraphorizontalScrollBarRedeemExplorer')]//div[contains(@id, 'jqxScrollThumbhorizontalScrollBarRedeemExplorer')]")
  }
}