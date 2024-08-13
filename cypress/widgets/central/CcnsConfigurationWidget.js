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
 * Date: 06/06/24
 * Author(s): Diego Graf 
 * -----
 * Last Modified: 06/11/24
 * Modified By: Diego Graf
 * -----
 */
export default class CCNSConfigurationWidget {

  getScheduleConfigurationSubmitButton() {
    return cy.xpath('//div[@id="custodian-config-pane-schedule"]//div//div//button[@class="inline-block btn-positive btn-big" and text()="SUBMIT"]')
  }

  getScheduleConfigurationCancelButton() {
    return cy.xpath('//div[@id="custodian-config-pane-schedule"]//div//div//button[@class="inline-block btn-grey btn-big" and text()="CANCEL"]')
  }

  getUpdateConfigurationButton() {
    return cy.xpath('//div[@class="bosonic-tabs ccns-configuration"]//div//button[text()="UPDATE CONFIGURATION"]')
  }

  getWidgetName() {
    return 'CCNS Configuration'
  }

  getScheduleConfigurationTitleLabel() {
    return 'Schedule Configuration'
  }

  getScheduleConfigurationMaximizeButton() {
    return cy.xpath('//div[contains(@class, "flexlayout__tab_header_inner") and contains(., "CCNS Configuration")]/following-sibling::div/button')
  }

  getScheduleConfigurationRootDiv() {
    return cy.get('#root')
  }

  getScheduleConfigurationAllRowsInColumnAction() {
    return '[id*="contenttableCCNSConfigurationWidget"] [class*="col-action"]'
  }

  getScheduleConfigurationFieldRunHourByIndex(index) {
    return cy.xpath(`//div[contains(@id, "row${index}CCNSConfigurationWidget")]//div[contains(@role, "gridcell")][1]`)
  }

  getScheduleConfigurationFieldRunMinuteByIndex(index) {
    return cy.xpath(`//div[contains(@id, "row${index}CCNSConfigurationWidget")]//div[contains(@role, "gridcell")][2]`)
  }

  getScheduleConfigurationFieldRunTimeZoneByIndex(index) {
    return cy.xpath(`//div[contains(@id, "row${index}CCNSConfigurationWidget")]//div[contains(@role, "gridcell")][4]`)
  }

  getScheduleConfigurationRemoveButtonByIndex(index) {
    return cy.xpath(`//div[contains(@role, "row") and contains(@id, "row${index}CCNSConfigurationWidget")]//div//div//div//button`)
  }

  getScheduleConfigurationConfirmRemoveButtonByIndex(index) {
    return cy.xpath(`//div[contains(@id, "row${index}CCNSConfigurationWidget")]//div//div//div//span//a[contains(@class, "confirm-yes") and contains(text(), "YES")]`)
  }

  getScheduleConfigurationRunHourSelect() {
    return cy.get('[class="Select-control"]').contains("Select Run Hour")
  }

  getScheduleConfigurationRunHourOption(hour) {
    return cy.xpath(`//div[contains(@class, "Select-menu-outer")]//div[contains(@class, "Select-option") and @aria-label = ${hour}]`)
  }

  getScheduleConfigurationRunMinuteSelect() {
    return cy.get('[class="Select-control"]').contains("Select Run Minute")
  }

  getScheduleConfigurationRunMinuteOption(minute) {
    return cy.xpath(`//div[contains(@class, "Select-menu-outer")]//div[contains(@class, "Select-option") and @aria-label = ${minute}]`)
  }

  getScheduleConfigurationRunTimeZoneSelect() {
    return cy.get('[class="Select-control"]').contains("Select Timezone")
  }

  getScheduleConfigurationRunStartDateDatePicker() {
    return cy.get('[class*="jqx-icon-calendar"]')
  }

  getScheduleConfigurationTodayDayDatePickerCell() {
    return cy.get('[class*="jqx-calendar-cell-today"]')
  }

  getScheduleConfigurationTomorrowDayDatePickerCell() {
    return cy.xpath('(//td[contains(@class, "jqx-calendar-cell-today")]/following-sibling::td)[1]')
  }

  getScheduleConfigurationAfterTomorrowDayDatePickerCell() {
    return cy.xpath('(//td[contains(@class, "jqx-calendar-cell-today")]/following-sibling::td)[2]')
  }

  getScheduleConfigurationAddScheduleButton() {
    return cy.get('button[class*="btn-positive"]').contains('ADD SCHEDULE')
  }
}