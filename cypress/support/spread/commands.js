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
 * Date: 19/04/23 9:2
 * Author(s): Diego Graf
 * 
 */

const BosonicUI = require('../bosonic.constants')

/* X_AXIS and Y_AXIS to Add Widget */
const X_AXIS_WIDGET = 250
const Y_AXIS_WIDGET = 500

/* Widgets */
const ENTITIES_SPREAD = BosonicUI.CENTRAL.WIDGETS.ENTITIES_SPREAD
const TAKER_SPREAD_TEMPLATES = BosonicUI.CENTRAL.WIDGETS.TAKER_SPREAD_TEMPLATES

/* Waits */
const MEDIUM = BosonicUI.WAIT.MEDIUM
const STANDARD = BosonicUI.WAIT.STANDARD
const LOW = BosonicUI.WAIT.LOW

/**
 * Create a Spread Template
 * @param {String} url_central
 * @param {Json} user_central
 * @param {String} spread_template_name
 * @param {String} default_spread
 */

Cypress.Commands.add('createSpreadTemplate', (url_central, user_central, spread_template_name, default_spread) => {
  
  /* Login in Central and add Taker Spread Templates Widget */
  cy.loginAndDescription(url_central, user_central)
  cy.logMessage('Login in central and add Taker Spread Template widget')
  cy.addWidget(TAKER_SPREAD_TEMPLATES.NAME, X_AXIS_WIDGET, Y_AXIS_WIDGET)
  cy.contains(TAKER_SPREAD_TEMPLATES.NAME).click().wait(LOW)
  cy.wait(MEDIUM)

  /* Add a new Taker Spread Template */
  cy.xpath(TAKER_SPREAD_TEMPLATES.TEMPLATE_NAME).type(spread_template_name).wait(LOW)
  cy.xpath(TAKER_SPREAD_TEMPLATES.DEFAULT_SPREAD).type(default_spread).wait(LOW)
  cy.xpath(TAKER_SPREAD_TEMPLATES.DEFAULT_FILL_TO_SPREAD).type(default_spread).wait(LOW)
  cy.xpath(TAKER_SPREAD_TEMPLATES.BTN_ADD).click().wait(LOW)

  /* Check if the Taker Spread Template was created */
  cy.xpath(TAKER_SPREAD_TEMPLATES.SELECTED_SPREAD_TEMPLATE_FIRST_PART + spread_template_name + TAKER_SPREAD_TEMPLATES.SELECTED_SPREAD_TEMPLATE_SECOND_PART).then($selected_template => {
    expect($selected_template.text(), "Check if the Taker Spread Template was created").to.equal(spread_template_name)
  })
  cy.logout()
})

/**
 * Remove an entity spread
 * @param {String} url_central
 * @param {Json} user_central
 * @param {String} spread_template_name
 */

Cypress.Commands.add('removeEntitySpread', (url_central, user_central, spread_template_name) => {
  
  /* Login in Central and add Entities Spread Widget */
  cy.loginAndDescription(url_central, user_central)
  cy.logMessage('Login in central and add Entities Spread widget')
  cy.addWidget(ENTITIES_SPREAD.NAME, X_AXIS_WIDGET, Y_AXIS_WIDGET)
  cy.contains(ENTITIES_SPREAD.NAME).click().wait(LOW)
  cy.wait(MEDIUM)

  /* Delete the template */
  cy.xpath(ENTITIES_SPREAD.SPREAD_TO_DELETE_FIRST_PART + spread_template_name + ENTITIES_SPREAD.SPREAD_TO_DELETE_SECOND_PART).click({ force: true }).wait(LOW)
  cy.xpath(ENTITIES_SPREAD.BTN_DELETE).click({ force: true }).wait(STANDARD)

  /* Check if the entity spread applied was successful deleted */    
  cy.xpath('count(' + ENTITIES_SPREAD.SPREAD_TO_ADD_FIRST_PART + spread_template_name + ENTITIES_SPREAD.SPREAD_TO_ADD_SECOND_PART + ')').then($count => {
    expect($count, 'The entity spread applied was successful deleted').to.equal(0)
  })   

  cy.logout()
})

/**
 * Add an entity spread to TM in the Entities Spread Widget
 * @param {String} url_central
 * @param {Json} user_central
 * @param {String} spread_broker
 * @param {String} broker_user
 * @param {String} spread_template_name
 * @param {String} app
 */

Cypress.Commands.add('addEntitySpread', (url_central, user_central, spread_broker, broker_user, spread_template_name, app) => {

  /* Login in Central and add Entities Spread Widget */
  cy.loginAndDescription(url_central, user_central)
  cy.logMessage('Login in central and add Entities Spread widget')
  cy.addWidget(ENTITIES_SPREAD.NAME, X_AXIS_WIDGET, Y_AXIS_WIDGET)
  cy.contains(ENTITIES_SPREAD.NAME).click().wait(LOW)
  cy.wait(MEDIUM)

  /* Add the template to the TM in the Entities Spread Widget */
  cy.xpath(ENTITIES_SPREAD.CLIENT_ENTITY).type(app.toUpperCase(), { force: true }).wait(LOW)
  cy.xpath(ENTITIES_SPREAD.SELECT_ITEM_FIRST_PART + app.toUpperCase() + ENTITIES_SPREAD.SELECT_ITEM_SECOND_PART).click({force:true}).wait(LOW)
  cy.xpath(ENTITIES_SPREAD.SPREAD_BROKER).type(spread_broker, { force: true }).wait(LOW)
  cy.xpath(ENTITIES_SPREAD.SELECT_ITEM_FIRST_PART + spread_broker + ENTITIES_SPREAD.SELECT_ITEM_SECOND_PART).click({force:true}).wait(LOW)
  cy.xpath(ENTITIES_SPREAD.BROKER_USER).type(broker_user, { force: true }).wait(LOW)
  cy.xpath(ENTITIES_SPREAD.SELECT_ITEM_FIRST_PART + broker_user + ENTITIES_SPREAD.SELECT_ITEM_SECOND_PART).click({force:true}).wait(LOW)
  cy.xpath(ENTITIES_SPREAD.TEMPLATE).type(spread_template_name, { force: true }).wait(LOW)
  cy.xpath(ENTITIES_SPREAD.SELECT_ITEM_FIRST_PART + spread_template_name + ENTITIES_SPREAD.SELECT_ITEM_SECOND_PART).click({force:true}).wait(LOW)
  cy.xpath(ENTITIES_SPREAD.BTN_SAVE).click({ force: true }).wait(STANDARD)    

  /* Check if the template was successful added */
  cy.xpath('count(' + ENTITIES_SPREAD.SPREAD_TO_ADD_FIRST_PART + spread_template_name + ENTITIES_SPREAD.SPREAD_TO_ADD_SECOND_PART + ')').then($count => {
    expect($count, 'The template was successful added').to.equal(1)
  })

  cy.logout()

})

/**
 * Delete a Spread Template
 * @param {String} url_central
 * @param {Json} user_central
 * @param {String} spread_template_name 
 */

Cypress.Commands.add('deleteSpreadTemplate', (url_central, user_central, spread_template_name) => {

  /* Login in Central and add Taker Spread Templates Widget */
  cy.loginAndDescription(url_central, user_central)
  cy.logMessage('Login in central and add Taker Spread Template widget')
  cy.addWidget(TAKER_SPREAD_TEMPLATES.NAME, X_AXIS_WIDGET, Y_AXIS_WIDGET)
  cy.contains(TAKER_SPREAD_TEMPLATES.NAME).click().wait(LOW)
  cy.wait(MEDIUM)

  /* Delete the Taker Spread Template */
  cy.xpath(TAKER_SPREAD_TEMPLATES.SPREAD_TEMPLATE_SELECT_INPUT).type(spread_template_name, { force: true }).wait(STANDARD)
  cy.xpath(TAKER_SPREAD_TEMPLATES.SPREAD_TEMPLATE_SELECT_ITEM_FIRST_PART + spread_template_name + TAKER_SPREAD_TEMPLATES.SPREAD_TEMPLATE_SELECT_ITEM_SECOND_PART).click({ force: true })
  cy.xpath(TAKER_SPREAD_TEMPLATES.BTN_DELETE).click({ force: true }).wait(STANDARD)  
  cy.xpath(TAKER_SPREAD_TEMPLATES.BTN_CONFIRM_DELETE).click({force: true}).wait(STANDARD)

  /* Check if the template was successful deleted*/
  cy.xpath(TAKER_SPREAD_TEMPLATES.SPREAD_TEMPLATE_SELECT_INPUT).type(spread_template_name, { force: true }).wait(STANDARD)
  cy.xpath('count(' + TAKER_SPREAD_TEMPLATES.SPREAD_TEMPLATE_SELECT_ITEM_FIRST_PART + spread_template_name + TAKER_SPREAD_TEMPLATES.SPREAD_TEMPLATE_SELECT_ITEM_SECOND_PART + ')').then($count => {
    expect($count, "The template was successful deleted").to.equal(0)
  })
  
  cy.logout()
})