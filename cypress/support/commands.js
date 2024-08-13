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
 * Date: 03/01/23 4:8
 * Author(s): Diego Graf
 * -----
 * Last Modified: 8/09/2024
 * Modified By: Victor Fattor
 * -----
 *  
 */

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


import 'cypress-localstorage-commands'
import 'cypress-file-upload'

import { webSocket } from 'rxjs/webSocket'
import LoginPage from '../widgets/LoginPage'
import MainPage from '../widgets/MainPage'
import OutboundTicketsWidget from '../widgets/trader/OutboundTicketsWidget'
import InboundTicketsWidget from '../widgets/trader/InboundTicketsWidget'
import PaymentsWidget from '../widgets/trader/PaymentsWidget'
import WalletModalWidget from '../widgets/custodian/WalletModalWidget'
import TokenWalletWidget from '../widgets/trader/TokenWalletWidget'
import BalancesWidget from '../widgets/trader/BalancesWidget'
import RatePanelWidget from '../widgets/trader/RatePanelWidget'

const mainPage = new MainPage
const loginPage = new LoginPage()
const outboundTicketsWidget = new OutboundTicketsWidget()
const inboundTicketsWidget = new InboundTicketsWidget()
const paymentsWidget = new PaymentsWidget()
const walletModalWidget = new WalletModalWidget()
const BosonicUI = require('./bosonic.constants')
const tokenWalletWidget = new TokenWalletWidget()
const balancesWidget = new BalancesWidget()
const ratePanelWidget = new RatePanelWidget()

/* Commands TimeOut */
const DEFAULT_COMMAND_TIMEOUT = 100000

/* Widgets */
const NETSETTLEMENT_MOVEMENTS = BosonicUI.CUSTODIAN.WIDGETS.NETSETTLEMENT_MOVEMENTS
const BACKGROUND_TASK = BosonicUI.CUSTODIAN.WIDGETS.BACKGROUND_TASK
const TRADER_RFQ_OUT = BosonicUI.TRADER.WIDGETS.RFQ_OUT
const ENTITY_WHITELIST = BosonicUI.CENTRAL.WIDGETS.ENTITY_WHITELIST

/* Waits */
const { WAIT } = require('./bosonic.enum.wait')
const CUSTOM_WAIT = 50000

/* Local Storage */
let LOCAL_STORAGE_MEMORY = {}

const enter = '{enter}'
const FUNDS_TRANSFER_SETTLED = "Funds transfer settled"
const ASSET_TRANSFER_SETTLED = "Asset transfer settled"
const STATUS_SETTLED = "settled"

Cypress.config('defaultCommandTimeout', DEFAULT_COMMAND_TIMEOUT)

Cypress.Commands.add('dragAndDrop', (selector, x, y) => {
  cy.get(selector)
    .trigger('mousedown', {
      which: 1
    })
    .trigger('mousemove', {
      clientX: x,
      clientY: y
    })
    .trigger('mouseup', {
      force: true
    })
})

Cypress.Commands.add('dragAndDropWithWaits', (selector, x, y) => {
  cy.wait(WAIT.LOW)
  cy.get(selector)
    .trigger('mousedown', {
      which: 1
    })
    .trigger('mousemove', {
      clientX: x,
      clientY: y
    })
    .trigger('mouseup', {
      force: true
    })
  cy.wait(WAIT.LOW)
})

Cypress.Commands.add('dragAndDropXpath', (selector, x, y) => {
  selector
    .trigger('mousedown', {
      which: 1
    })
    .trigger('mousemove', {
      clientX: x,
      clientY: y
    })
    .trigger('mouseup', {
      force: true
    })
})

Cypress.Commands.add('getRequestToken', (BASE_URL, USER) => {
  cy.request('POST', BASE_URL + 'sso/api/login', {
    "username": USER.USER,
    "password": USER.PASS,
    "code": USER.CODE,
    "redirectTo": BASE_URL
  })
})

///////////////////////////
Cypress.Commands.add('login', (USER) => {
  cy.completeLoginForm(USER)
  cy.logMessage('**Login Successful: APP **' + USER.APP + ', _' + USER.USER + '_**').wait(WAIT.STANDARD)

  switch (USER.APP) {
    case "cust1":
    case "cust2":
      cy.contains(BosonicUI.CUSTODIAN.DESK_LABEL).should('be.visible')
      break
    case "tm1":
    case "tm2":
      if (USER.GROUP == 'User-Broker' || USER.GROUP == 'User-Broker-ReadOnly') {
        cy.contains(BosonicUI.BROKER.DESK_LABEL).should('be.visible')
      } else if (USER.GROUP == 'User-Trader' || USER.GROUP == 'User-Trader-ReadOnly') {
        cy.contains(BosonicUI.TRADER.DESK_LABEL).should('be.visible')
      }
      break
    case "central":
      if (USER.GROUP == 'User-Broker' || USER.GROUP == 'User-Broker-ReadOnly') {
        cy.contains(BosonicUI.BROKER.DESK_LABEL).should('be.visible')
      } else if (USER.GROUP == 'User-Admin' || USER.GROUP == 'User-Admin-ReadOnly') {
        cy.contains(BosonicUI.CENTRAL.DESK_LABEL).should('be.visible')
      }
      break
  }

  cy.wait(BosonicUI.WAIT.MEDIUM)

})

Cypress.Commands.add('loginSession', (URL, USER) => {
  cy.session([USER.USER, USER.PASS], () => {
    cy.visit(URL)
    cy.completeLoginForm(USER)
  })
})

Cypress.Commands.add('logout', () => {
  mainPage.getNavbarProfileMenu().click()
  mainPage.getLogoutMenuItem().click()
})

Cypress.Commands.add('addWidget', (name, x = 250, y = 250, timeToWait = 0) => {
  cy.logMessage(`Add ${name} widget.`)
  cy.wait(timeToWait)
  mainPage.getSelectItemMenu(name).click({ force: true })
  cy.dragAndDrop('.flexlayout__drag_rect', x, y).wait(WAIT.MEDIUM)
  cy.contains(name).should('be.visible')
})

Cypress.Commands.add('getUserToken', () => {
  cy.getLocalStorage('OauthToken').then(($OauthToken) => {
    if ($OauthToken) return JSON.parse($OauthToken).accessToken
  })
})

Cypress.Commands.add('getTraderBalance', (custodian, user) => {
  cy.getUserToken()
    .then((token => {
      let options = {
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/rest/custodians/${custodian}/ledgers/amount?memberName=${user}&eventId=bosonic-e2e-testing`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }

      cy.request(options).then(response => response.body)
    }))
})

Cypress.Commands.add('getTraderBalanceWithToken', (custodian, user, token) => {
  let options = {
    method: 'GET',
    url: `${Cypress.config('baseUrl')}rest/custodians/${custodian}/ledgers/amount?memberName=${user}&eventId=bosonic-e2e-testing`,
    headers: {
      'Authorization': `Bearer ${token.headers['authorization'].replace('Bearer ', '')}`
    }
  }
  cy.request(options).then(response => response.body)
})

Cypress.Commands.add('getTraderBalanceWithTokenOnlyAPI', (base_url, custodian, user, token) => {
  let options = {
    method: 'GET',
    url: `${base_url}rest/custodians/${custodian}/ledgers/amount?memberName=${user}&eventId=bosonic-e2e-testing`,
    headers: {
      'Authorization': `Bearer ${token.headers['authorization'].replace('Bearer ', '')}`
    }
  }
  cy.request(options).then(response => response.body)
})

Cypress.Commands.add('getTraderBalanceWithBearerOnlyAPI', (base_url, custodian, user, bearer) => {
  let options = {
    method: 'GET',
    url: `${base_url}rest/custodians/${custodian}/ledgers/amount?memberName=${user}&eventId=bosonic-e2e-testing`,
    headers: {
      'Authorization': `Bearer ${bearer}`
    }
  }
  cy.request(options).then(response => response.body)
})

/**
 * Make a trade from an user logged 
 * @param {Object} rfqOrderData -Data to complete "RFQ ticket" form.
 */
Cypress.Commands.add('makeRfqOrder', (rfqOrderData) => {
  outboundTicketsWidget.getOutboundTicket().within(() => {
    outboundTicketsWidget.getOrderTypeSelectOption().click().contains(`${rfqOrderData.orderType}`).click()
    outboundTicketsWidget.getTifSelectOption().click().contains(`${rfqOrderData.tif}`).click()
    outboundTicketsWidget.getQuoteTypeSelectOption().click().contains(`${rfqOrderData.quoteType}`).click()
    outboundTicketsWidget.getSideSelectOption().click().contains(`${rfqOrderData.side}`).click()
    outboundTicketsWidget.getAsset1SelectOption().click().type(`${rfqOrderData.asset1} {enter}`)
    outboundTicketsWidget.getAsset2SelectOption().click().type(`${rfqOrderData.asset2} {enter}`)
    outboundTicketsWidget.getCustodianSelectOption().click().type(`${rfqOrderData.custodian} {enter}`).click()
    outboundTicketsWidget.getAmountInput().click().clear().type(`${rfqOrderData.amount} {enter}`)
    outboundTicketsWidget.getRateInput().click().clear().type(`${rfqOrderData.rate} {enter}`)
    outboundTicketsWidget.getCounterpartySelectOption().click().wait(WAIT.MEDIUM)
  })

  outboundTicketsWidget.getCounterpartyInput().type(rfqOrderData.counterparty).wait(WAIT.LOW)
  cy.contains(rfqOrderData.counterparty).click().wait(WAIT.LOW)
  outboundTicketsWidget.getCounterpartySelectOption().click().wait(WAIT.LOW)

  outboundTicketsWidget.getOutboundTicket().click()
  outboundTicketsWidget.getSendButton().click()
})

/**
 * Match a trade 
 * @param {Object} rfqOrderData -Data to complete "RFQ ticket" form.
 */
Cypress.Commands.add('matchRfqTrade', (rfqOrderData) => {
  inboundTicketsWidget.getInboundTicket().within(() => {
    inboundTicketsWidget.getCustodianSelectOption().click().type(`${rfqOrderData.custodian2} {enter}`)
  })

  cy.wait(WAIT.STANDARD)

  inboundTicketsWidget.getAcceptButton().click()
})

Cypress.Commands.add('newRFQOrder', (orderType, tif, quoteType, side, asset1, asset2, custodian, amount, rate, counterParty) => {
  cy.get(TRADER_RFQ_OUT.FRAME)
    .within(($widget) => {

      // order type
      cy.get(TRADER_RFQ_OUT.ARROW_BTN).first().click()
      cy.contains(orderType).click()

      // tif
      cy.get(TRADER_RFQ_OUT.ARROW_BTN).eq(1).click()
      cy.contains(tif).click()

      //QUOTE TYPE
      cy.get(TRADER_RFQ_OUT.ARROW_BTN).eq(2).click()
      cy.contains(quoteType).click()

      // SIDE
      cy.get(TRADER_RFQ_OUT.ARROW_BTN).eq(3).click()
      cy.contains(side).click()

      // ASSET 1
      cy.get(TRADER_RFQ_OUT.ARROW_BTN).eq(4).type(`${asset1}${enter}`)

      // ASSET 2
      cy.get(TRADER_RFQ_OUT.ARROW_BTN).eq(6).type(`${asset2}${enter}`)

      // CUSTODIAN
      cy.get(TRADER_RFQ_OUT.ARROW_BTN).eq(5).type(`${custodian}${enter}`)

      // AMOUNT
      cy.get(TRADER_RFQ_OUT.AMOUNT_INPUT).click().type(`${amount}`)

      // RATE
      cy.get(TRADER_RFQ_OUT.RATE_INPUT).click().type(`${rate}`)

      // COUNTERPARTY
      cy.get(TRADER_RFQ_OUT.COUNTERPARTY_SELECT).click()

      cy.wait(WAIT.STANDARD)

    })
  cy.contains(counterParty).click()

  cy.contains(TRADER_RFQ_OUT.SEND_BTN).click()
})

Cypress.Commands.add('openUrlAndLogin', (BASE_URL, USER) => {
  Cypress.config('baseUrl', BASE_URL)
  cy.visit(BosonicUI.COMMON.LOGIN)
  cy.wait(WAIT.STANDARD)
  cy.login(USER)
})

Cypress.Commands.add('loginAndDescription', (BASE_URL, USER, description = '') => {
  cy.openUrlAndLogin(BASE_URL, USER)
  let msg = description != '' ? ': _' + description + '_' : ' logged in'
  cy.log('**' + USER.APP + msg + '**')
})

Cypress.Commands.add('getEndpointResponseStatus', (bearer, url, method, body) => {
  cy.request({
    method,
    url,
    body,
    auth: {
      'bearer': bearer
    }
  }).then(response => {
    return JSON.stringify(response.status)
  })
})

/**
 * This function get response information from the endpoint
 * @param {String} bearer Authorization Token
 * @param {String} url  Url to access
 * @param {String} method String to especify if POST or GET
 * @param {Json Object} body Body Request
 * @param {boolean} failOnStatusCode Ignore or not the status code on response.
 */
Cypress.Commands.add('getDataFromEndpoint', (bearer, url, method, body, failOnStatusCode) => {

  let byDefault = true

  if (failOnStatusCode != null) {
    byDefault = false
  }

  cy.request({
    method,
    url,
    body,
    auth: {
      'bearer': bearer
    },
    failOnStatusCode: byDefault,
  }).then(response => {
    return response
  })
})

/*
 * This function working with an array with one element with a string value.
 * Return true if the array has duplicates values or false in the another case.
 */
Cypress.Commands.add('oneElementStringArrayHasDuplicates', (oneElementStringArray) => {

  var valuesSoFar = Object.create(null)
  for (var i = 0; i < oneElementStringArray.length; ++i) {
    var value = oneElementStringArray[i]
    if (value in valuesSoFar) {
      return true
    }
    valuesSoFar[value] = true
  }
  return false

})

/**
 * this function working cancelling all orders in the open order widget
 */
Cypress.Commands.add('cancelAllOpenOrders', () => {
  cy.xpath('//*[contains(@id, "toolbarOpenOrdersBlotter")]/div/button').then(($btn) => {
    if (!$btn.prop('disabled')) {
      cy.log("There are open orders, then they will be canceled... ")
      cy.xpath('//*[contains(@id, "toolbarOpenOrdersBlotter")]/div/button').click({
        force: true
      }).wait(WAIT.STANDARD)
      cy.xpath("//div[contains(@class,'modal-content')]//button[contains(@class, 'positive')]").click().wait(WAIT.STANDARD).log("The orders were canceled.")
    } else {
      cy.log("There aren't open orders.")
    }
  })
})


/**
 * Show a message in cypress console, and show a message in the log when execute the spec with cypress run command
 */
Cypress.Commands.add('logMessage', (message) => {
  cy.task('log', message)

  // This will be output to the cypress console
  cy.log('# ' + message)
})

Cypress.Commands.add('decreaseMemoryUse', () => {
  cy.window().then(win => {
    if (win.gc) {
      // The GC needs to be run several times for it to be most effective.      
      for (var i = 0; i < 20; i++) {
        gc()
      }
    }
  })
})

/**
 * Run Net Settlement Report and validate if 'Net settlement finished'
 * appears in the Background Task widget and also validate if any error is generated after run the report
 * via WebSocket
 * @param {String} url
 * @param {String} user 
 */

Cypress.Commands.add('runReportAndValidate', (user, urlWebSocket, protocol) => {

  /*
   * Custodian: Run report from Net Settlement to get all pending movements
   */

  cy.xpath(NETSETTLEMENT_MOVEMENTS.RUN_REPORT_BTN).click()

  cy.wait(WAIT.LONG)

  const ws = webSocket({
    url: urlWebSocket,
    protocol: protocol,
    deserializer: (data) => {
      if (data.data != 'ok') {
        if (JSON.parse(data.data).type == 'reconciliation') {
          expect(JSON.parse(data.data).content.error, "Check if any error occurs after the Run Report").to.be.null
        }
      }
    }
  })

  ws.subscribe()
  ws.next({ content: 'null', type: 'reconciliation.subscribe', memberId: user })

  cy.get(BACKGROUND_TASK.BTN_WIDGET).click().wait(WAIT.HIGH)
  cy.contains(BACKGROUND_TASK.NAME).should('be.visible')
  cy.get(BACKGROUND_TASK.CONTAINER).contains('Net settlement finished').should('be.visible')

  // This wait is necessary to wait for the WebSocket message before IT ends
  cy.wait(CUSTOM_WAIT)

})

/**
 * Whitelist entities in Entity Whitelist in central
 * @param {Json} fixture_entities_whitelisted
 * @param {String} entity_type
 * @param {String} url_central
 * @param {Json} user_central 
 * @param {Array} tms involved
 */

Cypress.Commands.add('whitelistedEntities', (fixture_entities_whitelisted, entity_type, url_central, user_central, tmsInvolved) => {

  cy.loginAndDescription(url_central, user_central)

  /* Create a filtered array without the APP */
  const filter = (object, entity) => {
    return object.entity != entity
  }

  /* 
   * TODO: This code portion is repeated because we need to check 
   * or uncheck again to make the change effective into tms, 
   * due to a system issue. https://bosonic.atlassian.net/browse/PD-3921 
   */
  const TIMES = 2
  for (let times = 0; times < TIMES; times++) {

    tmsInvolved.forEach(tm => {
      const whitelistedEntitiesWithoutApp = fixture_entities_whitelisted.filter((fixture_entities_whitelisted) => filter(fixture_entities_whitelisted, tm))

      cy.xpath('(//div[@class="entity_whitelist"]//span[contains(@class, "Select-arrow-zone")])[1]').click({ force: true }).wait(WAIT.STANDARD)

      cy.xpath(ENTITY_WHITELIST.ENTITY_TYPE_ITEM_FIRST_PART + entity_type + ENTITY_WHITELIST.ENTITY_TYPE_ITEM_SECOND_PART).click().wait(WAIT.STANDARD)

      cy.xpath(ENTITY_WHITELIST.ENTITY_NAME).click().wait(WAIT.STANDARD)

      cy.xpath(ENTITY_WHITELIST.ENTITY_NAME_ITEM_FIRST_PART + tm + ENTITY_WHITELIST.ENTITY_TYPE_ITEM_SECOND_PART).click().wait(WAIT.STANDARD)

      /* Create an array with all the entities to whitelist  */
      const entities_whitelisted = []
      whitelistedEntitiesWithoutApp.forEach(entities => {
        entities_whitelisted.push(entities.entity)
      })

      /* First enable only the necessary entities */
      cy.xpath('count(' + ENTITY_WHITELIST.ENTITY_LIST + ')').then(($entities_quantity) => {
        for (let i = 1; i <= $entities_quantity; i++) {
          cy.xpath('(' + ENTITY_WHITELIST.ENTITY_LIST + ')[' + i + ']').then(() => {
            cy.xpath('(' + ENTITY_WHITELIST.ENTITY_LIST + ')[' + i + ']//label//span/preceding-sibling::input').as('checkbox').invoke('is', ':checked').then(checked => {
              cy.xpath('(' + ENTITY_WHITELIST.ENTITY_LIST + ')[' + i + ']//label//span/preceding-sibling::input').as('checkbox').invoke('val').then(value => {
                if (checked && !(entities_whitelisted.includes(value))) {
                  cy.xpath('(' + ENTITY_WHITELIST.ENTITY_LIST + ')[' + i + ']//label//span/preceding-sibling::input').uncheck({ force: true }).wait(WAIT.LOW)
                }
                else if (!checked && (entities_whitelisted.includes(value))) {
                  cy.xpath('(' + ENTITY_WHITELIST.ENTITY_LIST + ')[' + i + ']//label//span/preceding-sibling::input').check({ force: true }).wait(WAIT.LOW)
                }
              })
            })
          })
        }
      })

      cy.wait(WAIT.STANDARD)

      /* Submit the changes in the entities whitelisted */
      cy.xpath(ENTITY_WHITELIST.SUBMIT_BTN).click({ force: true })

    })
  }

  cy.logout()
})

/**
 * Whitelist entities in Entity Whitelist in central
 * @param {Json} fixture_entities_whitelisted
 * @param {String} entity_type
 * @param {String} url_central
 * @param {Json} user_central 
 * @param {Json} user_tm 
 */

Cypress.Commands.add('whiteListEntities', (fixture_entities_whitelisted, entity_type, url_central, user_central, user_tm) => {
  cy.loginAndDescription(url_central, user_central)

  /* Create a filtered array without the APP */
  const filter = (object, entity) => {
    return object.entity != entity
  }
  const whitelistedEntitiesWithoutApp = fixture_entities_whitelisted.filter((fixture_entities_whitelisted) => filter(fixture_entities_whitelisted, user_tm.APP.toUpperCase()))

  cy.xpath(ENTITY_WHITELIST.ENTITY_TYPE).click().wait(WAIT.STANDARD)

  cy.xpath(ENTITY_WHITELIST.ENTITY_TYPE_ITEM_FIRST_PART + entity_type + ENTITY_WHITELIST.ENTITY_TYPE_ITEM_SECOND_PART).click().wait(WAIT.STANDARD)

  cy.xpath(ENTITY_WHITELIST.ENTITY_NAME).click().wait(WAIT.STANDARD)

  cy.xpath(ENTITY_WHITELIST.ENTITY_NAME_ITEM_FIRST_PART + user_tm.APP.toUpperCase() + ENTITY_WHITELIST.ENTITY_TYPE_ITEM_SECOND_PART).click().wait(WAIT.STANDARD)

  /* Create an array with all the entities to whitelist  */
  const entities_whitelisted = []
  whitelistedEntitiesWithoutApp.forEach(entities => {
    entities_whitelisted.push(entities.entity)
  })

  /* First enable only the necessary entities */
  cy.xpath('count(' + ENTITY_WHITELIST.ENTITY_LIST + ')').then(($entities_quantity) => {
    for (let i = 1; i <= $entities_quantity; i++) {
      cy.xpath('(' + ENTITY_WHITELIST.ENTITY_LIST + ')[' + i + ']').then(() => {
        cy.xpath('(' + ENTITY_WHITELIST.ENTITY_LIST + ')[' + i + ']//label//span/preceding-sibling::input').as('checkbox').invoke('is', ':checked').then(checked => {
          cy.xpath('(' + ENTITY_WHITELIST.ENTITY_LIST + ')[' + i + ']//label//span/preceding-sibling::input').as('checkbox').invoke('val').then(value => {
            if (checked && !(entities_whitelisted.includes(value))) {
              cy.xpath('(' + ENTITY_WHITELIST.ENTITY_LIST + ')[' + i + ']//label//span/preceding-sibling::input').uncheck({ force: true })
            }
            else if (!checked && (entities_whitelisted.includes(value))) {
              cy.xpath('(' + ENTITY_WHITELIST.ENTITY_LIST + ')[' + i + ']//label//span/preceding-sibling::input').check({ force: true })
            }
          })
        })
      })
    }
  })

  /* Submit the changes in the entities whitelisted */
  cy.xpath(ENTITY_WHITELIST.SUBMIT_BTN).click({ force: true }).wait(WAIT.LOW)

  cy.logout()
})

/**
 * Drag and drop the horizontal scroll bar to get hidden columns only if is needed
 * @param {String} column
 * @param {String} horizontal_scroll_bar 
 */

Cypress.Commands.add('findColumn', (column, horizontal_scroll_bar) => {
  cy.decreaseMemoryUse()
  return cy.xpath('count(' + column + ')').then(count => {
    if (count == 0) {
      cy.dragAndDrop(horizontal_scroll_bar, 5000, 1080)
      return cy.findColumn(column, horizontal_scroll_bar)
    }
    else {
      return true
    }
  })
})

/**
 * Drag and drop the horizontal scroll bar to get hidden columns only if is needed
 * @param {String} column
 * @param {String} horizontal_scroll_bar 
 */

Cypress.Commands.add('findColumnXpath', (column, horizontal_scroll_bar) => {
  cy.decreaseMemoryUse()
  return cy.xpath('count(' + column + ')').then(count => {
    if (count == 0) {
      cy.dragAndDropXpath(horizontal_scroll_bar, 5000, 1080)
      return cy.findColumnXpath(column, horizontal_scroll_bar)
    }
    else {
      return true
    }
  })
})

/**
 * Get today's date in differents format
 * @param {String} format
 */
Cypress.Commands.add('getTodaysDate', (format) => {

  let date = new Date()
  let day = date.getDate()
  if (day < 10) {
    day = '0' + day
  }
  let month = date.getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }
  let year = date.getFullYear()

  switch (format) {
    case 'mm/dd/yyyy':
      return month + "/" + day + "/" + year
      break
  }
})

/**
 * Save localStorage 
 */
Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key]
  })
})

/**
 * Restore localStorage
 */
Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key])
  })
})

/**
 * Clear cookies and local storage data
*/
Cypress.Commands.add("clearDataBeforeTest", () => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.getCookies().should('be.empty')
  cy.getAllLocalStorage().should('be.empty')
})

Cypress.Commands.add('deleteJsonFileContent', (filePath) => {
  cy.task('deleteJsonFileContent', filePath)
})

Cypress.Commands.add('completeLoginForm', (USER) => {
  loginPage.getUsernameInput().type(USER.USER)
  loginPage.getPasswordInput().type(USER.PASS)
  loginPage.getLoginButton().click().wait(WAIT.LOW)

  cy.url().should('not.include', 'login')
})


Cypress.Commands.add('getBalancesTwoTmTowCustodianAndWriteFile', (jsonFile, userInfo1, userInfo1url, userInfo2, userInfo2url, tradeInfo) => {

  cy.deleteJsonFileContent(jsonFile)

  cy.writeFile(jsonFile, `[`, { flag: 'a+' });
  cy.getBalancesAndWriteFile(userInfo1, userInfo1url, tradeInfo, jsonFile, tradeInfo.custodian1)
  cy.writeFile(jsonFile, `,`, { flag: 'a+' });
  cy.getBalancesAndWriteFile(userInfo1, userInfo1url, tradeInfo, jsonFile, tradeInfo.custodian2)
  cy.writeFile(jsonFile, `,`, { flag: 'a+' });
  cy.getBalancesAndWriteFile(userInfo2, userInfo2url, tradeInfo, jsonFile, tradeInfo.custodian2)
  cy.writeFile(jsonFile, `,`, { flag: 'a+' });
  cy.getBalancesAndWriteFile(userInfo2, userInfo2url, tradeInfo, jsonFile, tradeInfo.custodian1)
  cy.writeFile(jsonFile, `]`, { flag: 'a+' });
})

Cypress.Commands.add('getBalancesTwoTmOneCustodianAndWriteFile', (jsonFile, userInfo1, userInfo1url, userInfo2, userInfo2url, tradeInfo) => {

  cy.deleteJsonFileContent(jsonFile)

  cy.writeFile(jsonFile, `[`, { flag: 'a+' })
  cy.getBalancesAndWriteFile(userInfo1, userInfo1url, tradeInfo, jsonFile, tradeInfo.custodian1)
  cy.writeFile(jsonFile, `,`, { flag: 'a+' })
  cy.getBalancesAndWriteFile(userInfo2, userInfo2url, tradeInfo, jsonFile, tradeInfo.custodian1)
  cy.writeFile(jsonFile, `]`, { flag: 'a+' })
})


/**
 *  Get balances and save in a JSON file.
 *  Only information about the assets included in the trade will be stored.
 *  @param userInfo {object} info related to the user
 *  @param userInfoUrl {string} Url to access into trader module.
 *  @param tradeInfo {object} info related to the operation
 *  @param jsonFile {JSON file} file where will be saved the information
 *  @param custodian {string} Custodian where the assets are to be searched for
 */

Cypress.Commands.add('getBalancesAndWriteFile', (userInfo, infoUserUrl, tradeInfo, jsonFile, custodian) => {
  let cust = custodian.replace(/ /g, "_");

  cy.request('POST', infoUserUrl + 'sso/api/login', {
    "username": userInfo.USER,
    "password": userInfo.PASS,
    "code": userInfo.CODE,
    "redirectTo": infoUserUrl
  }).then($token => {
    let options = {
      method: 'GET',
      url: `${infoUserUrl}rest/custodians/${cust}/ledgers/amount?memberName=${userInfo.USER}&eventId=bosonic-e2e-testing`,
      headers: {
        'Authorization': `Bearer ${$token.headers['authorization'].replace('Bearer ', '')}`
      }
    };
    cy.request(options).then(response => response.body);
  }).then($balances => {

    const totalBalance = [$balances[tradeInfo.asset1].total, $balances[tradeInfo.asset2].total];

    cy.writeFile(jsonFile, `{`, { flag: 'a+' });
    cy.writeFile(jsonFile, `"user": "${userInfo.USER}",`, { flag: 'a+' });
    cy.writeFile(jsonFile, `"custodian": "${cust}",`, { flag: 'a+' });
    cy.writeFile(jsonFile, `"` + tradeInfo.asset1 + `": ` + `${totalBalance[0]}` + ',', { flag: 'a+' });
    cy.writeFile(jsonFile, `"` + tradeInfo.asset2 + `": ` + `${totalBalance[1]}`, { flag: 'a+' });
    cy.writeFile(jsonFile, `}`, { flag: 'a+' });
  });
})

Cypress.Commands.add('deleteJsonFileContent', (file) => {
  cy.writeFile(file, '')
})

// Validates that the transaction has correctly impacted the balances. Ignore custodian, control totals
Cypress.Commands.add('validateBalancesVariationIgnoringCustodian', (initialBalances, finalBalances, user1, user2, tradeInfo) => {
  const { asset1, asset2, amount, rate } = tradeInfo;

  // Aggregate opening balances
  const initialUser1Balances = calculateTotalsByAssets(initialBalances, user1)
  const initialUser2Balances = calculateTotalsByAssets(initialBalances, user2)

  // Aggregate ending balances
  const finalUser1Balances = calculateTotalsByAssets(finalBalances, user1);
  const finalUser2Balances = calculateTotalsByAssets(finalBalances, user2);


  let expectedBalance = roundToDecimals(initialUser1Balances[asset1] - amount, 6);
  expect(finalUser1Balances[asset1]).to.equal(expectedBalance, "Checking variation of " + asset1 + " in user " + user1);

  expectedBalance = roundToDecimals(initialUser1Balances[asset2] + (rate * amount), 6);
  expect(finalUser1Balances[asset2]).to.equal(expectedBalance, "Checking variation of " + asset2 + " in user " + user1);


  expectedBalance = roundToDecimals(initialUser2Balances[asset1] + amount, 6);
  expect(finalUser2Balances[asset1]).to.equal(expectedBalance, "Checking variation of " + asset1 + " in user " + user2);

  expectedBalance = roundToDecimals(initialUser2Balances[asset2] - (rate * amount), 6);
  expect(finalUser2Balances[asset2]).to.equal(expectedBalance, "Checking variation of " + asset2 + " in user " + user2);
})

// Validates that the transaction has correctly impacted the balances. Ignore custodian, control totals
Cypress.Commands.add('validateBalancesVariationOneAssetIgnoringCustodian', (initialBalances, finalBalances, user1, user2, tradeInfo) => {
  const { asset1, amount, rate } = tradeInfo;

  // Aggregate opening balances
  const initialUser1Balances = calculateTotalsByAssets(initialBalances, user1)
  const initialUser2Balances = calculateTotalsByAssets(initialBalances, user2)

  // Aggregate ending balances
  const finalUser1Balances = calculateTotalsByAssets(finalBalances, user1);
  const finalUser2Balances = calculateTotalsByAssets(finalBalances, user2);


  let expectedBalance = roundToDecimals(initialUser1Balances[asset1] - amount, 6);
  expect(finalUser1Balances[asset1]).to.equal(expectedBalance, "Checking variation of " + asset1 + " in user " + user1);

  expectedBalance = roundToDecimals(initialUser2Balances[asset1] + amount, 6);
  expect(finalUser2Balances[asset1]).to.equal(expectedBalance, "Checking variation of " + asset1 + " in user " + user2);

})

// Validates that the transaction has correctly impacted the balances. Ignore custodian, control totals
Cypress.Commands.add('validateBalancesVariationOneAssetOneUserIgnoringCustodian', (initialBalances, finalBalances, user1, tradeInfo) => {
  const { asset1, amount } = tradeInfo;

  // Aggregate opening balances
  const initialUser1Balances = calculateTotalsByAssets(initialBalances, user1)

  // Aggregate ending balances
  const finalUser1Balances = calculateTotalsByAssets(finalBalances, user1);


  let expectedBalance = roundToDecimals(initialUser1Balances[asset1] + amount, 6);
  expect(finalUser1Balances[asset1]).to.equal(expectedBalance, "Checking variation of " + asset1 + " in user " + user1);

})

Cypress.Commands.add('validateBalancesVariationAfterCcns', (balanceAfterTrade, balanceAfterCcns, TRADER_INFO) => {
  let totalsAfterTrade = calculateTotalsByAssets(balanceAfterTrade, TRADER_INFO.USER);
  let totalsAfterCcns = calculateTotalsByAssets(balanceAfterCcns, TRADER_INFO.USER);

  let verification = balancesAreEquals(totalsAfterTrade, totalsAfterCcns);
  assert.strictEqual(verification, true, 'The totals by asset are not the same after running CCNS');
})

Cypress.Commands.add('allBalancesAreInHomeCustodian', (balanceAfterCcns, TRADER_INFO, custodian, fixture) => {
  let balancesMakerNotInHomeCustodian = balanceAfterCcns.filter(item =>
    item.user === TRADER_INFO.USER &&
    item.custodian != custodian &&
    !(item[fixture.asset1] === 0 && item[fixture.asset2] === 0)
  ).length;
  expect(balancesMakerNotInHomeCustodian, `Not all balances are in the Home Custodian: ${TRADER_INFO.USER}`).to.equal(0);
})

function calculateTotalsByAssets(balance, user = null) {
  const totals = {};

  balance.forEach(item => {
    if (user && item.user !== user) {
      return;
    }

    for (let asset in item) {
      if (asset !== 'user' && asset !== 'custodian') {
        const value = parseFloat(item[asset]) || 0;
        totals[asset] = (totals[asset] || 0) + value;
      }
    }
  });
  for (let asset in totals) {
    totals[asset] = roundToDecimals(totals[asset], 6);
  }
  return totals;
}

function roundToDecimals(number, decimals) {
  const factor = 10 ** decimals;
  return Math.round(number * factor) / factor;
}

function balancesAreEquals(balanceOne, balanceTwo) {
  try {
    assert.deepStrictEqual(balanceOne, balanceTwo);
    return true;
  } catch (error) {
    return false;
  }
}


Cypress.Commands.add('matchLmTrade', (lmOrderData) => {
  cy.xpath("//button[contains(@class, 'btn-top btn btn-xs btn-default')]").click({ multiple: true });

  cy.get('.rates-table').contains(lmOrderData.symbol).parent({ force: true }).click().wait(WAIT.STANDARD);
  cy.get('.rate-panel').contains(lmOrderData.symbol).scrollIntoView().should('be.visible');

  const containerSymbolSelector = `//div[@class='inline-block rate-panel' and div[@class='row header']/div/div/input[@value="${lmOrderData.symbol}"]]`;
  const matchAssetSelector = `//td[@class='buy' and @title='You Buy ${lmOrderData.asset1} ']`

  cy.xpath(containerSymbolSelector).within(
    function () {
      cy.xpath(matchAssetSelector).click().wait(WAIT.LOW)
      cy.get('[class*="send"] button[type="button"]').click()
    }
  );
});

Cypress.Commands.add('makeLmTrade', (lmOrderData) => {

  ratePanelWidget.getCloseWidgetButton().click({ multiple: true })

  cy.get('.rates-table').contains(lmOrderData.symbol).parent({ force: true }).click().wait(WAIT.STANDARD);
  cy.get('.rate-panel').contains(lmOrderData.symbol).scrollIntoView().should('be.visible');

  const containerSymbolSelector = `//div[@class='inline-block rate-panel' and div[@class='row header']/div/div/input[@value="${lmOrderData.symbol}"]]`;
  const custodianSelector = `//div[@role = 'option' and @aria-label = '${lmOrderData.custodian1}']`;

  // TODO: we need to modify the function to be able to select 'OFFER' or 'BID' depending on the required case.
  cy.xpath(containerSymbolSelector).within(
    function () {
      cy.contains('OFFER').click().wait(WAIT.STANDARD);
      cy.get('[class*="custodian-select"]').click();
      cy.xpath(custodianSelector).dblclick();

      ratePanelWidget.getAmountInput().first().clear().type(lmOrderData.rate)
      ratePanelWidget.getRateInput().first().clear().type(lmOrderData.amount)

      ratePanelWidget.getSendButton().click({ force: true })
    }
  )
})

/**
 * Make a payment from a trader user
 * @param {Object} paymentData: JSON file with information to complete Payment form
 */
Cypress.Commands.add('makePayment', (paymentData) => {
  paymentsWidget.getPayeeInput().clear().type(`${paymentData.destinationMemberId}{enter}`)
  paymentsWidget.getAmountInput().clear().type(`${paymentData.amount} {enter}`)
  paymentsWidget.getAssetSelect().click().type(`${paymentData.asset} {enter}`)
  paymentsWidget.getCustodianSelect().click().type(`${paymentData.custodian} {enter}`)

  paymentsWidget.getSendButton().click()
  paymentsWidget.getConfirmPaymentButton().click()

  cy.wait(WAIT.STANDARD)

})

Cypress.Commands.add('importAndSelectMetamaskAccount', (user) => {

  cy.importMetamaskAccount(user.PRIVATE_KEY)

  cy.renameMetamaskAccount(user.APP)

  cy.selectMetamaskAccountByName(user.APP)

  walletModalWidget.getConnectWalletButton().contains(walletModalWidget.getConnectWalletButtonText()).click({ force: true })

  cy.wait(WAIT.MEDIUM)

  walletModalWidget.getMetamaskConnectorButton().click({ force: true })

  cy.wait(WAIT.LOW)

  cy.acceptMetamaskAccess({ timeout: 5000 })

})

Cypress.Commands.add('selectMetamaskAccountByName', (accountName) => {

  cy.switchMetamaskAccount(accountName)

})

/**
 * Count divs with value 'value', which are inside another div with id containing 'id'.
 * @param String id - Id to search in the parent div
 * @param String value - Value to be searched in div child
 */
Cypress.Commands.add('getRowsCountByRowIdAndCellValue', (id, value) => {
  mainPage.getRowsByRowIdAndCellValue(id, value).its('length').then((count) => {
    return count
  })
})



Cypress.Commands.add('saveTwoTmsInitialState', (tmsInvolved, bearerCentral, url_central, jsonFile) => {
  const ENTITIES_ENDPOINT = url_central + `rest/entity/`
  let tm1 = tmsInvolved[0]
  let tm2 = tmsInvolved[1]
  let json1, json2

  let params = `${tm1.toUpperCase()}?eventId=` + BosonicUI.COMMON.BOSONIC_EVENT_ID
  let previousState
  cy.getDataFromEndpoint(bearerCentral, ENTITIES_ENDPOINT + params, BosonicUI.REQUEST_GET, null).then(response => {
    json1 = response.body

    params = `${tm2.toUpperCase()}?eventId=` + BosonicUI.COMMON.BOSONIC_EVENT_ID
    cy.getDataFromEndpoint(bearerCentral, ENTITIES_ENDPOINT + params, BosonicUI.REQUEST_GET, null).then(response => {
      json2 = response.body

      previousState = {
        [tm1]: json1,
        [tm2]: json2
      }

      cy.deleteJsonFileContent(jsonFile)

      cy.writeFile(jsonFile, JSON.stringify(previousState, null, 2))
    })
  })
})

Cypress.Commands.add('whitelistTwoTmsAndSaveInitialState', (tmsInvolved, url_central, user_central, jsonFile) => {
  cy.getRequestToken(url_central, user_central).then(token => {
    let bearerCentral = `${token.headers['authorization'].replace('Bearer ', '')}`

    const ENTITIES_ENDPOINT = url_central + `rest/entity/`

    cy.saveTwoTmsInitialState(tmsInvolved, bearerCentral, url_central, jsonFile)

    cy.readFile(jsonFile).then(json => {
      const jsonObject = json

      let tm1 = tmsInvolved[0]
      let tm2 = tmsInvolved[1]
      let json1 = jsonObject[tm1]
      let json2 = jsonObject[tm2]

      // Change the whitelisting of tm1. I keep the custodians, and add the tm2
      let newWhitelist = json1.entityWhitelist.filter(record => record.type === 'CUSTODIAN')
      let tmToWhitelist = {
        "id": null,
        "actionTimestamp": null,
        "actionBy": null,
        "error": null,
        "identifier": tm2,
        "type": "TRADER",
        "eventId": null
      }
      newWhitelist.push(tmToWhitelist)
      json1.entityWhitelist = newWhitelist

      // Change the whitelisting of tm2. I keep the custodians, and add the tm1
      newWhitelist = json2.entityWhitelist.filter(record => record.type === 'CUSTODIAN')
      tmToWhitelist = {
        "id": null,
        "actionTimestamp": null,
        "actionBy": null,
        "error": null,
        "identifier": tm1,
        "type": "TRADER",
        "eventId": null
      }
      newWhitelist.push(tmToWhitelist)
      json2.entityWhitelist = newWhitelist

      // update tm1
      let params = `${tm1}?eventId=` + BosonicUI.COMMON.BOSONIC_EVENT_ID
      cy.getDataFromEndpoint(bearerCentral, ENTITIES_ENDPOINT + params, BosonicUI.REQUEST_PUT, json1).then(response => {
        expect(response.status, `Whitelist ${tm1} with ${tm2}`).to.equal(BosonicUI.REQUEST_RESPONSE.OK)
      })

      // update tm2
      params = `${tm2}?eventId=` + BosonicUI.COMMON.BOSONIC_EVENT_ID
      cy.getDataFromEndpoint(bearerCentral, ENTITIES_ENDPOINT + params, BosonicUI.REQUEST_PUT, json2).then(response => {
        expect(response.status, `Whitelist ${tm2} with ${tm1}`).to.equal(BosonicUI.REQUEST_RESPONSE.OK)
      })
    })
  })
})

Cypress.Commands.add('restoreWhitelistTwoTmsToInitialState', (tmsInvolved, url_central, user_central, jsonFile) => {
  cy.getRequestToken(url_central, user_central).then(token => {
    let bearerCentral = `${token.headers['authorization'].replace('Bearer ', '')}`

    const ENTITIES_ENDPOINT = url_central + `rest/entity/`

    cy.readFile(jsonFile).then(json => {
      const jsonObject = json

      let tm1 = tmsInvolved[0]
      let tm2 = tmsInvolved[1]
      let json1 = jsonObject[tm1]
      let json2 = jsonObject[tm2]

      // update tm1
      let params = `${tm1}?eventId=` + BosonicUI.COMMON.BOSONIC_EVENT_ID
      cy.getDataFromEndpoint(bearerCentral, ENTITIES_ENDPOINT + params, BosonicUI.REQUEST_PUT, json1).then(response => {
        expect(response.status, `Restore initial whitelist for ${tm1}`).to.equal(BosonicUI.REQUEST_RESPONSE.OK)
      })

      // update tm2
      params = `${tm2}?eventId=` + BosonicUI.COMMON.BOSONIC_EVENT_ID
      cy.getDataFromEndpoint(bearerCentral, ENTITIES_ENDPOINT + params, BosonicUI.REQUEST_PUT, json2).then(response => {
        expect(response.status, `Restore initial whitelist for ${tm2}`).to.equal(BosonicUI.REQUEST_RESPONSE.OK)
      })
    })
  })
})


Cypress.Commands.add('getLockedBalanceByAsset', (asset) => {
  return tokenWalletWidget.getSelectTokenCombo().click({ force: true }).wait(WAIT.LONG)
    .then(() => {
      return tokenWalletWidget.getSelectSpecificToken().contains(asset).click({ force: true }).wait(WAIT.LONG)
    })
    .then(() => {
      return tokenWalletWidget.getContractLockedBalance().invoke('text')
    })
    .then((balance) => {
      return parseFloat(balance.trim())
    })
})

Cypress.Commands.add('getBosonicBalances', (userInfo, infoUserUrl, custodian) => {

  let cust = custodian.replace(BosonicUI.COMMON.SPACE_REGEX, BosonicUI.COMMON.UNDERSCORE)

  cy.request('POST', infoUserUrl + 'sso/api/login', {
    "username": userInfo.USER,
    "password": userInfo.PASS,
    "code": userInfo.CODE,
    "redirectTo": infoUserUrl
  }).then($token => {
    let options = {
      method: 'GET',
      url: `${infoUserUrl}rest/custodians/${cust}/ledgers/amount?memberName=${userInfo.USER}&eventId=bosonic-e2e-testing`,
      headers: {
        'Authorization': `Bearer ${$token.headers['authorization'].replace('Bearer ', '')}`
      }
    }
    cy.request(options).then(response => response.body)
  }).then($balances => {
    return $balances
  })
})