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
 * Date: 06/04/2024
 * Author(s): Victor Fattor
 * -----
 * Last Modified: 6/10/2024
 * Modified By: Victor Fattor
 * -----
 * 
 */
export default class AssePairCreationWidget {

  #getId() {
    return '//div[@id="asset-pair-creation-widget"]'
  }

  getWidgetIdCssSelector() {
    return "#asset-pair-creation-widget"
  }

  getWidgetId() {
    return cy.xpath(this.#getId())
  }

  getNameWidgetText() {
    return "Asset Pair Creation"
  }

  getScrollWidget(position) {
    return cy.xpath(this.#getId()).parent().scrollTo(position)
  }

  getMaxMinWidgetButton() {
    return cy.xpath("//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., 'Asset Pair Creation')]/following-sibling::div/button")
  }

  getOpenFilterByColumnButton(column) {
    return cy.xpath(`(${this.#getId()}//div[contains(@id, 'columntableAssetPairCreation')]//div[contains(@class,'filtericon')])[${column}]`)
  }

  getFilterContainsInput() {
    return cy.xpath("//input[contains(@class, 'filtertext1AssetPairCreation')]")
  }

  getFilterByColumnButton() {
    return cy.xpath('//div[@class="filter"]//span[contains(@id, "filterbuttonAssetPairCreation") and @role="button"]')
  }

  getClearFilterByColumnButton() {
    return cy.xpath('//div[@class="filter"]//span[contains(@id, "filterclearbuttonAssetPairCreation") and @role="button"]')
  }

  getBaseCurrencySelect() {
    return cy.xpath(this.#getId() + '//p[. = "Base Currency *"]/following-sibling::div')
  }

  getTypeSelect() {
    return cy.xpath(this.#getId() + '//p[. = "Type *"]/following-sibling::div')
  }

  getQuoteCurrencySelect() {
    return cy.xpath(this.#getId() + '//p[. = "Quote Currency *"]/following-sibling::div')
  }

  getDecimalPlacesInput() {
    return cy.xpath(this.#getId() + '//input[@name = "decimalPlaces"]')
  }

  getPrecisionInput() {
    return cy.xpath(this.#getId() + '//input[@name = "precision"]')
  }

  getMinQuantityInput() {
    return cy.xpath(this.#getId() + '//input[@name = "minQuantity"]')
  }

  getMinSliceQuantity() {
    return cy.xpath(this.#getId() + '//input[@name = "minSliceQuantity"]')
  }

  getPipScaleInput() {
    return cy.xpath(this.#getId() + '//input[@name = "pipScale"]')
  }

  getXeIdInput() {
    return cy.xpath(this.#getId() + '//input[@name = "xeId"]')
  }

  getPerpetualSwapSlider() {
    return cy.xpath(this.#getId() + "//p[. = 'Perpetual Swap']//following-sibling::label//span")
  }

  getInitialMarginLevelInput() {
    return cy.xpath(this.#getId() + "//input[@name = 'initialMarginLevel']")
  }

  getTermDaysInput() {
    return cy.xpath(this.#getId() + "//input[@name='term']")
  }

  getLiquidationThresholdInput() {
    return cy.xpath(this.#getId() + "//input[@name='liquidationThreshold']")
  }

  getLiquidationAlertThresholdInput() {
    return cy.xpath(this.#getId() + "//input[@name='liquidationAlertThreshold']")
  }

  getRepoSymbolInput() {
    return cy.xpath(this.#getId() + "//input[@name='symbol']")
  }

  getBorrowedCurrencySelect() {
    return cy.xpath(this.#getId() + '//p[. = "Borrowed Currency *"]/following-sibling::div')
  }

  getCollateralCurrencySelect() {
    return cy.xpath(this.#getId() + '//p[. = "Collateral Currency *"]/following-sibling::div')
  }

  getCashoutSlider() {
    return cy.xpath(this.#getId() + "//p[. = 'Cash Out']//following-sibling::label//span")
  }

  getEnabledSlider() {
    return cy.xpath(this.#getId() + "//p[. = 'Enabled']//following-sibling::label//span")
  }

  getSubmitButton() {
    return cy.xpath(this.#getId() + "//button[text() = 'SUBMIT']")
  }

  getCancelButton() {
    return cy.xpath(this.#getId() + "//button[text() = 'CANCEL']")
  }

  getCreatedSuccessMessage() {
    return cy.contains("asset pair has been successfully created.")
  }

  getUpdatedSuccessMessage() {
    return cy.contains("asset pair has been successfully updated.")
  }

  getRowValueByColumn(row, column) {
    return cy.xpath(`//div[@role='row' and contains(@id, '${row}AssetPairCreation')]//div[contains(@class, '${column}')]`)
  }

  getRowById(row) {
    return cy.xpath(`${this.#getId()}//div[@role='row' and contains(@id, '${row}AssetPairCreation')]`)
  }

  getClassNamesColumns() {
    const classNames = {
      validAssetPair: "col-id",
      type: "col-type",
      perpetualSwap: "col-perpetualSwap",
      enabled: "col-enabled"
    }

    return classNames
  }

  getHeaderNamesColumns() {
    const headerValues = {
      VALID_ASSET_PAIR: 1,
      TYPE: 2 
    }

    return headerValues
  }


}