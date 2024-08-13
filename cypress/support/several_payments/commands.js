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
 * Date: 07/19/23 6:12
 * Author(s): Diego Graf
 * -----
 * Last Modified: 05/22/2024
 * Modified By: Diego Graf
 * -----
 * 
 */

const BosonicUI = require('../bosonic.constants')
const ENVIRONMENT = require('../../support/bosonic.environments')
const { WAIT } = require('../../support/bosonic.enum.wait')
const { ASSET } = require('../../support/bosonic.enum.asset')
const { STATUS } = require('../../support/bosonic.enum.tx-status')
const BOSONIC_CONSTANTS = require('../../support/bosonic.constants')
const { TASK, INITIAL_BALANCES, MISC, PATH, CUSTODIAN, INDEX } = require('../../support/several_payments/constants')
const USER_PIVOT = ENVIRONMENT.USERS.TM1

let Decimal = require('decimal.js-light');
Decimal.config({ precision: 6 })

/* Widgets */
const PAYMENTS = BosonicUI.TRADER.WIDGETS.PAYMENTS

/* URL's and USERS */
const URL_TM_1 = ENVIRONMENT.BASE_URL_TRAD_1
const URL_TM_3 = ENVIRONMENT.BASE_URL_TRAD_3
const USER_TM_1_A = ENVIRONMENT.USERS.TM1_A_PAYMENT
const USER_TM_1_B = ENVIRONMENT.USERS.TM1_B_PAYMENT
const USER_TM_1_C = ENVIRONMENT.USERS.TM1_C_PAYMENT
const USER_TM_3_A = ENVIRONMENT.USERS.TM3_A_PAYMENT
const USER_TM_3_B = ENVIRONMENT.USERS.TM3_B_PAYMENT
const USER_TM_3_C = ENVIRONMENT.USERS.TM3_C_PAYMENT
const PUBLIC_API = ENVIRONMENT.BASE_URL_BOSONIC_PUBLIC_API

/* Fixtures */
const FIXTURE_PAYMENTS_TM1_A = require('../../fixtures/trader/several_payments/payment_tm1_a.json')
const FIXTURE_PAYMENTS_TM1_B = require('../../fixtures/trader/several_payments/payment_tm1_b.json')
const FIXTURE_PAYMENTS_TM1_C = require('../../fixtures/trader/several_payments/payment_tm1_c.json')
const FIXTURE_PAYMENTS_TM3_A = require('../../fixtures/trader/several_payments/payment_tm3_a.json')
const FIXTURE_PAYMENTS_TM3_B = require('../../fixtures/trader/several_payments/payment_tm3_b.json')
const FIXTURE_PAYMENTS_TM3_C = require('../../fixtures/trader/several_payments/payment_tm3_c.json')

/**
 * Make several Payments (via API or via UI) 
 * @param {Json} fixture 
 * @param {String} type
 */
Cypress.Commands.add('makeSeveralPayments', (fixture_tm, type) => {

  fixture_tm.forEach(fixture => {

    let urlTmMaker
    let urlTmTaker
    let userTmMaker
    let userTmTaker

    switch (fixture.maker) {

      case 'TM1_A':
        urlTmMaker = URL_TM_1
        userTmMaker = USER_TM_1_A
        break

      case 'TM1_B':
        urlTmMaker = URL_TM_1
        userTmMaker = USER_TM_1_B
        break

      case 'TM1_C':
        urlTmMaker = URL_TM_1
        userTmMaker = USER_TM_1_C
        break

      case 'TM3_A':
        urlTmMaker = URL_TM_3
        userTmMaker = USER_TM_3_A
        break

      case 'TM3_B':
        urlTmMaker = URL_TM_3
        userTmMaker = USER_TM_3_B
        break

      case 'TM3_C':
        urlTmMaker = URL_TM_3
        userTmMaker = USER_TM_3_C
        break
    }

    switch (fixture.taker) {

      case 'TM1_A':
        urlTmTaker = URL_TM_1
        userTmTaker = USER_TM_1_A
        break

      case 'TM1_B':
        urlTmTaker = URL_TM_1
        userTmTaker = USER_TM_1_B
        break

      case 'TM1_C':
        urlTmTaker = URL_TM_1
        userTmTaker = USER_TM_1_C
        break

      case 'TM3_A':
        urlTmTaker = URL_TM_3
        userTmTaker = USER_TM_3_A
        break

      case 'TM3_B':
        urlTmTaker = URL_TM_3
        userTmTaker = USER_TM_3_B
        break

      case 'TM3_C':
        urlTmTaker = URL_TM_3
        userTmTaker = USER_TM_3_C
        break
    }

    /* 
    * Maker: Open Payment Widget and Make a Payment
    */

    if (type == "API") {

      if (fixture.needLogin) {
        cy.logMessage('Login with ' + userTmMaker.USER)
        cy.loginAndDescription(urlTmMaker, userTmMaker, 'Login with the Maker, Open Payment Widget and Make a Payment')
        cy.addWidget(PAYMENTS.NAME, 250, 500)
      }

      cy.logMessage('Making a Payment (API) from ' + userTmMaker.USER + ' to ' + userTmTaker.USER + ' for ' + fixture.amount + ' ' + fixture.asset + ' in ' + fixture.custodian)

      let bearer

      /* Making a Payment via API */
      cy.getRequestToken(urlTmMaker, userTmMaker).then($token => {

        /* Get bearer value */
        bearer = $token.headers['authorization'].replace('Bearer ', '')

        /* Make the Payment via API */

        cy.request({
          method: 'POST',
          url: PUBLIC_API + 'rest/payment/send',
          auth: {
            'bearer': bearer
          },
          body: {
            eventId: "bosonic-e2e-testing",
            custodianId: fixture.custodian,
            asset: fixture.asset,
            chainId: fixture.custodian + "-" + fixture.asset,
            destinationMemberId: userTmTaker.USER,
            amount: String(fixture.amount)
          },
        }).as('status').wait(WAIT.LOW_HIGH)

        cy.get('@status').then(($status) => {
          cy.logMessage("Checking if the status is ok")
          expect($status.status).to.equal(BosonicUI.REQUEST_RESPONSE.OK)
        })
      })

      if (fixture.needLogout) {
        cy.logMessage('Logout')
        /* Wait for the last payment */
        cy.wait(WAIT.EXTRA_HIGH)
        cy.validateMovementsInPaymentWidget(fixture_tm)
        cy.logout().wait(WAIT.MEDIUM)
      }
    }
    else if (type == "UI") {

      if (fixture.needLogin) {
        cy.logMessage('Login with ' + userTmMaker.USER)
        cy.loginAndDescription(urlTmMaker, userTmMaker, 'Login with the Maker, Open Payment Widget and Make a Payment')
        cy.addWidget(PAYMENTS.NAME, 250, 500)
      }

      cy.logMessage('Making a Payment (UI) from ' + userTmMaker.USER + ' to ' + userTmTaker.USER + ' for ' + fixture.amount + ' ' + fixture.asset + ' in ' + fixture.custodian)

      cy.get(PAYMENTS.PAYEE_INPUT).type(userTmTaker.USER).wait(WAIT.LOW_HIGH)
      cy.get(PAYMENTS.AMOUNT_INPUT).type(fixture.amount).wait(WAIT.LOW_HIGH)
      cy.get(PAYMENTS.FORM_SELECT).eq(INDEX.ASSET).click().type(`${fixture.asset}{enter}`).wait(WAIT.LOW_HIGH)
      cy.get(PAYMENTS.FORM_SELECT).eq(INDEX.CUSTODIAN).click().type(`${fixture.custodian}{enter}`).wait(WAIT.LOW_HIGH)

      cy.xpath(PAYMENTS.SEND_BTN).click({ force: true })
      cy.xpath(PAYMENTS.MODAL_CONFIRM_BTN).click()

      cy.contains(PAYMENTS.MSG_PAYMENT_CREATED).wait(WAIT.LOW_HIGH)

      if (fixture.needLogout) {
        cy.logMessage('Logout')
        /* Wait for the last payment */
        cy.wait(WAIT.EXTRA_MEDIUM)
        cy.validateMovementsInPaymentWidget(fixture_tm)
        cy.logout().wait(WAIT.MEDIUM)
      }
    }
  })
})

/**
 * Validate the movements in the payment widget via UI using a Fixture to iterate 
 * @param {Json} FIXTURE_TMS
 */
Cypress.Commands.add('validateMovementsInPaymentWidget', (fixture_payment_tm) => {

  fixture_payment_tm.forEach(fixture => {

    let urlTmMaker
    let urlTmTaker
    let userTmMaker
    let userTmTaker

    switch (fixture.maker) {

      case 'TM1_A':
        urlTmMaker = URL_TM_1
        userTmMaker = USER_TM_1_A
        break

      case 'TM1_B':
        urlTmMaker = URL_TM_1
        userTmMaker = USER_TM_1_B
        break

      case 'TM1_C':
        urlTmMaker = URL_TM_1
        userTmMaker = USER_TM_1_C
        break

      case 'TM3_A':
        urlTmMaker = URL_TM_3
        userTmMaker = USER_TM_3_A
        break

      case 'TM3_B':
        urlTmMaker = URL_TM_3
        userTmMaker = USER_TM_3_B
        break

      case 'TM3_C':
        urlTmMaker = URL_TM_3
        userTmMaker = USER_TM_3_C
        break
    }

    switch (fixture.taker) {

      case 'TM1_A':
        urlTmTaker = URL_TM_1
        userTmTaker = USER_TM_3_A
        break

      case 'TM1_B':
        urlTmTaker = URL_TM_1
        userTmTaker = USER_TM_1_B
        break

      case 'TM1_C':
        urlTmTaker = URL_TM_1
        userTmTaker = USER_TM_1_C
        break

      case 'TM3_A':
        urlTmTaker = URL_TM_3
        userTmTaker = USER_TM_3_A
        break

      case 'TM3_B':
        urlTmTaker = URL_TM_3
        userTmTaker = USER_TM_3_B
        break

      case 'TM3_C':
        urlTmTaker = URL_TM_3
        userTmTaker = USER_TM_3_C
        break
    }

    if (fixture.needLogin) {
      /* Maximize Widget */
      cy.xpath(PAYMENTS.BTN_MAXIMIZE_WIDGET).click()
      /* Select 20 movements in the widget footer */
      cy.xpath(PAYMENTS.FOOTER.PAGE_SELECT).click()
      cy.xpath(PAYMENTS.FOOTER.PAGE_SELECT_OPTION_20).click().wait(WAIT.MEDIUM)
    }

    /* Check if the Payment was successful completed */

    /* Status */
    cy.findColumn(PAYMENTS.COLUMNS.STATUS_FIRST_PART + fixture.row + PAYMENTS.COLUMNS.STATUS_SECOND_PART, PAYMENTS.SCROLL_BAR_HORIZONTAL).then(() => {
      cy.xpath(PAYMENTS.COLUMNS.STATUS_FIRST_PART + fixture.row + PAYMENTS.COLUMNS.STATUS_SECOND_PART, PAYMENTS.SCROLL_BAR_HORIZONTAL).then(status => {
        cy.get(status).invoke('text').then(statusMaker => {
          cy.logMessage("Checking if payment's status is 'Completed'")
          expect(statusMaker, "Payment from: " + userTmMaker.USER + " to: " + userTmTaker.USER + " for " + fixture.amount + " " + fixture.asset + " in " + fixture.custodian + ". The payment's status is 'Completed'").to.equal(STATUS.COMPLETED)
        })
      })
    })

    cy.dragAndDrop(PAYMENTS.SCROLL_BAR_HORIZONTAL, 0, 0).wait(WAIT.LOW)

    /* Amount */
    cy.findColumn(PAYMENTS.COLUMNS.AMOUNT_FIRST_PART + fixture.row + PAYMENTS.COLUMNS.AMOUNT_SECOND_PART, PAYMENTS.SCROLL_BAR_HORIZONTAL).then(() => {
      cy.xpath(PAYMENTS.COLUMNS.AMOUNT_FIRST_PART + fixture.row + PAYMENTS.COLUMNS.AMOUNT_SECOND_PART, PAYMENTS.SCROLL_BAR_HORIZONTAL).then(amount => {
        cy.get(amount).invoke('text').then(widgetAmount => {
          cy.logMessage("Checking if payment's amount field in payment widget is equal to " + fixture.amount)
          expect(parseFloat(widgetAmount), "Payment from: " + userTmMaker.USER + " to: " + userTmTaker.USER + " for " + fixture.amount + " " + fixture.asset + " in " + fixture.custodian + ". The payment's amount field in payment widget is equal to amount of the operation").to.equal(parseFloat(fixture.amount))
        })
      })
    })

    cy.dragAndDrop(PAYMENTS.SCROLL_BAR_HORIZONTAL, 0, 0).wait(WAIT.LOW)

    /* Tx Hash */
    cy.findColumn(PAYMENTS.COLUMNS.TRANSACTION_HASH_FIRST_PART + fixture.row + PAYMENTS.COLUMNS.TRANSACTION_HASH_SECOND_PART, PAYMENTS.SCROLL_BAR_HORIZONTAL).then(() => {
      cy.xpath(PAYMENTS.COLUMNS.TRANSACTION_HASH_FIRST_PART + fixture.row + PAYMENTS.COLUMNS.TRANSACTION_HASH_SECOND_PART).then(txHashMaker => {
        cy.get(txHashMaker).invoke('text').then(transactionHashMaker => {
          cy.logMessage("Checking if the TransactionHash was created'")
          expect(transactionHashMaker.length, "Payment from: " + userTmMaker.USER + " to: " + userTmTaker.USER + " for " + fixture.amount + " " + fixture.asset + " in " + fixture.custodian + ". The TransactionHash was created").to.equal(MISC.HASH_LARGE)
        })
      })
    })

    cy.dragAndDrop(PAYMENTS.SCROLL_BAR_HORIZONTAL, 0, 0).wait(WAIT.LOW)

    /* Block Hash */
    cy.findColumn(PAYMENTS.COLUMNS.BLOCKHASH_FIRST_PART + fixture.row + PAYMENTS.COLUMNS.BLOCKHASH_SECOND_PART, PAYMENTS.SCROLL_BAR_HORIZONTAL).then(() => {
      cy.xpath(PAYMENTS.COLUMNS.BLOCKHASH_FIRST_PART + fixture.row + PAYMENTS.COLUMNS.BLOCKHASH_SECOND_PART).then(bkHashMaker => {
        cy.get(bkHashMaker).invoke('text').then(blockHashMaker => {
          cy.logMessage("Checking if the BlockHash was created'")
          expect(blockHashMaker.length, "Payment from: " + userTmMaker.USER + " to: " + userTmTaker.USER + " for " + fixture.amount + " " + fixture.asset + " in " + fixture.custodian + ". The BlockHash was created").to.equal(MISC.HASH_LARGE)
        })
      })
    })
  })
})

/**
 * Validate balances
 * @param {String} bearerTMTask
 * @param {String} url
 * @param {Json} user
 * @param {String} custodian
 */
Cypress.Commands.add('balancesValidation', (bearerTMTask, url, user, custodian) => {
  cy.task(bearerTMTask).then(bearer => {
    cy.getTraderBalanceWithBearerOnlyAPI(url, custodian, user, bearer).then(balance => {
      let btcBalance = balance[ASSET.BTC].total
      let ethBalance = balance[ASSET.ETH].total
      let usdBalance = balance[ASSET.USD].total
      let bchBalance = balance[ASSET.BCH].total
      let ltcBalance = balance[ASSET.LTC].total
      expect(btcBalance, "BTC: The final balance is equal to the initial balance").to.equal(INITIAL_BALANCES.BTC)
      expect(ethBalance, "ETH: The final balance is equal to the initial balance").to.equal(INITIAL_BALANCES.ETH)
      expect(usdBalance, "USD: The final balance is equal to the initial balance").to.equal(INITIAL_BALANCES.USD)
      expect(bchBalance, "BCH: The final balance is equal to the initial balance").to.equal(INITIAL_BALANCES.BCH)
      expect(ltcBalance, "LTC: The final balance is equal to the initial balance").to.equal(INITIAL_BALANCES.LTC)
    })
  })
})

/**
 * Validate quantity of payments
 * @param {String} bearerTMTask
 * @param {String} initialPaymentsQuantityTask
 * @param {String} url 
 * @param {String} tm
 */
Cypress.Commands.add('quantityValidation', (bearerTMTask, initialPaymentsQuantityTask, url, tm, totalPaymentsQuantityMade) => {
  cy.task(bearerTMTask).then(bearer => {
    cy.task(initialPaymentsQuantityTask).then(initialPaymentsQuantity => {
      /* Get from TM1 the quantity of payments */
      cy.getDataFromEndpoint(bearer, url + PATH.PAYMENTS, 'GET').then(paymentMovementsAfter => {
        expect(parseInt(paymentMovementsAfter.body.total), 'The quantity of payments after all payments have been made is equal to the quantity of payments before plus the quantity of payments made in the test (' + tm + ')').to.be.equal(parseInt(initialPaymentsQuantity) + totalPaymentsQuantityMade)
      })
    })
  })
})

/**
 * Run Preconditions
 */
Cypress.Commands.add('runSeveralPaymentsPreConditions', (fixture) => {

  fixture.forEach(fixt => {

    switch (fixt.tm) {

      case 'TM1_A':
        /* Get balances */
        getBalancesAndSaveInTask(URL_TM_1, USER_TM_1_A, TASK.SET_TM1A_BALANCE, CUSTODIAN.CUST1)
        cy.wait(WAIT.LONG)
        /* Get and save bearer */
        cy.getRequestToken(URL_TM_1, USER_TM_1_A).then(token => {
          const bearer = token.headers['authorization'].replace('Bearer ', '')
          cy.task(TASK.SET_TM1A_BEARER, bearer)
        })
        break

      case 'TM1_B':
        /* Get balances */
        getBalancesAndSaveInTask(URL_TM_1, USER_TM_1_B, TASK.SET_TM1B_BALANCE, CUSTODIAN.CUST1)
        cy.wait(WAIT.LONG)
        /* Get and save bearer */
        cy.getRequestToken(URL_TM_1, USER_TM_1_B).then(token => {
          const bearer = token.headers['authorization'].replace('Bearer ', '')
          cy.task(TASK.SET_TM1B_BEARER, bearer)
        })
        break

      case 'TM1_C':
        /* Get balances */
        getBalancesAndSaveInTask(URL_TM_1, USER_TM_1_C, TASK.SET_TM1C_BALANCE, CUSTODIAN.CUST1)
        cy.wait(WAIT.LONG)
        /* Get and save bearer */
        cy.getRequestToken(URL_TM_1, USER_TM_1_C).then(token => {
          const bearer = token.headers['authorization'].replace('Bearer ', '')
          cy.task(TASK.SET_TM1C_BEARER, bearer)
        })
        break

      case 'TM3_A':
        /* Get balances */
        getBalancesAndSaveInTask(URL_TM_3, USER_TM_3_A, TASK.SET_TM3A_BALANCE, CUSTODIAN.CUST1)
        cy.wait(WAIT.LONG)
        /* Get and save bearer */
        cy.getRequestToken(URL_TM_3, USER_TM_3_A).then(token => {
          const bearer = token.headers['authorization'].replace('Bearer ', '')
          cy.task(TASK.SET_TM3A_BEARER, bearer)
        })
        break

      case 'TM3_B':
        /* Get balances */
        getBalancesAndSaveInTask(URL_TM_3, USER_TM_3_B, TASK.SET_TM3B_BALANCE, CUSTODIAN.CUST1)
        cy.wait(WAIT.LONG)
        /* Get and save bearer */
        cy.getRequestToken(URL_TM_3, USER_TM_3_B).then(token => {
          const bearer = token.headers['authorization'].replace('Bearer ', '')
          cy.task(TASK.SET_TM3B_BEARER, bearer)
        })
        break

      case 'TM3_C':
        /* Get balances */
        getBalancesAndSaveInTask(URL_TM_3, USER_TM_3_C, TASK.SET_TM3C_BALANCE, CUSTODIAN.CUST1)
        cy.wait(WAIT.LONG)
        /* Get and save bearer */
        cy.getRequestToken(URL_TM_3, USER_TM_3_C).then(token => {
          const bearer = token.headers['authorization'].replace('Bearer ', '')
          cy.task(TASK.SET_TM3C_BEARER, bearer)
        })
        break
    }
  })

  /* Get pivot user bearer and save in a task */
  cy.getRequestToken(URL_TM_1, USER_PIVOT).then(token => {
    const bearer = token.headers['authorization'].replace('Bearer ', '')
    cy.task(TASK.SET_PIVOT_BEARER, bearer)
  })

  /* Send all TM1_A user balance to pivot user */
  cy.task(TASK.GET_TM1A_BALANCE).then(tm1ABalance => {

    let decimaltotalBalanceTm1ABeforeBTC = new Decimal(tm1ABalance[0]).toNumber()
    let decimaltotalBalanceTm1ABeforeETH = new Decimal(tm1ABalance[1]).toNumber()
    let decimaltotalBalanceTm1ABeforeUSD = new Decimal(tm1ABalance[2]).toNumber()
    let decimaltotalBalanceTm1ABeforeBCH = new Decimal(tm1ABalance[3]).toNumber()
    let decimaltotalBalanceTm1ABeforeLTC = new Decimal(tm1ABalance[4]).toNumber()

    let paymentsMap = new Map()
    paymentsMap.set(ASSET.BTC, decimaltotalBalanceTm1ABeforeBTC)
    paymentsMap.set(ASSET.ETH, decimaltotalBalanceTm1ABeforeETH)
    paymentsMap.set(ASSET.USD, decimaltotalBalanceTm1ABeforeUSD)
    paymentsMap.set(ASSET.BCH, decimaltotalBalanceTm1ABeforeBCH)
    paymentsMap.set(ASSET.LTC, decimaltotalBalanceTm1ABeforeLTC)

    cy.task(TASK.GET_TM1A_BEARER).then(bearer => {
      rebalanceWithPayments(bearer, CUSTODIAN.CUST1, paymentsMap, USER_PIVOT.USER)
    })
  })

  /* Send all TM1_B user balance to pivot user */
  cy.task(TASK.GET_TM1B_BALANCE).then(tm1BBalance => {

    let decimaltotalBalanceTm1BBeforeBTC = new Decimal(tm1BBalance[0]).toNumber()
    let decimaltotalBalanceTm1BBeforeETH = new Decimal(tm1BBalance[1]).toNumber()
    let decimaltotalBalanceTm1BBeforeUSD = new Decimal(tm1BBalance[2]).toNumber()
    let decimaltotalBalanceTm1BBeforeBCH = new Decimal(tm1BBalance[3]).toNumber()
    let decimaltotalBalanceTm1BBeforeLTC = new Decimal(tm1BBalance[4]).toNumber()

    let paymentsMap = new Map()
    if (decimaltotalBalanceTm1BBeforeBTC != 0) paymentsMap.set(ASSET.BTC, decimaltotalBalanceTm1BBeforeBTC)
    if (decimaltotalBalanceTm1BBeforeETH != 0) paymentsMap.set(ASSET.ETH, decimaltotalBalanceTm1BBeforeETH)
    if (decimaltotalBalanceTm1BBeforeUSD != 0) paymentsMap.set(ASSET.USD, decimaltotalBalanceTm1BBeforeUSD)
    if (decimaltotalBalanceTm1BBeforeBCH != 0) paymentsMap.set(ASSET.BCH, decimaltotalBalanceTm1BBeforeBCH)
    if (decimaltotalBalanceTm1BBeforeLTC != 0) paymentsMap.set(ASSET.LTC, decimaltotalBalanceTm1BBeforeLTC)

    cy.task(TASK.GET_TM1B_BEARER).then(bearer => {
      rebalanceWithPayments(bearer, CUSTODIAN.CUST1, paymentsMap, USER_PIVOT.USER)
    })
  })

  /* Send all TM1_C user balance to pivot user */
  cy.task(TASK.GET_TM1C_BALANCE).then(tm1CBalance => {

    let decimaltotalBalanceTm1CBeforeBTC = new Decimal(tm1CBalance[0]).toNumber()
    let decimaltotalBalanceTm1CBeforeETH = new Decimal(tm1CBalance[1]).toNumber()
    let decimaltotalBalanceTm1CBeforeUSD = new Decimal(tm1CBalance[2]).toNumber()
    let decimaltotalBalanceTm1CBeforeBCH = new Decimal(tm1CBalance[3]).toNumber()
    let decimaltotalBalanceTm1CBeforeLTC = new Decimal(tm1CBalance[4]).toNumber()

    let paymentsMap = new Map()
    if (decimaltotalBalanceTm1CBeforeBTC != 0) paymentsMap.set(ASSET.BTC, decimaltotalBalanceTm1CBeforeBTC)
    if (decimaltotalBalanceTm1CBeforeETH != 0) paymentsMap.set(ASSET.ETH, decimaltotalBalanceTm1CBeforeETH)
    if (decimaltotalBalanceTm1CBeforeUSD != 0) paymentsMap.set(ASSET.USD, decimaltotalBalanceTm1CBeforeUSD)
    if (decimaltotalBalanceTm1CBeforeBCH != 0) paymentsMap.set(ASSET.BCH, decimaltotalBalanceTm1CBeforeBCH)
    if (decimaltotalBalanceTm1CBeforeLTC != 0) paymentsMap.set(ASSET.LTC, decimaltotalBalanceTm1CBeforeLTC)

    cy.task(TASK.GET_TM1C_BEARER).then(bearer => {
      rebalanceWithPayments(bearer, CUSTODIAN.CUST1, paymentsMap, USER_PIVOT.USER)
    })
  })

  /* Send all TM3_A user balance to pivot user */
  cy.task(TASK.GET_TM3A_BALANCE).then(tm3ABalance => {

    let decimaltotalBalanceTm3ABeforeBTC = new Decimal(tm3ABalance[0]).toNumber()
    let decimaltotalBalanceTm3ABeforeETH = new Decimal(tm3ABalance[1]).toNumber()
    let decimaltotalBalanceTm3ABeforeUSD = new Decimal(tm3ABalance[2]).toNumber()
    let decimaltotalBalanceTm3ABeforeBCH = new Decimal(tm3ABalance[3]).toNumber()
    let decimaltotalBalanceTm3ABeforeLTC = new Decimal(tm3ABalance[4]).toNumber()

    let paymentsMap = new Map()
    if (decimaltotalBalanceTm3ABeforeBTC != 0) paymentsMap.set(ASSET.BTC, decimaltotalBalanceTm3ABeforeBTC)
    if (decimaltotalBalanceTm3ABeforeETH != 0) paymentsMap.set(ASSET.ETH, decimaltotalBalanceTm3ABeforeETH)
    if (decimaltotalBalanceTm3ABeforeUSD != 0) paymentsMap.set(ASSET.USD, decimaltotalBalanceTm3ABeforeUSD)
    if (decimaltotalBalanceTm3ABeforeBCH != 0) paymentsMap.set(ASSET.BCH, decimaltotalBalanceTm3ABeforeBCH)
    if (decimaltotalBalanceTm3ABeforeLTC != 0) paymentsMap.set(ASSET.LTC, decimaltotalBalanceTm3ABeforeLTC)

    cy.task(TASK.GET_TM3A_BEARER).then(bearer => {
      rebalanceWithPayments(bearer, CUSTODIAN.CUST1, paymentsMap, USER_PIVOT.USER)
    })
  })

  /* Send all TM3_B user balance to pivot user */
  cy.task(TASK.GET_TM3B_BALANCE).then(tm3BBalance => {

    let decimaltotalBalanceTm3BBeforeBTC = new Decimal(tm3BBalance[0]).toNumber()
    let decimaltotalBalanceTm3BBeforeETH = new Decimal(tm3BBalance[1]).toNumber()
    let decimaltotalBalanceTm3BBeforeUSD = new Decimal(tm3BBalance[2]).toNumber()
    let decimaltotalBalanceTm3BBeforeBCH = new Decimal(tm3BBalance[3]).toNumber()
    let decimaltotalBalanceTm3BBeforeLTC = new Decimal(tm3BBalance[4]).toNumber()

    let paymentsMap = new Map()
    if (decimaltotalBalanceTm3BBeforeBTC != 0) paymentsMap.set(ASSET.BTC, decimaltotalBalanceTm3BBeforeBTC)
    if (decimaltotalBalanceTm3BBeforeETH != 0) paymentsMap.set(ASSET.ETH, decimaltotalBalanceTm3BBeforeETH)
    if (decimaltotalBalanceTm3BBeforeUSD != 0) paymentsMap.set(ASSET.USD, decimaltotalBalanceTm3BBeforeUSD)
    if (decimaltotalBalanceTm3BBeforeBCH != 0) paymentsMap.set(ASSET.BCH, decimaltotalBalanceTm3BBeforeBCH)
    if (decimaltotalBalanceTm3BBeforeLTC != 0) paymentsMap.set(ASSET.LTC, decimaltotalBalanceTm3BBeforeLTC)

    cy.task(TASK.GET_TM3B_BEARER).then(bearer => {
      rebalanceWithPayments(bearer, CUSTODIAN.CUST1, paymentsMap, USER_PIVOT.USER)
    })
  })

  /* Send all TM3_C user balance to pivot user */
  cy.task(TASK.GET_TM3C_BALANCE).then(tm3CBalance => {

    let decimaltotalBalanceTm3CBeforeBTC = new Decimal(tm3CBalance[0]).toNumber()
    let decimaltotalBalanceTm3CBeforeETH = new Decimal(tm3CBalance[1]).toNumber()
    let decimaltotalBalanceTm3CBeforeUSD = new Decimal(tm3CBalance[2]).toNumber()
    let decimaltotalBalanceTm3CBeforeBCH = new Decimal(tm3CBalance[3]).toNumber()
    let decimaltotalBalanceTm3CBeforeLTC = new Decimal(tm3CBalance[4]).toNumber()

    let paymentsMap = new Map()
    if (decimaltotalBalanceTm3CBeforeBTC != 0) paymentsMap.set(ASSET.BTC, decimaltotalBalanceTm3CBeforeBTC)
    if (decimaltotalBalanceTm3CBeforeETH != 0) paymentsMap.set(ASSET.ETH, decimaltotalBalanceTm3CBeforeETH)
    if (decimaltotalBalanceTm3CBeforeUSD != 0) paymentsMap.set(ASSET.USD, decimaltotalBalanceTm3CBeforeUSD)
    if (decimaltotalBalanceTm3CBeforeBCH != 0) paymentsMap.set(ASSET.BCH, decimaltotalBalanceTm3CBeforeBCH)
    if (decimaltotalBalanceTm3CBeforeLTC != 0) paymentsMap.set(ASSET.LTC, decimaltotalBalanceTm3CBeforeLTC)

    cy.task(TASK.GET_TM3C_BEARER).then(bearer => {
      rebalanceWithPayments(bearer, CUSTODIAN.CUST1, paymentsMap, USER_PIVOT.USER)
    })
  })

  /* Send the needed balance from pivot user to each user in the test */
  cy.task(TASK.GET_PIVOT_BEARER).then(bearer => {
    let paymentsMap = new Map()
    paymentsMap.set(ASSET.BTC, INITIAL_BALANCES.BTC)
    paymentsMap.set(ASSET.ETH, INITIAL_BALANCES.ETH)
    paymentsMap.set(ASSET.USD, INITIAL_BALANCES.USD)
    paymentsMap.set(ASSET.BCH, INITIAL_BALANCES.BCH)
    paymentsMap.set(ASSET.LTC, INITIAL_BALANCES.LTC)
    cy.rebalanceWithPayments(bearer, CUSTODIAN.CUST1, paymentsMap, USER_TM_1_A.USER).wait(WAIT.LONG)
    cy.rebalanceWithPayments(bearer, CUSTODIAN.CUST1, paymentsMap, USER_TM_1_B.USER).wait(WAIT.LONG)
    cy.rebalanceWithPayments(bearer, CUSTODIAN.CUST1, paymentsMap, USER_TM_1_C.USER).wait(WAIT.LONG)
    cy.rebalanceWithPayments(bearer, CUSTODIAN.CUST1, paymentsMap, USER_TM_3_A.USER).wait(WAIT.LONG)
    cy.rebalanceWithPayments(bearer, CUSTODIAN.CUST1, paymentsMap, USER_TM_3_B.USER).wait(WAIT.LONG)
    cy.rebalanceWithPayments(bearer, CUSTODIAN.CUST1, paymentsMap, USER_TM_3_C.USER).wait(WAIT.LONG)
  }).wait(WAIT.HIGH)

  /* Get the quantity of payment of each TM before start test*/
  fixture.forEach(fixt => {

    switch (fixt.tm) {

      case 'TM1_A':
        /* Get TM1A Bearer */
        cy.task(TASK.GET_TM1A_BEARER).then(bearer => {
          /* Get from TM1A the quantity of payments */
          cy.getDataFromEndpoint(bearer, URL_TM_1 + PATH.PAYMENTS, 'GET').then(paymentMovementsBefore => {
            cy.task(TASK.SET_INITIAL_PAYMENTS_QUANTITY_TM1A, paymentMovementsBefore.body.total)
            cy.logMessage('Initial Payments Quantity TM1_A user: ' + paymentMovementsBefore.body.total)
          })
        })
        break

      case 'TM1_B':
        /* Get TM1B Bearer */
        cy.task(TASK.GET_TM1B_BEARER).then(bearer => {
          /* Get from TM1B the quantity of payments */
          cy.getDataFromEndpoint(bearer, URL_TM_1 + PATH.PAYMENTS, 'GET').then(paymentMovementsBefore => {
            cy.task(TASK.SET_INITIAL_PAYMENTS_QUANTITY_TM1B, paymentMovementsBefore.body.total)
            cy.logMessage('Initial Payments Quantity TM1_B user: ' + paymentMovementsBefore.body.total)
          })
        })
        break

      case 'TM1_C':
        /* Get TM1C Bearer */
        cy.task(TASK.GET_TM1C_BEARER).then(bearer => {
          /* Get from TM1C the quantity of payments */
          cy.getDataFromEndpoint(bearer, URL_TM_1 + PATH.PAYMENTS, 'GET').then(paymentMovementsBefore => {
            cy.task(TASK.SET_INITIAL_PAYMENTS_QUANTITY_TM1C, paymentMovementsBefore.body.total)
            cy.logMessage('Initial Payments Quantity TM1_C user: ' + paymentMovementsBefore.body.total)
          })
        })
        break

      case 'TM3_A':
        /* Get TM3A Bearer */
        cy.task(TASK.GET_TM3A_BEARER).then(bearer => {
          /* Get from TM3A the quantity of payments */
          cy.getDataFromEndpoint(bearer, URL_TM_3 + PATH.PAYMENTS, 'GET').then(paymentMovementsBefore => {
            cy.task(TASK.SET_INITIAL_PAYMENTS_QUANTITY_TM3A, paymentMovementsBefore.body.total)
            cy.logMessage('Initial Payments Quantity TM3_A user: ' + paymentMovementsBefore.body.total)
          })
        })
        break

      case 'TM3_B':
        /* Get TM3B Bearer */
        cy.task(TASK.GET_TM3B_BEARER).then(bearer => {
          /* Get from TM3B the quantity of payments */
          cy.getDataFromEndpoint(bearer, URL_TM_3 + PATH.PAYMENTS, 'GET').then(paymentMovementsBefore => {
            cy.task(TASK.SET_INITIAL_PAYMENTS_QUANTITY_TM3B, paymentMovementsBefore.body.total)
            cy.logMessage('Initial Payments Quantity TM3_B user: ' + paymentMovementsBefore.body.total)
          })
        })
        break

      case 'TM3_C':
        /* Get TM3C Bearer */
        cy.task(TASK.GET_TM3C_BEARER).then(bearer => {
          /* Get from TM3C the quantity of payments */
          cy.getDataFromEndpoint(bearer, URL_TM_3 + PATH.PAYMENTS, 'GET').then(paymentMovementsBefore => {
            cy.task(TASK.SET_INITIAL_PAYMENTS_QUANTITY_TM3C, paymentMovementsBefore.body.total)
            cy.logMessage('Initial Payments Quantity TM3_C user: ' + paymentMovementsBefore.body.total)
          })
        })
        break
    }
  })
})

/**
 * Switch Fixture
 */
Cypress.Commands.add('switchFixture', (fixture) => {

  switch (fixture.tm) {

    case 'TM1_A':
      cy.task(TASK.SET_FIXTURE, FIXTURE_PAYMENTS_TM1_A)
      break

    case 'TM1_B':
      cy.task(TASK.SET_FIXTURE, FIXTURE_PAYMENTS_TM1_B)
      break

    case 'TM1_C':
      cy.task(TASK.SET_FIXTURE, FIXTURE_PAYMENTS_TM1_C)
      break

    case 'TM3_A':
      cy.task(TASK.SET_FIXTURE, FIXTURE_PAYMENTS_TM3_A)
      break

    case 'TM3_B':
      cy.task(TASK.SET_FIXTURE, FIXTURE_PAYMENTS_TM3_B)
      break

    case 'TM3_C':
      cy.task(TASK.SET_FIXTURE, FIXTURE_PAYMENTS_TM3_C)
      break
  }
})

/**
 * Switch User
 */
Cypress.Commands.add('switchUser', (fixture) => {

  switch (fixture.tm) {

    case 'TM1_A':
      cy.task(TASK.SET_URL, URL_TM_1)
      cy.task(TASK.SET_USER, USER_TM_1_A)
      cy.task(TASK.SET_BEARER_TM_TASK, TASK.GET_TM1A_BEARER)
      cy.task(TASK.SET_INITIAL_PAYMENTS_QUANTITY_TASK, TASK.GET_INITIAL_PAYMENTS_QUANTITY_TM1A)
      cy.task(TASK.SET_TOTAL_PAYMENTS_QUANTITY_MADE, 30)
      break

    case 'TM1_B':
      cy.task(TASK.SET_URL, URL_TM_1)
      cy.task(TASK.SET_USER, USER_TM_1_B)
      cy.task(TASK.SET_BEARER_TM_TASK, TASK.GET_TM1B_BEARER)
      cy.task(TASK.SET_INITIAL_PAYMENTS_QUANTITY_TASK, TASK.GET_INITIAL_PAYMENTS_QUANTITY_TM1B)
      cy.task(TASK.SET_TOTAL_PAYMENTS_QUANTITY_MADE, 15)
      break

    case 'TM1_C':
      cy.task(TASK.SET_URL, URL_TM_1)
      cy.task(TASK.SET_USER, USER_TM_1_C)
      cy.task(TASK.SET_BEARER_TM_TASK, TASK.GET_TM1C_BEARER)
      cy.task(TASK.SET_INITIAL_PAYMENTS_QUANTITY_TASK, TASK.GET_INITIAL_PAYMENTS_QUANTITY_TM1C)
      cy.task(TASK.SET_TOTAL_PAYMENTS_QUANTITY_MADE, 10)
      break

    case 'TM3_A':
      cy.task(TASK.SET_URL, URL_TM_3)
      cy.task(TASK.SET_USER, USER_TM_3_A)
      cy.task(TASK.SET_BEARER_TM_TASK, TASK.GET_TM3A_BEARER)
      cy.task(TASK.SET_INITIAL_PAYMENTS_QUANTITY_TASK, TASK.GET_INITIAL_PAYMENTS_QUANTITY_TM3A)
      cy.task(TASK.SET_TOTAL_PAYMENTS_QUANTITY_MADE, 10)
      break

    case 'TM3_B':
      cy.task(TASK.SET_URL, URL_TM_3)
      cy.task(TASK.SET_USER, USER_TM_3_B)
      cy.task(TASK.SET_BEARER_TM_TASK, TASK.GET_TM3B_BEARER)
      cy.task(TASK.SET_INITIAL_PAYMENTS_QUANTITY_TASK, TASK.GET_INITIAL_PAYMENTS_QUANTITY_TM3B)
      cy.task(TASK.SET_TOTAL_PAYMENTS_QUANTITY_MADE, 20)
      break

    case 'TM3_C':
      cy.task(TASK.SET_URL, URL_TM_3)
      cy.task(TASK.SET_USER, USER_TM_3_C)
      cy.task(TASK.SET_BEARER_TM_TASK, TASK.GET_TM3C_BEARER)
      cy.task(TASK.SET_INITIAL_PAYMENTS_QUANTITY_TASK, TASK.GET_INITIAL_PAYMENTS_QUANTITY_TM3C)
      cy.task(TASK.SET_TOTAL_PAYMENTS_QUANTITY_MADE, 35)
      break
  }
})

/**
 * Function to get balances from an user and save in tasks before and after operation.
 * @param {String} url: Url to access into trader module.
 * @param {String} user: User from whom we want to obtain balances.
 * @param {String} task: Cypress task where we "save" the balances.
 * @param {Object} fixture: Object with information about the payment that we make.
 */
function getBalancesAndSaveInTask(url, user, task, custodian) {
  cy.getRequestToken(url, user).then(token => {
    cy.getTraderBalanceWithTokenOnlyAPI(url, custodian, user.USER, token).then(balances => {
      const TOTAL_BALANCE = [balances[ASSET.BTC].total, balances[ASSET.ETH].total, balances[ASSET.USD].total, balances[ASSET.BCH].total, balances[ASSET.LTC].total]
      cy.task(task, TOTAL_BALANCE)
    })
  })
}

/**
 * Make payments whit a pivot user to rebalance before start test
 * @param {String} bearer: User bearer
 * @param {String} custodian: Custodian
 * @param {Map} paymentsMap: Map with each payment
 * @param {String} user: Payment destination user
 */
function rebalanceWithPayments(bearer, custodian, paymentsMap, user) {
  for (let [key, value] of paymentsMap) {
    cy.request({
      method: 'POST',
      url: PUBLIC_API + 'rest/payment/send',
      auth: {
        'bearer': bearer
      },
      body: {
        eventId: BOSONIC_CONSTANTS.COMMON.BOSONIC_EVENT_ID,
        custodianId: custodian,
        asset: key,
        chainId: custodian + "-" + key,
        destinationMemberId: user,
        amount: String(value)
      },
    }).then(($status) => {
      cy.logMessage("Checking if the status is ok")
      expect($status.status).to.equal(BOSONIC_CONSTANTS.REQUEST_RESPONSE.OK)
    }).wait(WAIT.LONG)
  }

  /**
   * Validate initial balance of all users involved in tests   
   */
  Cypress.Commands.add('validateSeveralPaymentsInitialBalance', () => {
    cy.wait(WAIT.EXTRA)
    cy.task(TASK.GET_TM1A_BEARER).then(bearer => {
      cy.getTraderBalanceWithBearerOnlyAPI(URL_TM_1, CUSTODIAN.CUST1, USER_TM_1_A, bearer).then(balances => {
        const TOTAL_BALANCE = [balances[ASSET.BTC].total, balances[ASSET.ETH].total, balances[ASSET.USD].total, balances[ASSET.BCH].total, balances[ASSET.LTC].total]        
        let decimaltotalBalanceAsset1 = new Decimal(TOTAL_BALANCE[0]).toNumber()
        let decimaltotalBalanceAsset2 = new Decimal(TOTAL_BALANCE[1]).toNumber()
        let decimaltotalBalanceAsset3 = new Decimal(TOTAL_BALANCE[2]).toNumber()
        let decimaltotalBalanceAsset4 = new Decimal(TOTAL_BALANCE[3]).toNumber()
        let decimaltotalBalanceAsset5 = new Decimal(TOTAL_BALANCE[4]).toNumber()
        cy.wait(WAIT.LOW_HIGH)
        expect(decimaltotalBalanceAsset1, `Validate initial balance for ${ASSET.BTC}`).to.equal(INITIAL_BALANCES.BTC)
        expect(decimaltotalBalanceAsset2, `Validate initial balance for ${ASSET.ETH}`).to.equal(INITIAL_BALANCES.ETH)
        expect(decimaltotalBalanceAsset3, `Validate initial balance for ${ASSET.USD}`).to.equal(INITIAL_BALANCES.USD)
        expect(decimaltotalBalanceAsset4, `Validate initial balance for ${ASSET.BCH}`).to.equal(INITIAL_BALANCES.BCH)
        expect(decimaltotalBalanceAsset5, `Validate initial balance for ${ASSET.LTC}`).to.equal(INITIAL_BALANCES.LTC)
      })
    })
    cy.task(TASK.GET_TM1B_BEARER).then(bearer => {
      cy.getTraderBalanceWithBearerOnlyAPI(URL_TM_1, CUSTODIAN.CUST1, USER_TM_1_B, bearer).then(balances => {
        const TOTAL_BALANCE = [balances[ASSET.BTC].total, balances[ASSET.ETH].total, balances[ASSET.USD].total, balances[ASSET.BCH].total, balances[ASSET.LTC].total]
        let decimaltotalBalanceAsset1 = new Decimal(TOTAL_BALANCE[0]).toNumber()
        let decimaltotalBalanceAsset2 = new Decimal(TOTAL_BALANCE[1]).toNumber()
        let decimaltotalBalanceAsset3 = new Decimal(TOTAL_BALANCE[2]).toNumber()
        let decimaltotalBalanceAsset4 = new Decimal(TOTAL_BALANCE[3]).toNumber()
        let decimaltotalBalanceAsset5 = new Decimal(TOTAL_BALANCE[4]).toNumber()
        cy.wait(WAIT.LOW_HIGH)
        expect(decimaltotalBalanceAsset1, `Validate initial balance for ${ASSET.BTC}`).to.equal(INITIAL_BALANCES.BTC)
        expect(decimaltotalBalanceAsset2, `Validate initial balance for ${ASSET.ETH}`).to.equal(INITIAL_BALANCES.ETH)
        expect(decimaltotalBalanceAsset3, `Validate initial balance for ${ASSET.USD}`).to.equal(INITIAL_BALANCES.USD)
        expect(decimaltotalBalanceAsset4, `Validate initial balance for ${ASSET.BCH}`).to.equal(INITIAL_BALANCES.BCH)
        expect(decimaltotalBalanceAsset5, `Validate initial balance for ${ASSET.LTC}`).to.equal(INITIAL_BALANCES.LTC)
      })
    })
    cy.task(TASK.GET_TM1C_BEARER).then(bearer => {
      cy.getTraderBalanceWithBearerOnlyAPI(URL_TM_1, CUSTODIAN.CUST1, USER_TM_1_C, bearer).then(balances => {
        const TOTAL_BALANCE = [balances[ASSET.BTC].total, balances[ASSET.ETH].total, balances[ASSET.USD].total, balances[ASSET.BCH].total, balances[ASSET.LTC].total]
        let decimaltotalBalanceAsset1 = new Decimal(TOTAL_BALANCE[0]).toNumber()
        let decimaltotalBalanceAsset2 = new Decimal(TOTAL_BALANCE[1]).toNumber()
        let decimaltotalBalanceAsset3 = new Decimal(TOTAL_BALANCE[2]).toNumber()
        let decimaltotalBalanceAsset4 = new Decimal(TOTAL_BALANCE[3]).toNumber()
        let decimaltotalBalanceAsset5 = new Decimal(TOTAL_BALANCE[4]).toNumber()
        cy.wait(WAIT.LOW_HIGH)
        expect(decimaltotalBalanceAsset1, `Validate initial balance for ${ASSET.BTC}`).to.equal(INITIAL_BALANCES.BTC)
        expect(decimaltotalBalanceAsset2, `Validate initial balance for ${ASSET.ETH}`).to.equal(INITIAL_BALANCES.ETH)
        expect(decimaltotalBalanceAsset3, `Validate initial balance for ${ASSET.USD}`).to.equal(INITIAL_BALANCES.USD)
        expect(decimaltotalBalanceAsset4, `Validate initial balance for ${ASSET.BCH}`).to.equal(INITIAL_BALANCES.BCH)
        expect(decimaltotalBalanceAsset5, `Validate initial balance for ${ASSET.LTC}`).to.equal(INITIAL_BALANCES.LTC)
      })
    })
    cy.task(TASK.GET_TM3A_BEARER).then(bearer => {
      cy.getTraderBalanceWithBearerOnlyAPI(URL_TM_3, CUSTODIAN.CUST1, USER_TM_3_A, bearer).then(balances => {
        const TOTAL_BALANCE = [balances[ASSET.BTC].total, balances[ASSET.ETH].total, balances[ASSET.USD].total, balances[ASSET.BCH].total, balances[ASSET.LTC].total]
        let decimaltotalBalanceAsset1 = new Decimal(TOTAL_BALANCE[0]).toNumber()
        let decimaltotalBalanceAsset2 = new Decimal(TOTAL_BALANCE[1]).toNumber()
        let decimaltotalBalanceAsset3 = new Decimal(TOTAL_BALANCE[2]).toNumber()
        let decimaltotalBalanceAsset4 = new Decimal(TOTAL_BALANCE[3]).toNumber()
        let decimaltotalBalanceAsset5 = new Decimal(TOTAL_BALANCE[4]).toNumber()
        cy.wait(WAIT.LOW_HIGH)
        expect(decimaltotalBalanceAsset1, `Validate initial balance for ${ASSET.BTC}`).to.equal(INITIAL_BALANCES.BTC)
        expect(decimaltotalBalanceAsset2, `Validate initial balance for ${ASSET.ETH}`).to.equal(INITIAL_BALANCES.ETH)
        expect(decimaltotalBalanceAsset3, `Validate initial balance for ${ASSET.USD}`).to.equal(INITIAL_BALANCES.USD)
        expect(decimaltotalBalanceAsset4, `Validate initial balance for ${ASSET.BCH}`).to.equal(INITIAL_BALANCES.BCH)
        expect(decimaltotalBalanceAsset5, `Validate initial balance for ${ASSET.LTC}`).to.equal(INITIAL_BALANCES.LTC)
      })
    })
    cy.task(TASK.GET_TM3B_BEARER).then(bearer => {
      cy.getTraderBalanceWithBearerOnlyAPI(URL_TM_3, CUSTODIAN.CUST1, USER_TM_3_B, bearer).then(balances => {
        const TOTAL_BALANCE = [balances[ASSET.BTC].total, balances[ASSET.ETH].total, balances[ASSET.USD].total, balances[ASSET.BCH].total, balances[ASSET.LTC].total]
        let decimaltotalBalanceAsset1 = new Decimal(TOTAL_BALANCE[0]).toNumber()
        let decimaltotalBalanceAsset2 = new Decimal(TOTAL_BALANCE[1]).toNumber()
        let decimaltotalBalanceAsset3 = new Decimal(TOTAL_BALANCE[2]).toNumber()
        let decimaltotalBalanceAsset4 = new Decimal(TOTAL_BALANCE[3]).toNumber()
        let decimaltotalBalanceAsset5 = new Decimal(TOTAL_BALANCE[4]).toNumber()
        cy.wait(WAIT.LOW_HIGH)
        expect(decimaltotalBalanceAsset1, `Validate initial balance for ${ASSET.BTC}`).to.equal(INITIAL_BALANCES.BTC)
        expect(decimaltotalBalanceAsset2, `Validate initial balance for ${ASSET.ETH}`).to.equal(INITIAL_BALANCES.ETH)
        expect(decimaltotalBalanceAsset3, `Validate initial balance for ${ASSET.USD}`).to.equal(INITIAL_BALANCES.USD)
        expect(decimaltotalBalanceAsset4, `Validate initial balance for ${ASSET.BCH}`).to.equal(INITIAL_BALANCES.BCH)
        expect(decimaltotalBalanceAsset5, `Validate initial balance for ${ASSET.LTC}`).to.equal(INITIAL_BALANCES.LTC)
      })
    })
    cy.task(TASK.GET_TM3C_BEARER).then(bearer => {
      cy.getTraderBalanceWithBearerOnlyAPI(URL_TM_3, CUSTODIAN.CUST1, USER_TM_3_C, bearer).then(balances => {
        const TOTAL_BALANCE = [balances[ASSET.BTC].total, balances[ASSET.ETH].total, balances[ASSET.USD].total, balances[ASSET.BCH].total, balances[ASSET.LTC].total]
        let decimaltotalBalanceAsset1 = new Decimal(TOTAL_BALANCE[0]).toNumber()
        let decimaltotalBalanceAsset2 = new Decimal(TOTAL_BALANCE[1]).toNumber()
        let decimaltotalBalanceAsset3 = new Decimal(TOTAL_BALANCE[2]).toNumber()
        let decimaltotalBalanceAsset4 = new Decimal(TOTAL_BALANCE[3]).toNumber()
        let decimaltotalBalanceAsset5 = new Decimal(TOTAL_BALANCE[4]).toNumber()
        cy.wait(WAIT.LOW_HIGH)
        expect(decimaltotalBalanceAsset1, `Validate initial balance for ${ASSET.BTC}`).to.equal(INITIAL_BALANCES.BTC)
        expect(decimaltotalBalanceAsset2, `Validate initial balance for ${ASSET.ETH}`).to.equal(INITIAL_BALANCES.ETH)
        expect(decimaltotalBalanceAsset3, `Validate initial balance for ${ASSET.USD}`).to.equal(INITIAL_BALANCES.USD)
        expect(decimaltotalBalanceAsset4, `Validate initial balance for ${ASSET.BCH}`).to.equal(INITIAL_BALANCES.BCH)
        expect(decimaltotalBalanceAsset5, `Validate initial balance for ${ASSET.LTC}`).to.equal(INITIAL_BALANCES.LTC)
      })
    })
  })
}