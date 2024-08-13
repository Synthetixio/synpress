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
 * Date: 06/24/24
 * Author(s): Diego Graf 
 */

export default class IssueCollateralWidget {

  getWidgetName() {
    return 'Issue Collateral'
  }

  getContainer() {
    return cy.xpath('//div[@class="collateral_container"]')
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

  getQuantityDivContainer () {
    return cy.xpath('//p[contains(text(), "Quantity")]/following-sibling::div')
  }

  getAcceptButton() {
    return cy.xpath('//button[contains(@class, "btn-positive")]')
  }

  getMaximizeButton() {
    return cy.xpath('//div[contains(text(), "Issue Collateral")]/parent::div/parent::div/following-sibling::div//button')
  }
}