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
 * Date: 07/03/23 2:49
 * Author(s): Diego Graf
 * 
 */

const BosonicUI = require('../bosonic.constants')

/* Widgets */
const CENTRAL = BosonicUI.CENTRAL.WIDGETS


/* Waits */
const LOW = BosonicUI.WAIT.LOW
const LONG = BosonicUI.WAIT.LONG
const STANDARD = BosonicUI.WAIT.STANDARD
const HIGH = BosonicUI.WAIT.HIGH

/**
 * Switch to Enabled/Disabled or Disabled/Enabled 2FA in an Application and check if the status is correct
 * @param {String} urlCentral
 * @param {Json} userCentral 
 * @param {String} app
 * @param {String} status
 */

Cypress.Commands.add('switch2FA', (urlCentral, userCentral, app, status) => {

  /* Login */
  cy.loginAndDescription(urlCentral, userCentral, 'Open Application List and Application Creation Widget and enable/disable 2FA in ' + app)

  /* Add necessary widgets */
  cy.addWidget(CENTRAL.APPLICATIONS_LIST.NAME, 250, 250).wait(LOW)
  cy.addWidget(CENTRAL.APPLICATIONS_CREATION.NAME, 250, 250).wait(LOW)
  cy.contains(CENTRAL.APPLICATIONS_LIST.NAME).click().wait(LOW)

  /* Click on the necessary row of Application List*/
  cy.xpath(CENTRAL.APPLICATIONS_LIST.ROW.FIELD_NAME_FIRST_PART + app.toUpperCase() + CENTRAL.APPLICATIONS_LIST.ROW.FIELD_NAME_SECOND_PART).click().wait(LOW)

  /* Click on Application Creation Widget */
  cy.contains(CENTRAL.APPLICATIONS_CREATION.NAME).click().wait(LOW)

  /* Enable/Disable 2FA */
  cy.xpath(CENTRAL.APPLICATIONS_CREATION.UPDATE_APPLICATION_BUTTON).click().wait(LOW)
  cy.xpath(CENTRAL.APPLICATIONS_CREATION.ENABLE_2FA_SLIDER).click().wait(LOW)

  cy.xpath(CENTRAL.APPLICATIONS_CREATION.SUBMIT_BUTTON).click({ force: true }).wait(HIGH)

  cy.xpath(CENTRAL.APPLICATIONS_CREATION.CONFIRM_MODAL.CONFIRM_BTN).click().wait(STANDARD)  

  /* Now check if the status is correct */
  
  /* Click on Application Creation Widget */
  cy.contains(CENTRAL.APPLICATIONS_LIST.NAME).click().wait(LOW)

  /* Get the 2FA status of the application in Application List*/
  cy.xpath(CENTRAL.APPLICATIONS_LIST.ROW.FIELD_STATUS_FIRST_PART + app.toUpperCase() + CENTRAL.APPLICATIONS_LIST.ROW.FIELD_STATUS_SECOND_PART).then($status => {
    cy.get($status).invoke('text').as('status').then(app_status => { 
      expect(app_status, 'The status of 2FA must be ' + status).to.be.equal(status)
    })
    
  }).wait(LOW)


  cy.logout()
})