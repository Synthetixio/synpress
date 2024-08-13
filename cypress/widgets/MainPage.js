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
 * Date: 06/10/2024
 * Author(s): Victor Fattor
 * -----
 * Last Modified: 7/20/2024
 * Modified By: Diego Graf
 * -----
 * 
 */
export default class MainPage {

  // #region general
  getRootIdFromDOM() {
    return "#root"
  }

  getRootDiv() {
    return cy.get("#root")
  }

  getNavbar() {
    return cy.xpath(`//p[@class="navbar-text"]`)
  }

  getNavbarProfileMenu() {
    return cy.xpath('//ul[@id="profile-dropdown"]')
  }

  getLogoutMenuItem() {
    return cy.xpath("//li[@role='menuitem' and contains( text(), 'Logout')]")
  }

  getRfqOptionMenu() {
    return cy.contains('RFQ')
  }

  getCollateralOptionMenu() {
    return cy.contains('Collateral')
  }

  getRepoOptionMenu() {
    return cy.contains('Repo')
  }

  getAddWidgetButton() {
    return cy.xpath(`//div[@role = "menubar"]//ul[contains(@class,"widget_menu_header")]//li[contains(text(), "ADD WIDGET")]`)
  }

  getSelectItemMenu(name) {
    return cy.xpath(`(//li[@role="menuitem" and text() = "${name}"])[2]`)
  }

  getMaxMinWidgetButton(name) {
    return cy.xpath(`//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., '${name}')]/following-sibling::div/button`)
  }

  // #endregion

  // #region Trader 

  getTraderRfqLayoutLink() {
    return cy.get('a[href="/rfq"]')
  }

  getTraderRepoLayoutLink() {
    return cy.get('a[href="/repo"]')
  }

  getTraderSvLayoutLink() {
    return cy.get('a[href="/sv"]')
  }

  // #endregion

  // #region Custodian Module Methods
  getCustodianCcnsLayoutLink() {
    return cy.get('a[href="/ccns"]')
  }

  getCustodianSvLayoutLink() {
    return cy.get('a[href="/smart-vault"]')
  }
  // #endregion

  getRowsByRowIdAndCellValue(id, value) {
    return cy.xpath(`//div[contains(@id, '${id}')]//div[contains(text(), '${value}')]`)
  }

  // #region Messages Status
  getSuccessMessage() {
    return "Success"
  }
  // #endregion
}