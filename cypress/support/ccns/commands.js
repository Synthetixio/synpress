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
 * Date: 01/10/2024
 * Author(s): Victor Fattor
 * -----
 * Last Modified: 7/18/24
 * Modified By: Eberle David
 * -----
 * 
 */

const scheduleSetupFile = 'tests/e2e/specs/output_files/scheduleSetup.json'
const { WAIT } = require('../../../cypress/support/bosonic.enum.wait')
const ENV = require('../../../cypress/support/bosonic.environments')
const URL_CENTRAL = ENV.BASE_URL_CENTRAL
const USER_CENTRAL = ENV.USERS.CENTRAL

/* Import widgets */
import CcnsConfigurationWidget from '../../../cypress/widgets/central/CcnsConfigurationWidget'
const ccnsConfigurationWidget = new CcnsConfigurationWidget()

import CrossCustodianNetSettlementsWidget from '../../../cypress/widgets/central/CrossCustodianNetSettlementsWidget'
const crossCustodianNetSettlementsWidget = new CrossCustodianNetSettlementsWidget()

/**
 * Remove a schedule.
 */
Cypress.Commands.add('removeSchedule', () => {

  cy.loginAndDescription(URL_CENTRAL, USER_CENTRAL, "Login Central and add CCNS configuration widget")
  cy.contains(ccnsConfigurationWidget.getScheduleConfigurationTitleLabel()).click({ force: true })
  ccnsConfigurationWidget.getScheduleConfigurationMaximizeButton().click()

  cy.readFile(scheduleSetupFile).then(scheduleInfo => {

    ccnsConfigurationWidget.getUpdateConfigurationButton().click()

    ccnsConfigurationWidget.getScheduleConfigurationRootDiv().then($root => {

      cy.wait(WAIT.STANDARD)

      const qtyRows = $root.find(ccnsConfigurationWidget.getScheduleConfigurationAllRowsInColumnAction()).length

      for (let row = 0; row < qtyRows; row++) {

        ccnsConfigurationWidget.getScheduleConfigurationFieldRunHourByIndex(row).then(hour => {
          ccnsConfigurationWidget.getScheduleConfigurationFieldRunMinuteByIndex(row).then(minute => {
            ccnsConfigurationWidget.getScheduleConfigurationFieldRunTimeZoneByIndex(row).then(timeZone => {

              let sameHour = hour.text() == scheduleInfo.hour
              let sameMinute = minute.text() == scheduleInfo.minute
              let sameTimeZone = timeZone.text() == scheduleInfo.timezone

              if (sameHour && sameMinute && sameTimeZone) {

                ccnsConfigurationWidget.getScheduleConfigurationRemoveButtonByIndex(row).click({ force: true })

                ccnsConfigurationWidget.getScheduleConfigurationConfirmRemoveButtonByIndex(row).click({ force: true })
                cy.logMessage("Schedule Configuration selected to remove correctly !")

                cy.wait(WAIT.LONG)

                ccnsConfigurationWidget.getScheduleConfigurationSubmitButton().click()
                cy.contains('CCNS Configuration has been submitted.')
              }
              else {
                cy.logMessage("There aren't Schedule Configuration configured with this parameters!")
              }
            })
          })
        })
      }
    })
  })
})

/**
 * Create a schedule.
 * @param {Integer} minutesToWait: Minutes to wait until the schedule is executed.
 */
Cypress.Commands.add('createSchedule', (minutesToWait = 3) => {

  cy.loginAndDescription(URL_CENTRAL, USER_CENTRAL, "Login Central and add CCNS configuration widget")
  cy.addWidget(ccnsConfigurationWidget.getWidgetName(), 250, 250)
  cy.contains(ccnsConfigurationWidget.getScheduleConfigurationTitleLabel()).click({ force: true })
  ccnsConfigurationWidget.getScheduleConfigurationMaximizeButton().click()

  ccnsConfigurationWidget.getUpdateConfigurationButton().click()

  let scheduleSetup = setDateScheduleToRunInTest(minutesToWait)

  //clean json file
  cy.writeFile(scheduleSetupFile, '')

  //we need to save the schedule in a json file to get this after in test to delete the schedule.
  let setupValues = JSON.stringify(scheduleSetup)
  cy.writeFile(scheduleSetupFile, setupValues)

  ccnsConfigurationWidget.getScheduleConfigurationRunHourSelect().click()
  ccnsConfigurationWidget.getScheduleConfigurationRunHourOption(scheduleSetup.hour).click()

  ccnsConfigurationWidget.getScheduleConfigurationRunMinuteSelect().click()

  ccnsConfigurationWidget.getScheduleConfigurationRunMinuteOption(scheduleSetup.minute).click()

  ccnsConfigurationWidget.getScheduleConfigurationRunTimeZoneSelect().click().type(`${scheduleSetup.timezone} {enter}`)

  ccnsConfigurationWidget.getScheduleConfigurationRunStartDateDatePicker().click()
  if (scheduleSetup.needToAddOneDay) {
    if (scheduleSetup.cssDayCalendarIsCorrect) {
      ccnsConfigurationWidget.getScheduleConfigurationTomorrowDayDatePickerCell().click()
    } else {
      ccnsConfigurationWidget.getScheduleConfigurationAfterTomorrowDayDatePickerCell().click()
    }
  } else {
    if (scheduleSetup.cssDayCalendarIsCorrect) {
      ccnsConfigurationWidget.getScheduleConfigurationTodayDayDatePickerCell().click()
    } else {
      ccnsConfigurationWidget.getScheduleConfigurationTomorrowDayDatePickerCell().click()
    }
  }

  ccnsConfigurationWidget.getScheduleConfigurationAddScheduleButton().click({ force: true }).wait(WAIT.STANDARD)

  ccnsConfigurationWidget.getScheduleConfigurationSubmitButton().click()
  cy.contains('CCNS Configuration has been submitted.')
})


/**
 * Wait until one minute after the programmed schedule has elapsed.
 */
Cypress.Commands.add('waitScheduleFinished', () => {
  cy.readFile(scheduleSetupFile).then(scheduleInfo => {
    const { hour, minute, timezone } = scheduleInfo;

    const now = new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));
    now.setHours(hour, minute, 0, 0);

    const nextMinute = new Date(now.getTime() + 120000);
    const waitTime = nextMinute - new Date();

    const wait = Math.max(waitTime, 0);

    cy.logMessage("Waiting: " + wait + " miliseconds")

    cy.wait(wait);
  });
})
/**
 * Function to generate object with schedule configuration data.
 * @param {Integer} minutesToWait: Minutes to wait until the schedule is executed. 
 * @returns {Json} scheduleSetup
 */
function setDateScheduleToRunInTest(minutesToWait = 3) {

  const currentDate = new Date()

  let actualHour = currentDate.getHours()
  let totalMinutes = currentDate.getMinutes() + minutesToWait
  let hoursToAdd = 0
  let needToAddOneDay = false
  let cssDayCalendarIsCorrect = true

  ccnsConfigurationWidget.getScheduleConfigurationRunStartDateDatePicker().click()
  ccnsConfigurationWidget.getScheduleConfigurationTodayDayDatePickerCell().then(todayDayInCalendar => {
    if (todayDayInCalendar != currentDate.getDate()) {
      cssDayCalendarIsCorrect = false
    }
  })
  ccnsConfigurationWidget.getScheduleConfigurationRunStartDateDatePicker().click()

  if (totalMinutes > 59) {
    hoursToAdd = Math.trunc(totalMinutes / 60)
    totalMinutes = Math.trunc(((totalMinutes / 60) - (Math.trunc(totalMinutes / 60))) * 60)
  }

  actualHour = actualHour + hoursToAdd

  if (actualHour >= 24) {
    actualHour = actualHour - 24
    needToAddOneDay = true
  }
  let scheduleSetup = {
    hour: actualHour,
    minute: totalMinutes,
    timezone: getCurrentTimezoneString(),
    needToAddOneDay,
    cssDayCalendarIsCorrect
  }

  return scheduleSetup
}

function getCurrentTimezoneString() {
  const offset = new Date().getTimezoneOffset()
  const sign = offset <= 0 ? '+' : '-'
  const hours = Math.abs(offset / 60).toString()
  // TODO: the following is a patch, until the CCNS scheduler works with gmt-3. Currently it works with gmt+0, and with "America/Argentina/Buenos_Aires".
  if (sign === '-' && hours === '3') {
    return "America/Argentina/Buenos_Aires";
  }
  return `Etc/GMT${sign}${hours}`
}

/**
 * Run report from CCNS Widget in central
 */
Cypress.Commands.add('runCcnsReportFromCcnsWidget', () => {

  cy.loginAndDescription(URL_CENTRAL, USER_CENTRAL, "Login Central and add CCNS widget")

  cy.addWidget(crossCustodianNetSettlementsWidget.getNameWidgetText())

  cy.wait(WAIT.MEDIUM)

  crossCustodianNetSettlementsWidget.getRunReportButton().click({ force: true })

  cy.contains('CCNS run execution successfully started.').should('be.visible', { timeout: WAIT.MEDIUM })

  cy.logout()
})
