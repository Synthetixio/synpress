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
 * Date: 05/31/2024
 * Author(s): Victor Fattor
 * -----
 * Last Modified: 6/11/2024
 * Modified By: Victor Fattor
 * -----
 * 
 */
export default class AssetCreationWidget {


  #getId() {
    return '//div[@id="asset-creation-widget"]'
  }

  getWidgetIdCssSelector() {
    return "#asset-creation-widget"
  }

  getNameWidgetText() {
    return "Asset Creation"
  }

  getMaxMinWidgetButton() {
    return cy.xpath("//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., 'Asset Creation')]/following-sibling::div/button")
  }

  getOpenFilterByColumnButton(column) {
    return cy.xpath(`(${this.#getId()}//div[contains(@id, 'columntableAssetCreation')]//div[contains(@class,'filtericon')])[${column}]`)
  }

  getFilterContainsInput() {
    return cy.xpath("//input[contains(@class, 'filtertext1AssetCreation')]")
  }

  getFilterByColumnButton() {
    return cy.xpath("//div[contains(@id, 'gridmenuAssetCreation')]//ul[contains(@class, 'jqx-menu-ul')][1]//span[contains(text(), 'Filter')]")
  }

  getClearFilterByColumnButton() {
    return cy.xpath("//div[contains(@id, 'gridmenuAssetCreation')]//ul[contains(@class, 'jqx-menu-ul')][1]//span[contains(text(), 'Clear')]")
  }

  getRowAssetCreationTable(rowNumber) {
    return cy.xpath(`//div[contains(@id, 'contenttableAssetCreation')]//div[contains(@id, 'row${rowNumber}AssetCreation')]`)
  }

  getScrollWidget(position) {
    return cy.xpath(this.#getId()).parent().scrollTo(position)
  }

  getIsoInput() {
    return cy.xpath(this.#getId() + '//input[@name="iso"]')
  }

  getSymbolInput() {
    return cy.xpath(this.#getId() + '//input[@name="symbol"]')
  }

  getMinorUnitInput() {
    return cy.xpath(this.#getId() + '//input[@name="minorUnit"]')
  }

  getSelectTypeCombo() {
    return cy.xpath('//div[contains(@id,"asset-creation-widget")]//p[contains(text(), "Type")]/following-sibling::div')
  }

  getSelectTypeOption(option) {
    return cy.contains(`${option}`)
  }

  getSubmitButton() {
    return cy.xpath(this.#getId() + '//button[text()="SUBMIT"]')
  }

  getCreatedSuccessMessage(isoNameCreated) {
    return cy.contains(`${isoNameCreated} asset has been successfully created.`)
  }

  getCloseWidgetButton() {
    return cy.xpath('//div[contains(@class,"tab_button_content") and . = "Asset Creation"]//following-sibling::div')
  }

  getRowValueByColumn(row, column) {
    return cy.xpath(`//div[@role='row' and contains(@id, '${row}AssetCreation')]//div[contains(@class, '${column}')]`)
  }

  getHeaderNamesColumns() {
    const headerValues = {
      ISO: 1,
      TYPE: 3 
    }

    return headerValues
  }

  getClassNamesColumns() {
    const classNames = {
      iso: "col-iso",
      symbol: "col-symbol",
      type: "col-type",
      minorUnit: "col-minorUnit"
    }

    return classNames
  }

  getResultsNumberTableUI() {
    return cy.xpath('(//div[contains(@id, "pagerAssetCreation")]//div[@type="button" and@title="previous"]/following-sibling::div)[1]')
  }

} 