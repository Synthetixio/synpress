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
 * Date: 09/05/23 15:57
 * Author(s): Diego Graf
 * -----------------------
 * Last Modified: 7/22/2024
 * Modified By: Diego Graf
 * 
 */

/* Constants */
const BOSONIC_CONSTANTS = require('../../support/bosonic.constants')
const { WAIT } = require('../../support/bosonic.enum.wait')

/* Import widgets */
import MainPage from '../../widgets/MainPage'
const mainPage = new MainPage()
import OutboundTicketsWidget from '../../widgets/trader/OutboundTicketsWidget'
const outboundTicketsWidget = new OutboundTicketsWidget()
import BalancesWidget from '../../widgets/trader/BalancesWidget'
const balancesWidget = new BalancesWidget()
import LoginPage from '../../widgets/LoginPage'
const loginPage = new LoginPage()

/* String commands */
const enter = '{enter}'

/* Assets Array */
const ASSETS = ['QAT', 'JPY', 'USD', '1BB', 'ALL', 'VET', 'LNK', 'ETX', 'USDT', 'KDA', 'PRQ', 'WHB', 'UU0', 'AQA', '1IN', 'XRP', 'SYA', 'QA1', 'AED', 'EUR', 'QA2', 'AMP', 'BCH', 'OMG', 'UZ0', 'BTC', 'SUS', 'AVE', 'MZA', 'CRE', 'LTC', 'USDC', 'ENJ', 'HTR', 'BTX', 'AFN', 'UZS', 'RPO', 'UNI', 'VXV', 'QNT', 'XLM', 'SNX', 'YFI', 'XTZ', 'COM', 'USC', 'B15', 'USH', 'BAL', 'USM', 'SOL', 'USP', 'LEN', 'BAT', 'USU', 'UST', 'ETH', 'BND', 'OCN', 'USZ', 'ADA', 'LNA', 'UH1']

/* Messages */
const NOT_ENOUGH_BALANCE_MESSAGE_TO_BUY = "you are trying to SELL: USD for 1,000,000.00 but you only have"
const NOT_ENOUGH_BALANCE_MESSAGE_TO_SELL = "you are trying to SELL: LTC for 1,000,000.00 but you only have"
const NOT_ASSET_SELECTED_MESSAGE = "Select both assets first"
const NOT_CUSTODIAN_SELECTED_MESSAGE = "Select the custodian First."

/**
 * Make a RFQ without selecting any field
 * @param {Json} fixture: Data used in test  
 * @param {Array} fieldNotCompleted: Field not completed in form
 * @param {String} target: Field to validate
 */

Cypress.Commands.add('newRfqWithoutField', (fixture, fieldNotCompleted, target) => {

  cy.cancelAllOpenOrders().wait(WAIT.MEDIUM)

  mainPage.getRfqOptionMenu().click().wait(WAIT.HIGH)

  outboundTicketsWidget.getCreateOrderBtn().click().wait(WAIT.LOW_HIGH)

  outboundTicketsWidget.getOutboundTicket().within(() => {

    /* Order Type */
    if (!fieldNotCompleted.includes('orderType')) {
      outboundTicketsWidget.getOrderTypeSelectOption().click().contains(`${fixture.orderType}`).click().wait(WAIT.LOW_HIGH)
    }

    /* Tif */
    if (!fieldNotCompleted.includes('tif')) {
      outboundTicketsWidget.getTifSelectOption().click().contains(`${fixture.tif}`).click().wait(WAIT.LOW_HIGH)
    }

    /* Quote Type */
    if (!fieldNotCompleted.includes('quoteType')) {
      outboundTicketsWidget.getQuoteTypeSelectOption().click().contains(`${fixture.quoteType}`).click().wait(WAIT.LOW_HIGH)
    }

    /* Side */
    if (!fieldNotCompleted.includes('side')) {
      outboundTicketsWidget.getSideSelectOption().click().contains(`${fixture.side}`).click().wait(WAIT.LOW_HIGH)
    }

    /* Asset 1 */
    if (!fieldNotCompleted.includes('asset1')) {
      outboundTicketsWidget.getAsset1SelectOption().click().type(`${fixture.asset1} {enter}`).wait(WAIT.LOW_HIGH)
    }

    /* Asset 2 */
    if (!fieldNotCompleted.includes('asset2')) {
      outboundTicketsWidget.getAsset2SelectOption().click().type(`${fixture.asset2} {enter}`).wait(WAIT.LOW_HIGH)
    }

    /* Custodian */
    if (!fieldNotCompleted.includes('custodian')) {
      outboundTicketsWidget.getCustodianSelectOption().click().type(`${fixture.custodian} {enter}`).click().wait(WAIT.LOW_HIGH)
    }

    /* Amount */
    if (!fieldNotCompleted.includes('amount')) {
      outboundTicketsWidget.getAmountInput().click().clear().type(`${fixture.amount} {enter}`).wait(WAIT.LOW_HIGH)
    }

    /* Rate */
    if (!fieldNotCompleted.includes('rate')) {
      outboundTicketsWidget.getRateInput().click().clear().type(`${fixture.rate} {enter}`).wait(WAIT.LOW_HIGH)
    }

    /* Counterparty */
    if (!fieldNotCompleted.includes('counterparty')) {
      outboundTicketsWidget.getCounterpartySelectOption().click().wait(WAIT.MEDIUM)
    }

    cy.wait(WAIT.STANDARD)
  })

  /* Counterparty contains selection */
  if (!fieldNotCompleted.includes('counterparty')) {
    outboundTicketsWidget.getCounterpartyInput().type(fixture.counterparty).wait(WAIT.LOW)
    cy.contains(fixture.counterparty).click().wait(WAIT.LOW)
    outboundTicketsWidget.getCounterpartySelectOption().click().wait(WAIT.LOW)
  }

  /* Validations */
  switch (target) {

    case 'counterparty':
      /* Validate if the send button is disabled */
      outboundTicketsWidget.getSendButton().should('be.disabled').wait(WAIT.LOW)
      break

    case 'asset2':
      /* 
       * Validate if It's not possible to select the custodian and conunterparty 
       * until the second asset is selected 
       */

      /* Validate if it's not possible to select the custodian */
      outboundTicketsWidget.getCustodianSelectOption().click()
      cy.contains('Select both assets first').should('be.visible').wait(WAIT.LOW)

      /* Validate if it's not possible to select the counterparty */
      outboundTicketsWidget.getCounterpartySelectOption().click()
      cy.contains('Select the custodian First').should('be.visible').wait(WAIT.LOW)
      outboundTicketsWidget.getCounterpartySelectOption().click()

      /* Validate if the send button is disabled */
      outboundTicketsWidget.getSendButton().should('be.disabled').wait(WAIT.LOW)
      break

    case 'custodian':
      /* 
       * Validate if It's not possible to select the conunterparty until the custodian 
       * is selected 
       */

      /* Validate if it's not possible to select the counterparty */
      outboundTicketsWidget.getCounterpartySelectOption().click()
      cy.contains('Select the custodian First').should('be.visible').wait(WAIT.LOW)

      /* Validate if the send button is disabled */
      outboundTicketsWidget.getSendButton().should('be.disabled').wait(WAIT.LOW)
      break

    case 'rate':
      /* Validate if the send button is disabled */
      outboundTicketsWidget.getSendButton().should('be.disabled').wait(WAIT.LOW)
      break

    case 'amount':
      /* Validate if the send button is disabled */
      outboundTicketsWidget.getSendButton().should('be.disabled').wait(WAIT.LOW)
      break

    case 'asset1':
      /* Validate if the send button is disabled */
      outboundTicketsWidget.getSendButton().should('be.disabled').wait(WAIT.LOW)
      break

    case 'side':
      /* 
       * Validate if It's not possible to select: asset1, amount, custodian, asset2 
       * and counterparty
       */

      /* Validate if it's not possible to select the asset1 */
      outboundTicketsWidget.getAsset1SelectOption().click()
      cy.contains('Select side first').should('be.visible').wait(WAIT.LOW)
      outboundTicketsWidget.getAsset1SelectOption().click()

      /* Validate if it's not possible to enter the custodian */
      outboundTicketsWidget.getCustodianSelectOption().click()
      cy.contains('Select both assets first').should('be.visible').wait(WAIT.LOW)

      /* Validate if it's not possible to select the asset2 */
      outboundTicketsWidget.getAsset2SelectOption().click()
      cy.contains('Select side first').should('be.visible').wait(WAIT.LOW)
      outboundTicketsWidget.getAsset2SelectOption().click()

      /* Validate if it's not possible to select the counterparty */
      outboundTicketsWidget.getCounterpartySelectOption().click()
      cy.contains('Select the custodian First').should('be.visible').wait(WAIT.LOW)
      outboundTicketsWidget.getCounterpartySelectOption().click()

      /* Validate if the send button is disabled */
      outboundTicketsWidget.getSendButton().should('be.disabled').wait(WAIT.LOW)

    case 'quoteType':
      /* Validate if the send button is disabled */
      outboundTicketsWidget.getSendButton().should('be.disabled').wait(WAIT.LOW)
      break

    case 'tif':
      /* Validate if the send button is disabled */
      outboundTicketsWidget.getSendButton().should('be.disabled').wait(WAIT.LOW)
      break

    case 'orderType':
      /* Validate if the send button is disabled */
      outboundTicketsWidget.getSendButton().should('be.disabled').wait(WAIT.LOW)
      break
  }
})

/**
 * Make a RFQ with incorrect input data
 * @param {Json} fixture: Data used in test
 * @param {String} target: Field to validate
 */

Cypress.Commands.add('newRfqWithIncorretInputData', (fixture, target) => {

  cy.cancelAllOpenOrders().wait(WAIT.MEDIUM)

  mainPage.getRfqOptionMenu().click().wait(WAIT.HIGH)

  outboundTicketsWidget.getCreateOrderBtn().click()

  outboundTicketsWidget.getOutboundTicket().within(() => {

    outboundTicketsWidget.getOrderTypeSelectOption().click().contains(`${fixture.orderType}`).click()
    outboundTicketsWidget.getTifSelectOption().click().contains(`${fixture.tif}`).click()
    outboundTicketsWidget.getQuoteTypeSelectOption().click().contains(`${fixture.quoteType}`).click()
    outboundTicketsWidget.getSideSelectOption().click().contains(`${fixture.side}`).click()
    outboundTicketsWidget.getAsset1SelectOption().click().type(`${fixture.asset1} {enter}`)
    outboundTicketsWidget.getAsset2SelectOption().click().type(`${fixture.asset2} {enter}`)
    outboundTicketsWidget.getCustodianSelectOption().click().type(`${fixture.custodian} {enter}`).click()
    outboundTicketsWidget.getAmountInput().click().clear().type(`${fixture.amount} {enter}`)
    outboundTicketsWidget.getRateInput().click().clear().type(`${fixture.rate} {enter}`)
    outboundTicketsWidget.getCounterpartySelectOption().click().wait(WAIT.MEDIUM)

    cy.wait(WAIT.STANDARD)
  })

  /* Counterparty contains selection */
  outboundTicketsWidget.getCounterpartyInput().type(fixture.counterparty).wait(WAIT.LOW)
  cy.contains(fixture.counterparty).click().wait(WAIT.LOW)
  outboundTicketsWidget.getCounterpartySelectOption().click().wait(WAIT.LOW)

  switch (target) {

    case 'amount0':
      /* Validate if the send button is disabled */
      outboundTicketsWidget.getSendButton().should('be.disabled').wait(WAIT.LOW)
      break

    case 'negativeAmount':
      /* Validate if the value in the value input field is equal to 1 and not -1 */
      outboundTicketsWidget.getAmountInput().invoke('val').then(value => {
        expect(Number(value)).to.equal(fixture.amount * -1)
      })
      /* Validate if the send button is enabled */
      outboundTicketsWidget.getSendButton().should('be.enabled').wait(WAIT.LOW)
      break

    case 'rate0':
      /* Validate if the send button is disabled */
      outboundTicketsWidget.getSendButton().should('be.disabled').wait(WAIT.LOW)
      break

    case 'negativeRate':
      /* Validate if the value in the value input field is equal to 1 and not -1 */
      outboundTicketsWidget.getRateInput().invoke('val').then(value => {
        expect(Number(value)).to.equal(fixture.rate * -1)
      })
      /* Validate if the send button is enabled */
      outboundTicketsWidget.getSendButton().should('be.enabled').wait(WAIT.LOW)
      break
  }
})

/**
 * Make a RFQ without enough balance to pay and validate the process
 * @param {Json} fixture: Data used in test
 */

Cypress.Commands.add('newRfqWithoutBalance', (fixture) => {

  /* If there are open orders, these are cancelled */
  cy.cancelAllOpenOrders()

  mainPage.getRfqOptionMenu().click().wait(WAIT.HIGH)

  outboundTicketsWidget.getCreateOrderBtn().click()

  outboundTicketsWidget.getOutboundTicket().within(() => {

    /* Order Type */
    outboundTicketsWidget.getOrderTypeSelectOption().click().contains(`${fixture.orderType}`).click()
    /* Tif */
    outboundTicketsWidget.getTifSelectOption().click().contains(`${fixture.tif}`).click()
    /* Quote Type */
    outboundTicketsWidget.getQuoteTypeSelectOption().click().contains(`${fixture.quoteType}`).click()
    /* Side */
    outboundTicketsWidget.getSideSelectOption().click().contains(`${fixture.side}`).click()
    /* Asset 1 */
    outboundTicketsWidget.getAsset1SelectOption().click().type(`${fixture.asset1} {enter}`)
    /* Asset 2 */
    outboundTicketsWidget.getAsset2SelectOption().click().type(`${fixture.asset2} {enter}`)
    /* Custodian */
    outboundTicketsWidget.getCustodianSelectOption().click().type(`${fixture.custodian} {enter}`).click()
    /* Amount */
    outboundTicketsWidget.getAmountInput().click().clear().type(`${fixture.amount} {enter}`)
    /* Rate */
    outboundTicketsWidget.getRateInput().click().clear().type(`${fixture.rate} {enter}`)
    /* Counterparty */
    outboundTicketsWidget.getCounterpartySelectOption().click().wait(WAIT.MEDIUM)

    cy.wait(WAIT.STANDARD)
  })

  /* Counterparty contains selection */
  outboundTicketsWidget.getCounterpartyInput().type(fixture.counterparty).wait(WAIT.LOW)
  cy.contains(fixture.counterparty).click().wait(WAIT.LOW)
  outboundTicketsWidget.getCounterpartySelectOption().click().wait(WAIT.LOW)

  /* Validate if the modal message appears */
  if (fixture.side == "BUY") {
    cy.contains(NOT_ENOUGH_BALANCE_MESSAGE_TO_BUY)
  }
  else {
    cy.contains(NOT_ENOUGH_BALANCE_MESSAGE_TO_SELL)
  }

  cy.logout()
})

/**
 * Make a RFQ with asset that has not balance
 * @param {Json} fixture: Data used in test
 */

Cypress.Commands.add('newRfqWithNoBalanceAsset', (fixture) => {

  /* We get all Assets with balance from the UI */
  /* Maximize balance widget */
  balancesWidget.getMaximizeWidgetButton().click().wait(WAIT.MEDIUM)

  /* Get the quantity of rows */
  let assetsInBalance = []
  balancesWidget.getRowsQuantity().then($rowsQuantity => {
    for (let row = 0; row < $rowsQuantity; row++) {
      balancesWidget.getAssetByRow(row).then($asset => {
        assetsInBalance.push($asset.text())
        let uniqueAssetsInBalance = [...new Set(assetsInBalance)]
        cy.task('setAssetListInBalance', uniqueAssetsInBalance)
      })
    }
  })

  /* Restore balance widget */
  balancesWidget.getMaximizeWidgetButton().click().wait(WAIT.MEDIUM)

  /* If there are open orders, these are cancelled */
  cy.cancelAllOpenOrders()

  mainPage.getRfqOptionMenu().click().wait(WAIT.HIGH)

  outboundTicketsWidget.getCreateOrderBtn().click()

  outboundTicketsWidget.getOutboundTicket().within(() => {

    /* Order Type */
    outboundTicketsWidget.getOrderTypeSelectOption().click().contains(`${fixture.orderType}`).click()
    /* Tif */
    outboundTicketsWidget.getTifSelectOption().click().contains(`${fixture.tif}`).click()
    /* Quote Type */
    outboundTicketsWidget.getQuoteTypeSelectOption().click().contains(`${fixture.quoteType}`).click()
    /* Side */
    outboundTicketsWidget.getSideSelectOption().click().contains(`${fixture.side}`).click()

    if (fixture.side == 'SELL') {
      /* Asset 1 */
      outboundTicketsWidget.getAsset1SelectOption().click()
      /* Get list of assets in Asset1 dropdown */
      let assetsInDropdownAsset1 = []
      outboundTicketsWidget.getAsset1ListQuantityInDropDown().then($assetListQuantity => {
        for (let row = 1; row <= $assetListQuantity; row++) {
          outboundTicketsWidget.getAsset1ByRow(row).then($asset => {
            assetsInDropdownAsset1.push($asset.text())
            cy.task('setAssetListInDropDown', assetsInDropdownAsset1)
          })
        }
      })
      outboundTicketsWidget.getAsset1SelectOption().click({ force: true })
      /* Asset 2 */
      outboundTicketsWidget.getAsset2SelectOption().click().type(`${fixture.asset2} {enter}`)
    } else {
      /* Asset 1 */
      outboundTicketsWidget.getAsset1SelectOption().click().type(`${fixture.asset1} {enter}`)
      /* Asset 2 */
      outboundTicketsWidget.getAsset2SelectOption().click()
      /* Get list of assets in Asset2 dropdown */
      let assetsInDropdownAsset2 = []
      outboundTicketsWidget.getAsset2ListQuantityInDropDown().then($assetListQuantity => {
        for (let row = 1; row <= $assetListQuantity; row++) {
          outboundTicketsWidget.getAsset2ByRow(row).then($asset => {
            assetsInDropdownAsset2.push($asset.text())
            cy.task('setAssetListInDropDown', assetsInDropdownAsset2)
          })
        }
      })
      outboundTicketsWidget.getAsset2SelectOption().click()
    }

    cy.task('getAssetListInBalance').then(assetListInBalance => {
      cy.task('getAssetListInDropDown').then(assetListInDropDown => {
        /* Sort both lists of assets to compare */
        assetListInBalance.sort()
        assetListInDropDown.sort()
        /* If the asset to buy is in the balance, we need to pull from balance array because you can not pay with the same asset that you buy */
        if (assetListInBalance.includes(fixture.asset1) && fixture.side == 'BUY') {
          for (let i = 0; i < assetListInBalance.length; i++) {
            if (assetListInBalance[i] == fixture.asset1) {
              assetListInBalance.splice(i, 1)
            }
          }
        }
        /* First validate if the number of assets in balance and the dropdown list are the same */
        expect(assetListInBalance.length, 'The number of assets in balance and the dropdown list are the same').to.equal(assetListInDropDown.length)
        /* Validate asset by asset */
        for (let i = 0; i < assetListInBalance.length; i++) {
          expect(assetListInBalance[i]).to.equal(assetListInDropDown[i])
        }
        /* Foreach a constant with a list of assets and in the first appearance of an asset without balance try to type in the asset1 dropdown */
        for (let i = 0; i < ASSETS.length; i++) {
          if (!assetListInBalance.includes(ASSETS[i])) {
            if (fixture.side == 'SELL') {
              outboundTicketsWidget.getAsset1SelectOption().click()
              outboundTicketsWidget.getAsset1SelectOption().type(`${ASSETS[i]}${enter}`)
            } else {
              outboundTicketsWidget.getAsset2SelectOption().click()
              outboundTicketsWidget.getAsset2SelectOption().type(`${ASSETS[i]}${enter}`)
            }
            break
          }
        }
      })
    })

    /* Custodian */
    outboundTicketsWidget.getCustodianSelectOption().click().type(`${fixture.custodian} {enter}`).click()
    cy.contains(NOT_ASSET_SELECTED_MESSAGE)
    outboundTicketsWidget.getCustodianSelectOption().click()
    /* Amount */
    outboundTicketsWidget.getAmountInput().click().clear().type(`${fixture.amount} {enter}`)
    /* Rate */
    outboundTicketsWidget.getRateInput().click().clear().type(`${fixture.rate} {enter}`)
    /* Counterparty */
    outboundTicketsWidget.getCounterpartySelectOption().click().wait(WAIT.MEDIUM)

    cy.wait(WAIT.STANDARD)
  })

  cy.contains(NOT_CUSTODIAN_SELECTED_MESSAGE)
  /* Validate if the send button is enabled */
  outboundTicketsWidget.getSendButton().should('be.disabled').wait(WAIT.LOW)
})

/**
 * Validate if wrong password or user error message appears when trying to log in with an incorrect password.
 * @param {Json} user: User used in test
 */

Cypress.Commands.add('validateValidUserWithIncorrectPassword', (user) => {

  cy.visit(BOSONIC_CONSTANTS.COMMON.LOGIN)

  let USER_CHANGED = user
  USER_CHANGED.PASS = "invalid_password"

  loginPage.getUsernameInput().type(USER_CHANGED.USER)
  loginPage.getPasswordInput().type(USER_CHANGED.PASS)
  loginPage.getLoginButton().click().wait(WAIT.STANDARD)

  loginPage.getErrorMessageNotification().then(alert => {
    expect(alert.text()).to.equal(loginPage.getWrongUserExpectedErrorMessageText())
  })

  cy.contains(loginPage.getWrongUserExpectedErrorMessageText()).should('be.visible')
})

/**
 * Validate if wrong password or user error message appears when trying to log in with an incorrect user.
 * @param {Json} user: User used in test
 */

Cypress.Commands.add('validateNonExistentUserWithAnyPassword', (user) => {

  cy.visit(BOSONIC_CONSTANTS.COMMON.LOGIN)

  let USER_CHANGED = user
  USER_CHANGED.USER = 'noexistent@bosonic.com'

  loginPage.getUsernameInput().type(USER_CHANGED.USER)
  loginPage.getPasswordInput().type(USER_CHANGED.PASS)
  loginPage.getLoginButton().click().wait(WAIT.STANDARD)

  loginPage.getErrorMessageNotification().then(alert => {
    expect(alert.text()).to.equal(loginPage.getWrongUserExpectedErrorMessageText())
  })

  cy.contains(loginPage.getWrongUserExpectedErrorMessageText()).should('be.visible')
})

/**
 * Validate if a empty field error message appears when trying to log in with an empty field.
 */

Cypress.Commands.add('validateEmptyUserAndPasswordField', () => {

  cy.visit(BOSONIC_CONSTANTS.COMMON.LOGIN)

  loginPage.getLoginButton().click().wait(WAIT.STANDARD)

  loginPage.getErrorMessageNotification().then(alert => {
    expect(alert.text()).to.equal(loginPage.getNotEmptyUserOrPasswordErrorMessageText())
  })

  cy.contains(loginPage.getNotEmptyUserOrPasswordErrorMessageText()).should('be.visible')
})

/**
 * Validate if wrong email format error message appears when trying to log in with an incorrect email.
 * @param {Json} user: User used in test
 */

Cypress.Commands.add('validateInvalidUserWithAnyPassword', (user) => {

  cy.visit(BOSONIC_CONSTANTS.COMMON.LOGIN)

  let USER_CHANGED = user
  USER_CHANGED.USER = "invalid_user"

  loginPage.getUsernameInput().type(USER_CHANGED.USER)
  loginPage.getPasswordInput().type(USER_CHANGED.PASS)
  loginPage.getLoginButton().click().wait(WAIT.STANDARD)

  loginPage.getErrorMessageNotification().then(alert => {
    expect(alert.text()).to.equal(loginPage.getInvalidEmailAddressErrorMessageText())
  })

  cy.contains(loginPage.getInvalidEmailAddressErrorMessageText()).should('be.visible')
})

/**
 * Validate if wrong email format error message appears when trying to log in with an email with multiple blank spaces.
 * @param {Json} user: User used in test
 */

Cypress.Commands.add('validateMultipleBlankSpacesIntoUserEmail', (user) => {

  cy.visit(BOSONIC_CONSTANTS.COMMON.LOGIN)

  let USER_CHANGED = user
  USER_CHANGED.USER = "tm1.autom ation@boso nic.dig ital"

  loginPage.getUsernameInput().type(USER_CHANGED.USER)
  loginPage.getPasswordInput().type(USER_CHANGED.PASS)
  loginPage.getLoginButton().click().wait(WAIT.STANDARD)

  loginPage.getErrorMessageNotification().then(alert => {
    expect(alert.text()).to.equal(loginPage.getInvalidEmailAddressErrorMessageText())
  })

  cy.contains(loginPage.getInvalidEmailAddressErrorMessageText()).should('be.visible')
})