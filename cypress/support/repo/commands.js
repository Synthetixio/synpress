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
 * Date: 09/07/23 14:18
 * Author(s): Diego Graf
 * -----------------------
 * Last Modified: 8/2/24
 * Modified By: Diego Graf
 *
 */

/* Constants */
const BOSONIC_CONSTANTS = require('../../support/bosonic.constants')
const { WAIT } = require('../../support/bosonic.enum.wait')
const { ASSET } = require('../../support/bosonic.enum.asset')
const { TASK, MESSAGE, URL, USER, WIDGET, MISC, CLOSE_REPO_METHOD, SYMBOL } = require('../../support/repo/constants')
const { STATUS } = require('../../support/bosonic.enum.tx-status')
const { SIDE } = require('../../support/bosonic.enum.side')

let Decimal = require('decimal.js-light');
Decimal.config({ precision: 6 })

/* Index */
const INDEX_ASSET_1 = 0
const INDEX_ASSET_2 = 1
const INDEX_ASSET_3 = 2
const INDEX_ASSET_4 = 3

/* Percents */
const NINETY_PERCENT = 0.9
const TENTH_PERCENT = 0.1

/* Misc */
const ONE_ORDER = 1

/* User type */
const LENDER = 'Lender'
const BORROWER = 'Borrower'
const FEES = 'Fees'

/* PATHS */
const OPEN_REPO_ENDPOINT_PART = "rest/lmorder/queryAll?**"
const REPO_ORDER_ENDPOINT_PART = "rest/lmorder"
const INTERCEPTOR_REPO_BORROWER = URL.URL_TM_BORROWER + REPO_ORDER_ENDPOINT_PART
const INTERCEPTOR_REPO_LENDER = URL.URL_TM_LENDER + REPO_ORDER_ENDPOINT_PART
const INTERCEPTOR_OPEN_ORDER_BORROWER = URL.URL_TM_BORROWER + OPEN_REPO_ENDPOINT_PART
const INTERCEPTOR_OPEN_ORDER_LENDER = URL.URL_TM_LENDER + OPEN_REPO_ENDPOINT_PART

/* Context */
const addContext = require('mochawesome/addContext')
const moment = require('moment/moment')

const TODAY_PATTERN = 'mm/dd/yyyy'

const FS_OPTIONS_PARAMETERS = { flag: 'a+' }

/* Widgets */
import RepoPositionsBorrowsWidget from '../../widgets/trader/RepoPositionsBorrowsWidget'
const repoPositionsBorrowsWidget = new RepoPositionsBorrowsWidget()
import TradeBlotterWidget from '../../widgets/trader/TradeBlotterWidget'
const tradeBlotterWidget = new TradeBlotterWidget()
import MainPage from '../../widgets/MainPage'
const mainPage = new MainPage()
import OpenOrdersWidget from '../../widgets/trader/OpenOrdersWidget'
const openOrdersWidget = new OpenOrdersWidget()
import RepoPositionsLendsWidget from '../../widgets/trader/RepoPositionsLendsWidget'
const repoPositionsLendsWidget = new RepoPositionsLendsWidget()

/**
 * Run preconditions for each specification
 * @param {Json} fixture: Data used in test
 * @param {Object} initialBalancesBorrower: Borrower initial balance needed to start test
 * @param {Object} borrowerInfo: Borrower user to be used in test
 * @param {Object} lenderInfo: Lender user to be used in test
 */
Cypress.Commands.add('runRepoPreconditions', (fixture, initialBalancesBorrower, borrowerInfo, lenderInfo, feesInfo) => {

  const ib = initialBalancesBorrower
  /* Get balances */
  cy.getBalancesAndSaveInTask(borrowerInfo.url, borrowerInfo.user, TASK.SET_BALANCE_BORROWER_BEFORE, fixture)
  cy.getBalancesAndSaveInTask(lenderInfo.url, lenderInfo.user, TASK.SET_BALANCE_LENDER_BEFORE, fixture)
  cy.getBalancesAndSaveInTask(feesInfo.url, feesInfo.user, TASK.SET_BALANCE_FEES_BEFORE, fixture)

  /* Get all required bearer for all the tests and save them in tasks */
  cy.getRequestToken(borrowerInfo.url, borrowerInfo.user).then(token => {
    const BEARER = token.headers['authorization'].replace('Bearer ', '')
    cy.task(TASK.SET_BORROWER_BEARER, BEARER)
  })
  cy.getRequestToken(lenderInfo.url, lenderInfo.user).then(token => {
    const BEARER = token.headers['authorization'].replace('Bearer ', '')
    cy.task(TASK.SET_LENDER_BEARER, BEARER)
  })
  cy.getRequestToken(feesInfo.url, feesInfo.user).then(token => {
    const BEARER = token.headers['authorization'].replace('Bearer ', '')
    cy.task(TASK.SET_FEES_BEARER, BEARER)
  })
  cy.getRequestToken(URL.URL_TM_TAKER, USER.USER_TM_TAKER).then(token => {
    const BEARER = token.headers['authorization'].replace('Bearer ', '')
    cy.task(TASK.SET_TAKER_BEARER, BEARER)
  })

  /* Send all the balance to pivot user */
  cy.task(TASK.GET_BALANCE_BORROWER_BEFORE).then(totalBorrowerBalanceBefore => {
    let decimaltotalBalanceBorrowerBeforeBTC = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_1]).toNumber()
    let decimaltotalBalanceBorrowerBeforeUSD = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_2]).toNumber()
    let decimaltotalBalanceBorrowerBeforeETH = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_3]).toNumber()
    let decimaltotalBalanceBorrowerBeforeUSDC = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_4]).toNumber()

    let paymentsMap = new Map()
    if (decimaltotalBalanceBorrowerBeforeBTC != 0) paymentsMap.set(ASSET.BTC, decimaltotalBalanceBorrowerBeforeBTC)
    if (decimaltotalBalanceBorrowerBeforeUSD != 0) paymentsMap.set(ASSET.USD, decimaltotalBalanceBorrowerBeforeUSD)
    if (decimaltotalBalanceBorrowerBeforeETH != 0) paymentsMap.set(ASSET.ETH, decimaltotalBalanceBorrowerBeforeETH)
    if (decimaltotalBalanceBorrowerBeforeUSDC != 0) paymentsMap.set(ASSET.USDC, decimaltotalBalanceBorrowerBeforeUSDC)

    cy.task(TASK.GET_BORROWER_BEARER).then(bearer => {
      cy.rebalanceWithPayments(bearer, fixture.custodian, paymentsMap, USER.USER_TM_TAKER.USER)
    })
  })

  /* Send the needed balance from pivot user to borrower before start the test */
  cy.task(TASK.GET_TAKER_BEARER).then(bearer => {
    let paymentsMap = new Map()
    if (ib.USD != 0) paymentsMap.set(ASSET.USD, ib.USD)
    if (ib.ETH != 0) paymentsMap.set(ASSET.ETH, ib.ETH)
    if (ib.BTC != 0) paymentsMap.set(ASSET.BTC, ib.BTC)
    if (ib.USDC != 0) paymentsMap.set(ASSET.USDC, ib.USDC)
    cy.rebalanceWithPayments(bearer, fixture.custodian, paymentsMap, borrowerInfo.user.USER)
  }).wait(WAIT.MEDIUM)

  /* Get balances Borrower TM after payment and before repo */
  cy.getBalancesAndSaveInTask(borrowerInfo.url, borrowerInfo.user, TASK.SET_BALANCE_BORROWER_BEFORE, fixture)

  /* Wait until paymets was maded */
  cy.wait(WAIT.MEDIUM)
})

/**
 * Run preconditions for each specification by test repoContract closed after 24hs
 * @param {Json} fixture: Data used in test
 * @param {Object} initialBalancesBorrower: Borrower initial balance needed to start test
 * @param {Object} borrowerInfo: Borrower user to be used in test
 * @param {Object} lenderInfo: Lender user to be used in test
 */
Cypress.Commands.add('runRepoPreconditions24hs', (fixture, initialBalancesBorrower, usersData) => {

  const borrowerIndex = 0
  const lenderIndex = 1
  const feesIndex = 2
  const payorIndex = 3

  const ib = initialBalancesBorrower

  /* Get balances */
  cy.getBalancesAndSaveInTask(usersData[borrowerIndex].url, usersData[borrowerIndex].user, TASK.SET_BALANCE_BORROWER_BEFORE, fixture)
  cy.getBalancesAndSaveInTask(usersData[lenderIndex].url, usersData[lenderIndex].user, TASK.SET_BALANCE_LENDER_BEFORE, fixture)
  cy.getBalancesAndSaveInTask(usersData[feesIndex].url, usersData[feesIndex].user, TASK.SET_BALANCE_FEES_BEFORE, fixture)

  /* Send all the balance to pivot user */
  cy.task(TASK.GET_BALANCE_BORROWER_BEFORE).then(totalBorrowerBalanceBefore => {
    let decimaltotalBalanceBorrowerBeforeBTC = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_1]).toNumber()
    let decimaltotalBalanceBorrowerBeforeUSD = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_2]).toNumber()

    let paymentsMap = new Map()
    if (decimaltotalBalanceBorrowerBeforeBTC != 0) paymentsMap.set(ASSET.BTC, decimaltotalBalanceBorrowerBeforeBTC)
    if (decimaltotalBalanceBorrowerBeforeUSD != 0) paymentsMap.set(ASSET.USD, decimaltotalBalanceBorrowerBeforeUSD)

    cy.task(TASK.GET_BORROWER_BEARER).then(bearer => {
      cy.rebalanceWithPayments(bearer, fixture.custodian, paymentsMap, usersData[payorIndex].user.USER)
    })
  })

  /* Send the needed balance from pivot user to borrower before start the test */
  cy.task(TASK.GET_TAKER_BEARER).then(bearer => {
    let paymentsMap = new Map()
    if (ib.USD != 0) paymentsMap.set(ASSET.USD, ib.USD)
    if (ib.BTC != 0) paymentsMap.set(ASSET.BTC, ib.BTC)
    cy.rebalanceWithPayments(bearer, fixture.custodian, paymentsMap, usersData[borrowerIndex].user.USER)
  }).wait(WAIT.MEDIUM)

  /* Get balances Borrower TM after payment and before repo */
  cy.getBalancesAndSaveInTask(usersData[borrowerIndex].url, usersData[borrowerIndex].user, TASK.SET_BALANCE_BORROWER_BEFORE, fixture)

  /* Wait until paymets was maded */
  cy.wait(WAIT.MEDIUM)
})


/**
 * Run preconditions for each specification
 * @param {Json} fixture: Data used in test
 * @param {Object} initialBalancesBorrower: Borrower initial balance needed to start test
 * @param {Object} borrowerInfo: Borrower user to be used in test
 * @param {Object} lenderInfo: Lender user to be used in test
 */
Cypress.Commands.add('saveBalancesInJsonFile', (fixture, borrowerInfo, lenderInfo, feesInfo, jsonFileBalances) => {

  const users = [borrowerInfo, lenderInfo, feesInfo]
  const iterations = users.length

  cy.writeFile(jsonFileBalances, "{", FS_OPTIONS_PARAMETERS)

  for (let i = 0; i < iterations; i++) {

    cy.getBalancesAndSaveInJsonFile(users[i].url, users[i].user, jsonFileBalances, fixture, users[i].type)

    if (i != (iterations - 1)) {
      cy.writeFile(jsonFileBalances, ",", FS_OPTIONS_PARAMETERS)
    } else {
      cy.writeFile(jsonFileBalances, "", FS_OPTIONS_PARAMETERS)
    }
  }

  cy.writeFile(jsonFileBalances, "}", FS_OPTIONS_PARAMETERS)

})

/**
 * Validate initial balance for each specification
 * @param {Json} fixture: Data used in test
 * @param {Object} initialBalancesBorrower: Borrower initial balance needed to start test
 * @param {Object} borrowerInfo: Borrower user to be used in test
 */
Cypress.Commands.add('validateRepoInitialBalance', (fixture, initialBalancesBorrower, borrowerInfo) => {
  cy.task(TASK.GET_BORROWER_BEARER).then(bearer => {
    cy.getTraderBalanceWithBearerOnlyAPI(borrowerInfo.url, fixture.custodian, borrowerInfo.user, bearer).then(borrowerBalances => {
      const TOTAL_BALANCE_BORROWER = [borrowerBalances[fixture.asset1].total, borrowerBalances[fixture.asset2].total, borrowerBalances[fixture.asset3].total, borrowerBalances[fixture.asset4].total]
      let decimaltotalBalanceBorrowerAsset1 = new Decimal(TOTAL_BALANCE_BORROWER[INDEX_ASSET_1]).toNumber()
      let decimaltotalBalanceBorrowerAsset2 = new Decimal(TOTAL_BALANCE_BORROWER[INDEX_ASSET_2]).toNumber()
      let decimaltotalBalanceBorrowerAsset3 = new Decimal(TOTAL_BALANCE_BORROWER[INDEX_ASSET_3]).toNumber()
      let decimaltotalBalanceBorrowerAsset4 = new Decimal(TOTAL_BALANCE_BORROWER[INDEX_ASSET_4]).toNumber()

      if (initialBalancesBorrower.BTC != null || initialBalancesBorrower.BTC != undefined) {
        expect(decimaltotalBalanceBorrowerAsset1, `Validate initial balance for ${fixture.asset1}`).to.equal(initialBalancesBorrower.BTC)
      }
      if (initialBalancesBorrower.USD != null || initialBalancesBorrower.USD != undefined) {
        expect(decimaltotalBalanceBorrowerAsset2, `Validate initial balance for ${fixture.asset2}`).to.equal(parseFloat(initialBalancesBorrower.USD))
      }
      if (initialBalancesBorrower.ETH != null || initialBalancesBorrower.ETH != undefined) {
        expect(decimaltotalBalanceBorrowerAsset3, `Validate initial balance for ${fixture.asset3}`).to.equal(initialBalancesBorrower.ETH)
      }
      if (initialBalancesBorrower.USDC != null || initialBalancesBorrower.USDC != undefined) {
        expect(decimaltotalBalanceBorrowerAsset4, `Validate initial balance for ${fixture.asset4}`).to.equal(parseFloat(initialBalancesBorrower.USDC))
      }
    })
  })
})

/**
 * Validate balance after repo revert in BTC/USDC tests
 * @param {String} type: Repo user type (Lender, Borrower, Fees)
 * @param {Json} fixture: Data used in test
 * @param {Number} decimals: Number of decimal places used when validating the user's balance
 * @param {Boolean} autoliquidation: Indicate if the repo is cancelled with self-liquidation 
 * @param {Boolean} useEth: Indicate if the repo autoliquidation need to use ETH to buy BTC 
 * @param {Object} userInfo: User whose balance is validated 
 */
Cypress.Commands.add('validateBalanceAfterRevertBtcUsdc', (type, fixture, decimals, autoliquidation, useEth, userInfo) => {

  cy.task(TASK.GET_PRICE).then($price => {

    cy.task(TASK.GET_ELAPSED_TIME).then($elapsedTime => {

      cy.task(TASK.GET_AUTOLIQUIDATION_PRICE).then($autoliquidationPrice => {

        cy.task(TASK.GET_ETH_SELLING_PRICE).then($ethSellingPrice => {

          /* Variables */
          let loan = fixture.amount * $price.replace(',', '')
          const YEARLY = 8760
          /* The first 60 minutes is one hour, the next 60 minutes is 2 hours, and so on */
          let $elapsedTimeSplited = $elapsedTime.split(" ")
          let $elapsedTimeMinutes = $elapsedTimeSplited[0]
          let entireHours = Math.trunc($elapsedTimeMinutes.replace('m', '') / 60) + 1
          let modifiedBalance = loan * (1 / fixture.interest) * ((entireHours) / YEARLY)
          let url, user, decimal_places

          url = userInfo.url
          user = userInfo.user

          switch (decimals) {

            case 3:
              Decimal.config({ precision: 3 })
              decimal_places = 3
              break

            case 6:
              Decimal.config({ precision: 6 })
              decimal_places = 6
              break
          }

          cy.logMessage(`Get balances ${type} after revert.`)

          cy.task(`get${type}Bearer`).then(bearer => {

            cy.getTraderBalanceWithBearerOnlyAPI(url, fixture.custodian, user, bearer).then(balancesAfterRevert => {

              const TOTAL_BALANCE_AFTER_REVERT = [balancesAfterRevert[fixture.asset1].total, balancesAfterRevert[fixture.asset2].total, balancesAfterRevert[fixture.asset3].total, balancesAfterRevert[fixture.asset4].total]

              cy.logMessage('TOTAL_BALANCE_AFTER_REVERT: ' + TOTAL_BALANCE_AFTER_REVERT)

              /* Get price from task to check balances */
              cy.task(`getTotalBalance${type}Before`).then(totalBalanceBefore => {
                let decimaltotalBalanceAfterAsset1 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceAfterAsset2 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceAfterAsset3 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceAfterAsset4 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_4]).toNumber()
                let decimaltotalBalanceBeforeAsset1 = new Decimal(totalBalanceBefore[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceBeforeAsset2 = new Decimal(totalBalanceBefore[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceBeforeAsset3 = new Decimal(totalBalanceBefore[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceBeforeAsset4 = new Decimal(totalBalanceBefore[INDEX_ASSET_4]).toNumber()
                let decimaltotalBalanceBeforeAsset2WithModifiedBalance = 0
                let decimaltotalBalanceBeforeAsset3WithModifiedBalance = 0
                let decimaltotalBalanceBeforeAsset4WithModifiedBalance
                if (type == LENDER) {
                  decimaltotalBalanceBeforeAsset2WithModifiedBalance = decimaltotalBalanceBeforeAsset2
                  decimaltotalBalanceBeforeAsset3WithModifiedBalance = decimaltotalBalanceBeforeAsset3
                  decimaltotalBalanceBeforeAsset4WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset4 + (modifiedBalance * NINETY_PERCENT))).toNumber()
                } else if (type == BORROWER) {
                  /* If the repo is cancelled with self-liquidation then the borrower's balance is reduced by the self-liquidated USD */
                  if (autoliquidation) {
                    decimaltotalBalanceBeforeAsset4WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset4 - modifiedBalance - parseFloat($autoliquidationPrice.replace(',', '').replace('(', '').replace(')', '')))).toNumber()
                  }
                  else {
                    decimaltotalBalanceBeforeAsset4WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset4 - modifiedBalance)).toNumber()
                  }
                  if (useEth) {
                    decimaltotalBalanceBeforeAsset4WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset4WithModifiedBalance + parseFloat($ethSellingPrice))).toNumber()
                    /* Calculate the missing USD to buy the missing BTC */
                    cy.task(TASK.GET_BTC_PRICE).then(btcPrice => {
                      cy.task(TASK.GET_ETH_PRICE).then(ethPrice => {
                        cy.task(TASK.GET_BORROWER_USDC_BALANCE_AFTER_REPO_BEFORE_PAYMENT).then(usdcBalanceAfterRepo => {
                          let missingUsdc = (parseFloat(btcPrice.replace('BTC: ', '').replace('$', '').replace(',', '').replace('(', '').replace(')', '')) * fixture.amount) - parseFloat(usdcBalanceAfterRepo)
                          let ethToSell = missingUsdc / parseFloat(ethPrice.replace('ETH: ', '').replace('$', '').replace(',', '').replace('(', '').replace(')', ''))
                          decimaltotalBalanceBeforeAsset3WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset3 - Number(ethToSell.toFixed(6)))).toNumber()
                          let diffAsset3 = Math.abs(decimaltotalBalanceAfterAsset3 - decimaltotalBalanceBeforeAsset3WithModifiedBalance)
                          cy.task(TASK.SET_DIFF_ASSET_3, diffAsset3)
                        })
                      })
                    })
                  }
                  else {
                    decimaltotalBalanceBeforeAsset3WithModifiedBalance = decimaltotalBalanceBeforeAsset3
                  }
                } else if (type == FEES) {
                  decimaltotalBalanceBeforeAsset4WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset4 + (modifiedBalance * TENTH_PERCENT))).toNumber()
                }
                expect(decimaltotalBalanceAfterAsset1.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset1} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset1.toFixed(decimal_places))
                expect(decimaltotalBalanceAfterAsset2.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset2} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset2.toFixed(decimal_places))
                expect(decimaltotalBalanceAfterAsset4.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset4} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset4WithModifiedBalance.toFixed(decimal_places))
                /* If use the ETH to buy BTC in autoliquidation we need to validate the ETH balance by approximation because we do not have the exactly BTC and ETH prices used to sell and buy */
                if (useEth && type == BORROWER) {
                  cy.task(TASK.GET_DIFF_ASSET_3).then(diffAsset3 => {
                    expect(diffAsset3, `${type} Balance diff for Asset ${fixture.asset3} after repo is beetwen 0.9 and -0.9`).to.be.within(0, 0.9)
                  })
                } else {
                  expect(decimaltotalBalanceAfterAsset3.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset3} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset3WithModifiedBalance.toFixed(decimal_places))
                }
              })
            })
          })
        })
      })
    })
  })
})

/**
 * Validate balance after repo revert in BTC/USD tests
 * @param {String} type: Repo user type (Lender, Borrower, Fees)
 * @param {Json} fixture: Data used in test
 * @param {Number} decimals: Number of decimal places used when validating the user's balance
 * @param {Boolean} autoliquidation: Indicate if the repo is cancelled with self-liquidation 
 * @param {Boolean} useEth: Indicate if the repo autoliquidation need to use ETH to buy BTC 
 * @param {Object} userInfo: User whose balance is validated 
 */
Cypress.Commands.add('validateBalanceAfterRevertBtcUsd', (type, fixture, decimals, autoliquidation, useEth, userInfo, repoFile) => {

  cy.task(TASK.GET_PRICE).then($price => {
    cy.task(TASK.GET_ELAPSED_TIME).then($elapsedTime => {
      cy.task(TASK.GET_AUTOLIQUIDATION_PRICE).then($autoliquidationPrice => {
        /* Variables */
        let loan = fixture.amount * $price.replace(',', '')
        const YEARLY = 8760
        /* The first 60 minutes is one hour, the next 60 minutes is 2 hours, and so on */
        let $elapsedTimeSplited = $elapsedTime.split(" ")
        let $elapsedTimeMinutes = $elapsedTimeSplited[0]
        let entireHours = Math.trunc($elapsedTimeMinutes.replace('m', '') / 60) + 1
        let modifiedBalance = loan * (1 / fixture.interest) * ((entireHours) / YEARLY)
        let url, user, decimal_places

        url = userInfo.url
        user = userInfo.user

        switch (decimals) {

          case 3:
            Decimal.config({ precision: 3 })
            decimal_places = 3
            break

          case 6:
            Decimal.config({ precision: 6 })
            decimal_places = 6
            break
        }

        cy.logMessage(`Get balances ${type} after revert.`)

        cy.task(`get${type}Bearer`).then(bearer => {

          cy.getTraderBalanceWithBearerOnlyAPI(url, fixture.custodian, user, bearer).then(balancesAfterRevert => {

            const TOTAL_BALANCE_AFTER_REVERT = [balancesAfterRevert[fixture.asset1].total, balancesAfterRevert[fixture.asset2].total, balancesAfterRevert[fixture.asset3].total, balancesAfterRevert[fixture.asset4].total]

            cy.logMessage('TOTAL_BALANCE_AFTER_REVERT: ' + TOTAL_BALANCE_AFTER_REVERT)

            /* Get price from task to check balances */
            cy.task(`getTotalBalance${type}Before`).then(totalBalanceBefore => {

              let decimaltotalBalanceAfterAsset1 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_1]).toNumber()
              let decimaltotalBalanceAfterAsset2 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_2]).toNumber()
              let decimaltotalBalanceAfterAsset3 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_3]).toNumber()
              let decimaltotalBalanceAfterAsset4 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_4]).toNumber()
              let decimaltotalBalanceBeforeAsset1 = new Decimal(totalBalanceBefore[INDEX_ASSET_1]).toNumber()
              let decimaltotalBalanceBeforeAsset2 = new Decimal(totalBalanceBefore[INDEX_ASSET_2]).toNumber()
              let decimaltotalBalanceBeforeAsset3 = new Decimal(totalBalanceBefore[INDEX_ASSET_3]).toNumber()
              let decimaltotalBalanceBeforeAsset4 = new Decimal(totalBalanceBefore[INDEX_ASSET_4]).toNumber()
              let decimaltotalBalanceBeforeAsset2WithModifiedBalance = 0
              let decimaltotalBalanceBeforeAsset3WithModifiedBalance = 0
              let decimaltotalBalanceBeforeAsset4WithModifiedBalance
              if (type == LENDER) {
                decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 + (modifiedBalance * NINETY_PERCENT))).toNumber()
                decimaltotalBalanceBeforeAsset3WithModifiedBalance = decimaltotalBalanceBeforeAsset3
                decimaltotalBalanceBeforeAsset4WithModifiedBalance = decimaltotalBalanceBeforeAsset4
              } else if (type == BORROWER) {
                /* If the repo is cancelled with self-liquidation then the borrower's balance is reduced by the self-liquidated USD */
                if (autoliquidation) {
                  decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 - modifiedBalance - parseFloat($autoliquidationPrice.replace(',', '').replace('(', '').replace(')', '')))).toNumber()
                }
                else {
                  decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 - modifiedBalance)).toNumber()
                }
              } else if (type == FEES) {
                decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 + (modifiedBalance * TENTH_PERCENT))).toNumber()
              }
              expect(decimaltotalBalanceAfterAsset1.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset1} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset1.toFixed(decimal_places))
              expect(decimaltotalBalanceAfterAsset4.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset4} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset4.toFixed(decimal_places))
              /* If use the ETH to buy BTC in autoliquidation we need to validate the ETH balance by approximation because we do not have the exactly BTC and ETH prices used to sell and buy */
              if (useEth && type == BORROWER) {
                /* Calculate the missing USD to buy the missing BTC */
                cy.task(TASK.GET_BTC_PRICE).then(btcPrice => {
                  cy.task(TASK.GET_ETH_PRICE).then(ethPrice => {
                    cy.task(TASK.GET_ETH_SELLING_PRICE).then(ethSellingPrice => {
                      decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2WithModifiedBalance + Number(ethSellingPrice.toFixed(6)))).toNumber()
                      expect(decimaltotalBalanceAfterAsset2.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset2} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset2WithModifiedBalance.toFixed(decimal_places))
                      cy.task(TASK.GET_BORROWER_USDC_BALANCE_AFTER_REPO_BEFORE_PAYMENT).then(usdBalanceAfterRepo => {
                        let missingUsd = (parseFloat(btcPrice.replace('BTC: ', '').replace('$', '').replace(',', '').replace('(', '').replace(')', '')) * fixture.amount) - parseFloat(usdBalanceAfterRepo)
                        let ethToSell = missingUsd / parseFloat(ethPrice.replace('ETH: ', '').replace('$', '').replace(',', '').replace('(', '').replace(')', ''))
                        decimaltotalBalanceBeforeAsset3WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset3 - Number(ethToSell.toFixed(6)))).toNumber()
                        let diffAsset3 = Math.abs(decimaltotalBalanceAfterAsset3 - decimaltotalBalanceBeforeAsset3WithModifiedBalance)
                        cy.task(TASK.SET_DIFF_ASSET_3, diffAsset3)
                      })
                    })
                  })
                })
                cy.task(TASK.GET_DIFF_ASSET_3).then(diffAsset3 => {
                  expect(diffAsset3, `${type} Balance diff for Asset ${fixture.asset3} after repo is beetwen 1.5 and -1.5`).to.be.within(0, 1.5)
                })
              } else {
                decimaltotalBalanceBeforeAsset3WithModifiedBalance = decimaltotalBalanceBeforeAsset3
                expect(decimaltotalBalanceAfterAsset3.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset3} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset3WithModifiedBalance.toFixed(decimal_places))
                expect(decimaltotalBalanceAfterAsset2.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset2} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset2WithModifiedBalance.toFixed(decimal_places))
              }
            })
          })
        })
      })
    })
  })

})

/**
 * Validate balance after repo revert (after 24hs) in BTC/USD tests
 * @param {String} type: Repo user type (Lender, Borrower, Fees)
 * @param {Json} fixture: Data used in test
 * @param {Number} decimals: Number of decimal places used when validating the user's balance
 * @param {Boolean} autoliquidation: Indicate if the repo is cancelled with self-liquidation 
 * @param {Boolean} useEth: Indicate if the repo autoliquidation need to use ETH to buy BTC 
 * @param {Object} userInfo: User whose balance is validated 
 * @param {Json} repoFile: Json file to save data (used in 24hs tests)
 */
Cypress.Commands.add('validateBalanceAfterRevertBtcUsd24hs', (fixture, decimals, userInfo, repoFile, balancesFile) => {

  cy.readFile(repoFile).then(($repoInfo) => {
    cy.log('############ REPO ID: ' + $repoInfo.repoId)
    cy.log('############ OPEN: ' + $repoInfo.openDt)
    cy.log('############ CLOSE: ' + $repoInfo.closeDt)
    cy.log('############ elapsedTime: ' + $repoInfo.elapsedTime)
    cy.log('############ price: ' + $repoInfo.price)

    /* Variables */
    let loan = fixture.amount * $repoInfo.price
    const YEARLY = 8760
    /* The first 60 minutes is one hour, the next 60 minutes is 2 hours, and so on */
    let entireHours = getEntireHours($repoInfo.elapsedTime)
    let modifiedBalance = loan * (1 / fixture.interest) * ((entireHours) / YEARLY)
    let url, user, decimal_places

    url = userInfo.url
    user = userInfo.user

    switch (decimals) {

      case 3:
        Decimal.config({ precision: 3 })
        decimal_places = 3
        break

      case 6:
        Decimal.config({ precision: 6 })
        decimal_places = 6
        break
    }

    cy.logMessage(`Get balances ${userInfo.type} after revert.`)
    cy.readFile(balancesFile).then(balancesUsers => {
      let keys = Object.keys(balancesUsers)

      for (const element of keys) {
        let userType = element;

        if (userType === userInfo.type) {
          cy.log("BALANCES From: " + userType)
          const btcBalance = Number(JSON.stringify(balancesUsers[userType].BTC))
          const usdBalance = Number(JSON.stringify(balancesUsers[userType].USD))

          cy.task(`get${userInfo.type}Bearer`).then(bearer => {

            cy.getTraderBalanceWithBearerOnlyAPI(url, fixture.custodian, user.USER, bearer).then(balancesAfterRevert => {

              const TOTAL_BALANCE_AFTER_REVERT = [balancesAfterRevert[fixture.asset1].total, balancesAfterRevert[fixture.asset2].total]

              cy.logMessage('TOTAL_BALANCE_AFTER_REVERT: ' + TOTAL_BALANCE_AFTER_REVERT)

              /* Get price from task to check balances */
              let decimaltotalBalanceAfterAsset1 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_1]).toNumber()
              let decimaltotalBalanceAfterAsset2 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_2]).toNumber()

              let decimaltotalBalanceBeforeAsset1 = btcBalance
              let decimaltotalBalanceBeforeAsset2 = usdBalance

              let decimaltotalBalanceBeforeAsset2WithModifiedBalance = 0

              if (userInfo.type == LENDER) {
                decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 + (modifiedBalance * NINETY_PERCENT))).toNumber()
              }
              else if (userInfo.type == BORROWER) {
                decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 - modifiedBalance)).toNumber()
              } else if (userInfo.type == FEES) {
                decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 + (modifiedBalance * TENTH_PERCENT))).toNumber()
              }

              expect(decimaltotalBalanceAfterAsset1.toFixed(decimal_places), `${userInfo.type} balance for Asset: ${fixture.asset1} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset1.toFixed(decimal_places))
              expect(decimaltotalBalanceAfterAsset2.toFixed(decimal_places), `${userInfo.type} balance for Asset: ${fixture.asset2} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset2WithModifiedBalance.toFixed(decimal_places))
            })
          })
        }
      }
    })
  })
})


/**
 * Validate balance after repo revert in USD/USD tests
 * @param {String} type: Repo user type (Lender, Borrower, Fees)
 * @param {Json} fixture: Data used in test
 * @param {Number} decimals: Number of decimal places used when validating the user's balance
 * @param {Boolean} autoliquidation: Indicate if the repo is cancelled with self-liquidation  
 * @param {Boolean} useEth: Indicate if the repo autoliquidation need to use ETH to buy BTC 
 * @param {Object} userInfo: User whose balance is validated 
 */
Cypress.Commands.add('validateBalanceAfterRevertUsdUsd', (type, fixture, decimals, autoliquidation, useEth, userInfo) => {

  cy.task(TASK.GET_ELAPSED_TIME).then($elapsedTime => {

    cy.task(TASK.GET_AUTOLIQUIDATION_PRICE).then($autoliquidationPrice => {

      cy.task(TASK.GET_PRICE).then($price => {
        /* Variables */
        let loan = fixture.amount
        const YEARLY = 8760
        /* The first 60 minutes is one hour, the next 60 minutes is 2 hours, and so on */
        let $elapsedTimeSplited = $elapsedTime.split(" ")
        let $elapsedTimeMinutes = $elapsedTimeSplited[0]
        let entireHours = Math.trunc($elapsedTimeMinutes.replace('m', '') / 60) + 1
        let modifiedBalance = loan * (1 / fixture.interest) * ((entireHours) / YEARLY)
        let url, user, decimal_places

        url = userInfo.url
        user = userInfo.user

        switch (decimals) {

          case 3:
            Decimal.config({ precision: 3 })
            decimal_places = 3
            break

          case 6:
            Decimal.config({ precision: 6 })
            decimal_places = 6
            break
        }

        cy.logMessage(`Get balances ${type} after revert.`)

        cy.task(`get${type}Bearer`).then(bearer => {

          cy.getTraderBalanceWithBearerOnlyAPI(url, fixture.custodian, user, bearer).then(balancesAfterRevert => {

            const TOTAL_BALANCE_AFTER_REVERT = [balancesAfterRevert[fixture.asset1].total, balancesAfterRevert[fixture.asset2].total, balancesAfterRevert[fixture.asset3].total, balancesAfterRevert[fixture.asset4].total]

            cy.logMessage('TOTAL_BALANCE_AFTER_REVERT: ' + TOTAL_BALANCE_AFTER_REVERT)

            /* Get price from task to check balances */
            cy.task(`getTotalBalance${type}Before`).then(totalBalanceBefore => {
              let decimaltotalBalanceAfterAsset1 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_1]).toNumber()
              let decimaltotalBalanceAfterAsset2 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_2]).toNumber()
              let decimaltotalBalanceAfterAsset3 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_3]).toNumber()
              let decimaltotalBalanceAfterAsset4 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_4]).toNumber()
              let decimaltotalBalanceBeforeAsset1 = new Decimal(totalBalanceBefore[INDEX_ASSET_1]).toNumber()
              let decimaltotalBalanceBeforeAsset2 = new Decimal(totalBalanceBefore[INDEX_ASSET_2]).toNumber()
              let decimaltotalBalanceBeforeAsset3 = new Decimal(totalBalanceBefore[INDEX_ASSET_3]).toNumber()
              let decimaltotalBalanceBeforeAsset4 = new Decimal(totalBalanceBefore[INDEX_ASSET_4]).toNumber()
              let decimaltotalBalanceBeforeAsset2WithModifiedBalance = 0
              let decimaltotalBalanceBeforeAsset3WithModifiedBalance = 0
              let decimaltotalBalanceBeforeAsset4WithModifiedBalance
              if (type == LENDER) {
                decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 + (modifiedBalance * NINETY_PERCENT))).toNumber()
                decimaltotalBalanceBeforeAsset3WithModifiedBalance = decimaltotalBalanceBeforeAsset3
                decimaltotalBalanceBeforeAsset4WithModifiedBalance = decimaltotalBalanceBeforeAsset4
              } else if (type == BORROWER) {
                /* If the repo is cancelled with self-liquidation then the borrower's balance is reduced by the self-liquidated USD */
                if (autoliquidation) {
                  if (fixture.symbol == SYMBOL.U15_RPO || fixture.symbol == SYMBOL.U15_RPOS) {
                    decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 - modifiedBalance - parseFloat($price.replace(',', '').replace('(', '').replace(')', '')))).toNumber()
                  }
                  else {
                    decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 - modifiedBalance - parseFloat($autoliquidationPrice.replace(',', '').replace('(', '').replace(')', '')))).toNumber()
                  }
                }
                else {
                  decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 - modifiedBalance)).toNumber()
                }
              } else if (type == FEES) {
                decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 + (modifiedBalance * TENTH_PERCENT))).toNumber()
              }
              expect(decimaltotalBalanceAfterAsset1.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset1} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset1.toFixed(decimal_places))
              expect(decimaltotalBalanceAfterAsset4.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset4} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset4.toFixed(decimal_places))
              /* If use the ETH to buy USD in autoliquidation we need to validate the ETH balance by approximation because we do not have the exactly ETH prices used to sell and buy */
              if (useEth && type == BORROWER) {
                cy.task(TASK.GET_ETH_PRICE).then(ethPrice => {
                  cy.task(TASK.GET_ETH_SELLING_PRICE).then(ethSellingPrice => {
                    decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2WithModifiedBalance + Number(ethSellingPrice.toFixed(6)))).toNumber()
                    expect(decimaltotalBalanceAfterAsset2.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset2} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset2WithModifiedBalance.toFixed(decimal_places))
                    cy.task(TASK.GET_BORROWER_USDC_BALANCE_AFTER_REPO_BEFORE_PAYMENT).then(usdBalanceAfterRepo => {
                      let missingUsd = fixture.amount - parseFloat(usdBalanceAfterRepo)
                      let ethToSell = missingUsd / parseFloat(ethPrice.replace('ETH: ', '').replace('$', '').replace(',', '').replace('(', '').replace(')', ''))
                      decimaltotalBalanceBeforeAsset3WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset3 - Number(ethToSell.toFixed(6)))).toNumber()
                      let diffAsset3 = Math.abs(decimaltotalBalanceAfterAsset3 - decimaltotalBalanceBeforeAsset3WithModifiedBalance)
                      cy.task(TASK.SET_DIFF_ASSET_3, diffAsset3)
                    })
                  })
                })

                cy.task(TASK.GET_DIFF_ASSET_3).then(diffAsset3 => {
                  expect(diffAsset3, `${type} Balance diff for Asset ${fixture.asset3} after repo is beetwen 0.9 and -0.9`).to.be.within(0, 0.9)
                })
              } else {
                decimaltotalBalanceBeforeAsset3WithModifiedBalance = decimaltotalBalanceBeforeAsset3
                expect(decimaltotalBalanceAfterAsset3.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset3} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset3WithModifiedBalance.toFixed(decimal_places))
                expect(decimaltotalBalanceAfterAsset2.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset2} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset2WithModifiedBalance.toFixed(decimal_places))
              }
            })
          })
        })
      })
    })
  })
})

/**
 * Validate balance after repo revert in USDC/USDC tests
 * @param {String} type: Repo user type (Lender, Borrower, Fees)
 * @param {Json} fixture: Data used in test
 * @param {Number} decimals: Number of decimal places used when validating the user's balance
 * @param {Boolean} autoliquidation: Indicate if the repo is cancelled with self-liquidation  
 * @param {Boolean} useEth: Indicate if the repo autoliquidation need to use ETH to buy BTC 
 * @param {Object} userInfo: User whose balance is validated 
 */
Cypress.Commands.add('validateBalanceAfterRevertUsdcUsdc', (type, fixture, decimals, autoliquidation, useEth, userInfo) => {

  cy.task(TASK.GET_ELAPSED_TIME).then($elapsedTime => {

    cy.task(TASK.GET_AUTOLIQUIDATION_PRICE).then($autoliquidationPrice => {

      cy.task(TASK.GET_PRICE).then($price => {

        /* Variables */
        let loan = fixture.amount
        const YEARLY = 8760
        /* The first 60 minutes is one hour, the next 60 minutes is 2 hours, and so on */
        let $elapsedTimeSplited = $elapsedTime.split(" ")
        let $elapsedTimeMinutes = $elapsedTimeSplited[0]
        let entireHours = Math.trunc($elapsedTimeMinutes.replace('m', '') / 60) + 1
        let modifiedBalance = loan * (1 / fixture.interest) * ((entireHours) / YEARLY)
        let url, user, decimal_places

        url = userInfo.url
        user = userInfo.user

        switch (decimals) {

          case 3:
            Decimal.config({ precision: 3 })
            decimal_places = 3
            break

          case 6:
            Decimal.config({ precision: 6 })
            decimal_places = 6
            break
        }

        cy.logMessage(`Get balances ${type} after revert.`)

        cy.task(`get${type}Bearer`).then(bearer => {

          cy.getTraderBalanceWithBearerOnlyAPI(url, fixture.custodian, user, bearer).then(balancesAfterRevert => {

            const TOTAL_BALANCE_AFTER_REVERT = [balancesAfterRevert[fixture.asset1].total, balancesAfterRevert[fixture.asset2].total, balancesAfterRevert[fixture.asset3].total, balancesAfterRevert[fixture.asset4].total]

            cy.logMessage('TOTAL_BALANCE_AFTER_REVERT: ' + TOTAL_BALANCE_AFTER_REVERT)

            /* Get price from task to check balances */
            cy.task(`getTotalBalance${type}Before`).then(totalBalanceBefore => {
              let decimaltotalBalanceAfterAsset1 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_1]).toNumber()
              let decimaltotalBalanceAfterAsset2 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_2]).toNumber()
              let decimaltotalBalanceAfterAsset3 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_3]).toNumber()
              let decimaltotalBalanceAfterAsset4 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_4]).toNumber()
              let decimaltotalBalanceBeforeAsset1 = new Decimal(totalBalanceBefore[INDEX_ASSET_1]).toNumber()
              let decimaltotalBalanceBeforeAsset2 = new Decimal(totalBalanceBefore[INDEX_ASSET_2]).toNumber()
              let decimaltotalBalanceBeforeAsset3 = new Decimal(totalBalanceBefore[INDEX_ASSET_3]).toNumber()
              let decimaltotalBalanceBeforeAsset4 = new Decimal(totalBalanceBefore[INDEX_ASSET_4]).toNumber()
              let decimaltotalBalanceBeforeAsset3WithModifiedBalance = 0
              let decimaltotalBalanceBeforeAsset4WithModifiedBalance = 0
              if (type == LENDER) {
                decimaltotalBalanceBeforeAsset3WithModifiedBalance = decimaltotalBalanceBeforeAsset3
                decimaltotalBalanceBeforeAsset4WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset4 + (modifiedBalance * NINETY_PERCENT))).toNumber()
              } else if (type == BORROWER) {
                /* If the repo is cancelled with self-liquidation then the borrower's balance is reduced by the self-liquidated USD */
                if (autoliquidation) {
                  if (fixture.symbol == SYMBOL.U15_RPO || fixture.symbol == SYMBOL.U15_RPOS) {
                    decimaltotalBalanceBeforeAsset4WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset4 - modifiedBalance - parseFloat($price.replace(',', '').replace('(', '').replace(')', '')))).toNumber()
                  }
                  else {
                    decimaltotalBalanceBeforeAsset4WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset4 - modifiedBalance - parseFloat($autoliquidationPrice.replace(',', '').replace('(', '').replace(')', '')))).toNumber()
                  }
                }
                else {
                  decimaltotalBalanceBeforeAsset4WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset4 - modifiedBalance)).toNumber()
                }
              } else if (type == FEES) {
                decimaltotalBalanceBeforeAsset4WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset4 + (modifiedBalance * TENTH_PERCENT))).toNumber()
              }
              expect(decimaltotalBalanceAfterAsset1.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset1} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset1.toFixed(decimal_places))
              expect(decimaltotalBalanceAfterAsset2.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset2} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset2.toFixed(decimal_places))
              /* If use the ETH to buy USDC in autoliquidation we need to validate the ETH balance by approximation because we do not have the exactly ETH prices used to sell and buy */
              if (useEth && type == BORROWER) {
                cy.task(TASK.GET_ETH_PRICE).then(ethPrice => {
                  cy.task(TASK.GET_ETH_SELLING_PRICE).then(ethSellingPrice => {
                    decimaltotalBalanceBeforeAsset4WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset4WithModifiedBalance + Number(ethSellingPrice.toFixed(6)))).toNumber()
                    expect(decimaltotalBalanceAfterAsset4.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset4} after repo is equal to balance before repo with the applied formula`).to.equal(decimaltotalBalanceBeforeAsset4WithModifiedBalance.toFixed(decimal_places))
                    cy.task(TASK.GET_BORROWER_USDC_BALANCE_AFTER_REPO_BEFORE_PAYMENT).then(usdBalanceAfterRepo => {
                      let missingUsd = fixture.amount - parseFloat(usdBalanceAfterRepo)
                      let ethToSell = missingUsd / parseFloat(ethPrice.replace('ETH: ', '').replace('$', '').replace(',', '').replace('(', '').replace(')', ''))
                      decimaltotalBalanceBeforeAsset3WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset3 - Number(ethToSell.toFixed(6)))).toNumber()
                      let diffAsset3 = Math.abs(decimaltotalBalanceAfterAsset3 - decimaltotalBalanceBeforeAsset3WithModifiedBalance)
                      cy.task(TASK.SET_DIFF_ASSET_3, diffAsset3)
                    })
                  })
                })
                cy.task(TASK.GET_DIFF_ASSET_3).then(diffAsset3 => {
                  expect(diffAsset3, `${type} Balance diff for Asset ${fixture.asset3} after repo is beetwen 0.9 and -0.9`).to.be.within(0, 0.9)
                })
              } else {
                expect(decimaltotalBalanceAfterAsset3.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset3} after repo is equal to balance before repo`).to.equal(decimaltotalBalanceBeforeAsset3.toFixed(decimal_places))
                expect(decimaltotalBalanceAfterAsset4.toFixed(decimal_places), `${type} balance for Asset: ${fixture.asset4} after repo is equal to balance before repo with the applied formula`).to.equal(decimaltotalBalanceBeforeAsset4WithModifiedBalance.toFixed(decimal_places))
              }
            })
          })
        })
      })
    })
  })
})

/**
 * Make a Repo via API
 * @param {String} side: Side of operation. If is a sell or a buy
 * @param {Json} fixture: Data used in test
 * @param {String} url_tm: URL to make payment
 * @param {String} bearer: User bearer
 */
Cypress.Commands.add('makeRepoViaAPI', (side, fixture, url_tm, bearer) => {

  let clOrdId = `QA_Automation:${Date.now()}`

  cy.request({
    method: 'POST',
    url: url_tm + 'rest/lmorder',
    auth: {
      'bearer': bearer
    },
    body: {
      side: side,
      price: fixture.interest,
      custodianId: fixture.custodian,
      symbol: fixture.symbol,
      currency: fixture.asset1_repo,
      currency2: fixture.asset2_repo,
      tif: "GTC",
      orderQty: fixture.amount,
      dark: false,
      alias: "",
      message: "",
      traderId: "",
      clientDealCode: "",
      cntPartyTraderId: "",
      userId: "",
      parentClOrderId: "",
      clOrdId: clOrdId,
      orderId: "",
      orderType: "LIMIT",
      limitPx: 0,
      discretion: "",
      pegOffset: 0,
      tradeDate: "",
      valueDate: "",
      destination: "",
      isAvgPrice: false,
      leavesQty: 0,
      cumQty: 0,
      cumFee: "",
      avgPx: 0,
      ordStatus: "NEW",
      venue: "LIT",
      timestamp: `${Date.now()}`,
      tradeId: null,
      tradeQty: 0,
      fees: null,
      tradeMatchId: "",
      asset2Qty: 0,
      asset1Position: 0,
      asset2Position: 0,
      eventId: "bosonic-e2e-testing"
    },
  }).as('status')

  cy.get('@status').then(($status) => {
    cy.logMessage("Checking if the status is ok")
    expect($status.status).to.equal(BOSONIC_CONSTANTS.REQUEST_RESPONSE.OK)
  })

  cy.task('setClOrdId', clOrdId)
})

/**
 * Close a Repo via API
 * @param {String} id: Repo ID
 * @param {String} url_tm: URL to close Repo
 * @param {String} bearer: User bearer
 */
Cypress.Commands.add('closeRepoViaAPI', (borrowerInfo, isNegativeCase = false) => {

  let failOnStatusCodeDefault = true

  if (isNegativeCase) {
    failOnStatusCodeDefault = false
  }

  cy.loginAndDescription(borrowerInfo.url, borrowerInfo.user, 'Close Repo Order')

  /* Click on Repo Layout */
  mainPage.getRepoOptionMenu().click().wait(WAIT.LONG)

  /* Click in Repo Position Widget and Maximize */
  cy.contains(repoPositionsBorrowsWidget.getWidgetNameText()).click()
  repoPositionsBorrowsWidget.getMaximizeButton().click()

  /* Get Repo ID */
  repoPositionsBorrowsWidget.getFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().id, 0).then($id => {
    /* Close Repo via API */
    cy.task(TASK.GET_BORROWER_BEARER).then(bearer => {
      cy.request({
        method: 'GET',
        url: borrowerInfo.url + `rest/repocontract/close?repoContractId=${$id.text()}&eventId=bosonic-e2e-testing`,
        auth: {
          'bearer': bearer
        },
        failOnStatusCode: failOnStatusCodeDefault
      }).as('status')

      cy.get('@status').then(($status) => {
        if (isNegativeCase) {
          expect($status.status).to.equal(BOSONIC_CONSTANTS.REQUEST_RESPONSE.BAD_REQUEST)
        } else {
          expect($status.status).to.equal(BOSONIC_CONSTANTS.REQUEST_RESPONSE.OK)
        }
      })
    }).wait(WAIT.EXTRA_LOW)
  })

  /* Get and save in a task the system date to validate repo position widget after */
  cy.getTodaysDate(TODAY_PATTERN).then(today => {
    cy.task(TASK.SET_TODAY_DATE, today)
  })

  /* Refresh */
  cy.reload()
})

/**
 * Make payments whit a pivot user to rebalance before start test
 * @param {String} bearer: User bearer
 * @param {String} custodian: Custodian
 * @param {Map} paymentsMap: Map with each payment
 * @param {String} user: Payment destination user
 */
Cypress.Commands.add('rebalanceWithPayments', (bearer, custodian, paymentsMap, user) => {
  for (let [key, value] of paymentsMap) {
    cy.request({
      method: 'POST',
      url: URL.PUBLIC_API + 'rest/payment/send',
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
    })
  }
})

/**
 * Function to get balances from an user and save in tasks before and after operation.
 * @param {String} url: Url to access into trader module.
 * @param {String} user: User from whom we want to obtain balances.
 * @param {String} task: Cypress task where we "save" the balances.
 * @param {Object} fixture: Object with information about the payment that we make.
 */
Cypress.Commands.add('getBalancesAndSaveInTask', (url, user, task, fixture) => {
  let typeTask = (task.includes("Before") ? "Before" : "After")
  let typeUser = (task.includes('lender') ? 'Lender' : 'Borrower')

  cy.logMessage(`Get balances from ${typeUser} TM ${typeTask} operation.`)

  cy.getRequestToken(url, user).then(token => {
    cy.getTraderBalanceWithTokenOnlyAPI(url, fixture.custodian, user.USER, token).then(balances => {
      const TOTAL_BALANCE = [balances[fixture.asset1].total, balances[fixture.asset2].total, balances[fixture.asset3].total, balances[fixture.asset4].total]

      cy.logMessage(`User: ${user.USER}
        Balance ${typeTask} operation Asset ${fixture.asset1} = ${TOTAL_BALANCE[INDEX_ASSET_1]}
        Balance ${typeTask} operation Asset ${fixture.asset2} = ${TOTAL_BALANCE[INDEX_ASSET_2]}
        Balance ${typeTask} operation Asset ${fixture.asset3} = ${TOTAL_BALANCE[INDEX_ASSET_3]}
        Balance ${typeTask} operation Asset ${fixture.asset4} = ${TOTAL_BALANCE[INDEX_ASSET_4]}
      `)

      cy.task(task, TOTAL_BALANCE)
    })
  })
})

/**
 * Function to get balances from an user and save in tasks before and after operation.
 * @param {String} url: Url to access into trader module.
 * @param {String} user: User from whom we want to obtain balances.
 * @param {String} task: Cypress task where we "save" the balances.
 * @param {Object} fixture: Object with information about the payment that we make.
 */
Cypress.Commands.add('getBalancesAndSaveInJsonFile', (url, user, jsonFile, fixture, typeUser) => {

  cy.getRequestToken(url, user).then(token => {
    cy.getTraderBalanceWithTokenOnlyAPI(url, fixture.custodian, user.USER, token).then(balances => {
      const TOTAL_BALANCE = [balances[fixture.asset1].total, balances[fixture.asset2].total, balances[fixture.asset3].total, balances[fixture.asset4].total]

      cy.writeFile(jsonFile, `"${typeUser}": {`, FS_OPTIONS_PARAMETERS)
      cy.writeFile(jsonFile, `"${fixture.asset1}"` + ": " + TOTAL_BALANCE[INDEX_ASSET_1] + ",", FS_OPTIONS_PARAMETERS)
      cy.writeFile(jsonFile, `"${fixture.asset2}"` + ": " + TOTAL_BALANCE[INDEX_ASSET_2] + ",", FS_OPTIONS_PARAMETERS)
      cy.writeFile(jsonFile, `"${fixture.asset3}"` + ": " + TOTAL_BALANCE[INDEX_ASSET_3] + ",", FS_OPTIONS_PARAMETERS)
      cy.writeFile(jsonFile, `"${fixture.asset4}"` + ": " + TOTAL_BALANCE[INDEX_ASSET_4], FS_OPTIONS_PARAMETERS)
      cy.writeFile(jsonFile, "}", FS_OPTIONS_PARAMETERS)

    })
  })
})

/**
 * Validate Repo Position Widget (Lender and Borrower). Does not validate the trade blotter.
 * @param {Object} lenderInfo: Lender user to be used in test
 * @param {Object} borrowerInfo: Borrower user to be used in test
 * @param {Boolean} logged: Indicate if the user was logged previously
 * @param {Json} file: Json file to save data (used in 24hs tests) 
 */
Cypress.Commands.add('validateRepoPositionWidgetWithoutTradeBlotter', (lenderInfo, borrowerInfo, logged, file) => {

  logged = !!((logged == null || undefined))

  // if the module is not open previously, we login 
  if (!logged) {

    cy.loginAndDescription(borrowerInfo.url, borrowerInfo.user, 'Validate Repo Positions Borrow')

    /* Click on Repo Layout */
    mainPage.getRepoOptionMenu().click().wait(WAIT.LONG)

    /* Click in Repo Position Widget */
    cy.contains(repoPositionsBorrowsWidget.getWidgetNameText()).click()
    cy.xpath(repoPositionsBorrowsWidget.getMaximizeButton()).click()
  }

  /* Check status */
  repoPositionsBorrowsWidget.getFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().status, 0).then($status => {
    expect($status.text(), "Status is REPAID").to.equal(STATUS.REPAID)
  })

  if (file != null) {
    repoPositionsBorrowsWidget.getFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().closeTimestamp, 0).then($closeDt => {
      cy.readFile(file).then((repoInfo) => {
        repoInfo.closeDt = $closeDt.text().substring(0, $closeDt.text().indexOf(' '))
        cy.writeFile(file, JSON.stringify(repoInfo))
      })
    })

    repoPositionsBorrowsWidget.getFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().lentRefPrice, 0).then($price => {
      const REG_EXP = new RegExp(/[-]{0,1}[\d]*[.]{0,1}[\d]+/g)
      const textChanged = ($price.text()).replace(/,/g, "");
      let priceFormated = textChanged.match(REG_EXP);

      cy.readFile(file).then((repoInfo) => {
        repoInfo.price = priceFormated
        cy.writeFile(file, JSON.stringify(repoInfo))
      })
    })
  }

  /* Check if the Open D/T, Close D/T and Early Close D/T are completed and correct */
  cy.task(TASK.GET_TODAY_DATE).then(today => {
    repoPositionsBorrowsWidget.getFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().earlyCloseTimeStamp, 0).then($earlyCloseDt => {
      expect($earlyCloseDt.text().substring(0, $earlyCloseDt.text().indexOf(' ')), "Early Close D/T is completed and the date is today's date").to.equal(today)
    })
    repoPositionsBorrowsWidget.getFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().closeTimestamp, 0).then($closeDt => {
      expect($closeDt.text().substring(0, $closeDt.text().indexOf(' ')), "Close D/T is completed and the date is today's date").to.equal(today)
    })
    repoPositionsBorrowsWidget.getFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().openTimeStamp, 0).then($openDt => {
      expect($openDt.text().substring(0, $openDt.text().indexOf(' ')), "Open D/T is completed and the date is today's date").to.equal(today)
    })
  })

  /* Save elapsed time in a task to validate balances after revert */
  repoPositionsBorrowsWidget.getFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().elapsedTime, 0).then($elapsedTime => {

    if (file != null) {
      cy.readFile(file).then((repoInfo) => {
        repoInfo.elapsedTime = $elapsedTime.text()
        cy.writeFile(file, JSON.stringify(repoInfo))
      })
    } else {
      cy.task(TASK.SET_ELAPSED_TIME, $elapsedTime.text())
    }
  })

  cy.logout()

  cy.loginAndDescription(lenderInfo.url, lenderInfo.user)

  /* Click on Repo Layout */
  cy.contains(mainPage.getRepoOptionMenu()).click().wait(WAIT.LONG)

  /* Click in Repo Position Widget and Maximize */
  cy.contains(repoPositionsLendsWidget.getWidgetName()).click()
  repoPositionsLendsWidget.getMaximizeButton().click()

  /* Refresh */
  cy.reload()

  /* Check if the Open D/T, Close D/T and Early Close D/T are completed and correct */
  cy.task(TASK.GET_TODAY_DATE).then(today => {
    repoPositionsLendsWidget.getFieldByRow(repoPositionsLendsWidget.getClassIdsColumns().earlyCloseTimeStamp, 0).then($earlyCloseDt => {
      expect($earlyCloseDt.text().substring(0, $earlyCloseDt.text().indexOf(' ')), "Early Close D/T is completed and the date is today's date").to.equal(today)
    })
    repoPositionsLendsWidget.getFieldByRow(repoPositionsLendsWidget.getClassIdsColumns().closeTimeStamp, 0).then($closeDt => {
      expect($closeDt.text().substring(0, $closeDt.text().indexOf(' ')), "Close D/T is completed and the date is today's date").to.equal(today)
    })
    repoPositionsLendsWidget.getFieldByRow(repoPositionsLendsWidget.getClassIdsColumns().openTimeStamp, 0).then($openDt => {
      expect($openDt.text().substring(0, $openDt.text().indexOf(' ')), "Open D/T is completed and the date is today's date").to.equal(today)
    })
  })

  cy.logout()
})

/**
 * Validate Repo Position Widget (Lender and Borrower). Does not validate the trade blotter.
 * @param {Object} lenderInfo: Lender user to be used in test
 * @param {Object} borrowerInfo: Borrower user to be used in test
 * @param {Boolean} logged: Indicate if the user was logged previously
 * @param {Json} file: Json file to save data (used in 24hs tests) 
 */
Cypress.Commands.add('validateRepoPositionWidgetWithoutTradeBlotter24h', (lenderInfo, borrowerInfo, logged, file) => {

  logged = !!((logged == null || undefined))

  // if the module is not open previously, we login 
  if (!logged) {

    cy.loginAndDescription(borrowerInfo.url, borrowerInfo.user, 'Validate Repo Positions Borrow')

    /* Click on Repo Layout */
    cy.contains(mainPage.getRepoOptionMenu()).click().wait(WAIT.LONG)

    /* Click in Repo Position Widget */
    cy.contains(repoPositionsBorrowsWidget.getWidgetNameText()).click()
    repoPositionsBorrowsWidget.getMaximizeButton().click()
  }

  cy.wait(WAIT.MEDIUM)
  /* Check status */
  repoPositionsBorrowsWidget.getFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().status, 0).then($status => {
    expect($status.text(), "Status is REPAID").to.equal(STATUS.REPAID)
  })

  cy.readFile(file).then((repoInfo) => {
    cy.xpath(WIDGET.REPO_POSITION.BORROWER.FIRST_ROW.FIELDS.CLOSE_DT).then($closeDt => {
      repoInfo.closeDt = $closeDt.text().substring(0, $closeDt.text().indexOf(' '))
      cy.writeFile(file, repoInfo)
    })
  })

  cy.readFile(file).then((repoInfo) => {
    cy.xpath(WIDGET.REPO_POSITION.BORROWER.FIRST_ROW.FIELDS.BORROWER_PRICE).then($price => {
      const REG_EXP = new RegExp(/\d+\.?\d*/)
      const textChanged = ($price.text()).replace(/,/g, "");
      let priceFormated = textChanged.match(REG_EXP);

      repoInfo.price = Number(priceFormated[0])
      cy.writeFile(file, repoInfo)
    })
  })

  /* Check if the Open D/T, Close D/T and Early Close D/T are completed and correct */
  cy.getTodaysDate(TODAY_PATTERN).then(today => {

    cy.xpath(WIDGET.REPO_POSITION.BORROWER.FIRST_ROW.FIELDS.EARLY_CLOSE_DT).then($earlyCloseDt => {
      cy.xpath(WIDGET.REPO_POSITION.BORROWER.FIRST_ROW.FIELDS.CLOSE_DT).then($closeDt => {
        cy.xpath(WIDGET.REPO_POSITION.BORROWER.FIRST_ROW.FIELDS.OPEN_DT).then($openDt => {

          let hoursBetweenOpenAndClose = getHoursBetweenRepoContractDates($openDt.text(), $closeDt.text())
          let hoursBetweenOpenAndEarlyClose = getHoursBetweenRepoContractDates($openDt.text(), $earlyCloseDt.text())

          expect(hoursBetweenOpenAndClose, "There are more than 24hs between Open D/T and Close D/T fields").greaterThan(24)
          expect(hoursBetweenOpenAndEarlyClose, "There are more than 24hs between Open D/T and EarlyClose D/T fields").greaterThan(24)

        })
      })
    })
  })

  /* Save elapsed time in a task to validate balances after revert */
  cy.xpath(WIDGET.REPO_POSITION.BORROWER.FIRST_ROW.FIELDS.ELAPSED_TIME).then($elapsedTime => {
    cy.readFile(file).then((repoInfo) => {
      repoInfo.elapsedTime = $elapsedTime.text()
      cy.writeFile(file, JSON.stringify(repoInfo))
    })
  })

  cy.logout()

  cy.loginAndDescription(lenderInfo.url, lenderInfo.user)

  /* Click on Repo Layout */
  cy.contains(WIDGET.TRADER.REPO_BTN).click().wait(WAIT.LONG)

  /* Click in Repo Position Widget and Maximize */
  cy.contains(WIDGET.REPO_POSITION.NAME).click()
  cy.xpath(WIDGET.REPO_POSITION.MAXIMIZE).click()

  /* Refresh */
  cy.reload()

  /* Check if the Open D/T, Close D/T and Early Close D/T are completed and correct */
  cy.getTodaysDate(TODAY_PATTERN).then(today => {

    cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.OPEN_DT).then($openDt => {
      cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.EARLY_CLOSE_DT).then($earlyCloseDt => {
        cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.CLOSE_DT).then($closeDt => {

          let hoursBetweenOpenAndClose = getHoursBetweenRepoContractDates($openDt.text(), $closeDt.text())
          let hoursBetweenOpenAndEarlyClose = getHoursBetweenRepoContractDates($openDt.text(), $earlyCloseDt.text())

          expect(hoursBetweenOpenAndClose, "There are more than 24hs between Open D/T and Close D/T fields").greaterThan(24)
          expect(hoursBetweenOpenAndEarlyClose, "There are more than 24hs between Open D/T and EarlyClose D/T fields").greaterThan(24)
        })
      })
    })

  })

  cy.logout()
})

/**
 * Validate Repo Position Widget fields (Lender and Borrower)
 * @param {Json} fixture: Data used in test
 * @param {String} asset: Asset to validate in asset2 field 
 * @param {Object} lenderInfo: Lender user to validate widget after test logout from Borrower
 * @param {Object} defaultRepo: Indicate if the repo should be in 'default' state
 */
Cypress.Commands.add('validateRepoPositionWidget', (fixture, asset, lenderInfo, defaultRepo) => {

  /* Click on Repo Layout */
  cy.contains(WIDGET.TRADER.REPO_BTN).click().wait(WAIT.LONG)

  /* Click in Repo Position Widget and Maximize */
  cy.contains(WIDGET.REPO_POSITION.NAME).click()
  repoPositionsBorrowsWidget.getMaximizeButton().click()

  /* Check status */
  cy.dragAndDropXpath(repoPositionsBorrowsWidget.getHorizontalScrollBar(), 0, 0)
  cy.findColumnXpath(repoPositionsBorrowsWidget.getXpathStringFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().status, 0), repoPositionsBorrowsWidget.getHorizontalScrollBar()).then(() => {
    if (defaultRepo) {
      repoPositionsBorrowsWidget.getFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().status, 0).then($status => {
        expect($status.text(), "Status is DEFAULT").to.equal(STATUS.DEFAULT)
      })
    } else {
      repoPositionsBorrowsWidget.getFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().status, 0).then($status => {
        expect($status.text(), "Status is REPAID").to.equal(STATUS.REPAID)
      })
    }
  })

  /* Check if the Open D/T, Close D/T and Early Close D/T are completed and correct */

  cy.task(TASK.GET_TODAY_DATE).then(today => {

    cy.dragAndDropXpath(repoPositionsBorrowsWidget.getHorizontalScrollBar(), 0, 0)
    cy.findColumnXpath(repoPositionsBorrowsWidget.getXpathStringFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().earlyCloseTimeStamp, 0), repoPositionsBorrowsWidget.getHorizontalScrollBar()).then(() => {
      repoPositionsBorrowsWidget.getFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().earlyCloseTimeStamp, 0).then($earlyCloseDt => {
        expect($earlyCloseDt.text().substring(0, $earlyCloseDt.text().indexOf(' ')), "Early Close D/T is completed and the date is today's date").to.equal(today)
      })
    })

    cy.dragAndDropXpath(repoPositionsBorrowsWidget.getHorizontalScrollBar(), 0, 0)
    cy.findColumnXpath(repoPositionsBorrowsWidget.getXpathStringFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().closeTimestamp, 0), repoPositionsBorrowsWidget.getHorizontalScrollBar()).then(() => {
      repoPositionsBorrowsWidget.getFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().closeTimestamp, 0).then($closeDt => {
        expect($closeDt.text().substring(0, $closeDt.text().indexOf(' ')), "Close D/T is completed and the date is today's date").to.equal(today)
      })
    })

    cy.dragAndDropXpath(repoPositionsBorrowsWidget.getHorizontalScrollBar(), 0, 0)
    cy.findColumnXpath(repoPositionsBorrowsWidget.getXpathStringFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().openTimeStamp, 0), repoPositionsBorrowsWidget.getHorizontalScrollBar()).then(() => {
      repoPositionsBorrowsWidget.getFieldByRow(repoPositionsBorrowsWidget.getClassIdsColumns().openTimeStamp, 0).then($openDt => {
        expect($openDt.text().substring(0, $openDt.text().indexOf(' ')), "Open D/T is completed and the date is today's date").to.equal(today)
      })
    })
  })

  /* Save elapsed time in a task to validate balances after revert */
  cy.dragAndDropXpath(repoPositionsBorrowsWidget.getHorizontalScrollBar(), 0, 0)
  cy.findColumnXpath(repoPositionsBorrowsWidget.getXpathStringElapsedTimeFieldByRow(0), repoPositionsBorrowsWidget.getHorizontalScrollBar()).then(() => {
    repoPositionsBorrowsWidget.getElapsedTimeFieldByRow(0).then($elapsedTime => {
      cy.task(TASK.SET_ELAPSED_TIME, $elapsedTime.text())
    })
  })

  /* Minimize Repo Position Widget */
  repoPositionsBorrowsWidget.getMaximizeButton().click()

  /* Maximize Trade Blotter Widget */
  tradeBlotterWidget.getMaximizeButton().click().wait(WAIT.STANDARD)

  /* Select the maximum quantity of rows to show in widget */
  tradeBlotterWidget.getElementsQuantitySelect().click().wait(WAIT.STANDARD)
  tradeBlotterWidget.getElementsQuantitySelectOption(20).click({ force: true })

  /* Validate fields in Trade Blotter */
  cy.contains(tradeBlotterWidget.getWidgetNameText()).click().wait(WAIT.LOW_HIGH)

  /* If it is a 'default test' need to check if the asset pair information is in the first or in the second row because the order is random */
  let row_borrower = 0
  if (defaultRepo) {
    cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
    cy.findColumnXpath(tradeBlotterWidget.getXpathFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().currencyPair, 0), tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
      tradeBlotterWidget.getFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().currencyPair, 0).then($assetPair => {
        if ($assetPair.text() == fixture.symbol) {
          row_borrower = 1
        }
      })
    })
  }

  /* Validate Status */
  cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
  cy.findColumnXpath(tradeBlotterWidget.getXpathFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().status, 0), tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
    tradeBlotterWidget.getFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().status, 0).then($status => {
      expect($status.text(), 'Status is equal to PARTFILL-CONFIRMED').to.equal(STATUS.PARTFILL_CONFIRMED)
    })
  })

  /* Validate Asset Pair */
  cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
  if (row_borrower == 0) {
    cy.findColumnXpath(tradeBlotterWidget.getXpathFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().currencyPair, 0), tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
      tradeBlotterWidget.getFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().currencyPair, 0).then($assetPair => {
        expect($assetPair.text(), 'Check Asset Pair').to.equal(fixture.assetPair)
      })
    })
  }
  else {
    cy.findColumnXpath(tradeBlotterWidget.getXpathFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().currencyPair, 1), tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
      tradeBlotterWidget.getFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().currencyPair, 1).then($assetPair => {
        expect($assetPair.text(), 'Check Asset Pair').to.equal(fixture.assetPair)
      })
    })
  }

  /* Validate Side */
  cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
  cy.findColumnXpath(tradeBlotterWidget.getXpathFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().side, 0), tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
    tradeBlotterWidget.getFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().side, 0).then($side => {
      expect($side.text(), 'Check Side').to.equal(SIDE.SELL)
    })
  })

  /* Validate Asset1 */
  cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
  if (row_borrower == 0) {
    cy.findColumnXpath(tradeBlotterWidget.getXpathFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().asset1, 0), tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
      tradeBlotterWidget.getFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().asset1, 0).then($asset1 => {
        switch (fixture.symbol) {
          case SYMBOL.U15_RPO:
            expect($asset1.text(), 'Check Asset1').to.equal(ASSET.USD)
            break
          case SYMBOL.U15_RPOS:
            expect($asset1.text(), 'Check Asset1').to.equal(ASSET.USDC)
            break
          default:
            expect($asset1.text(), 'Check Asset1').to.equal(ASSET.BTC)
            break
        }
      })
    })
  } else {
    cy.findColumnXpath(tradeBlotterWidget.getXpathFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().asset1, 1), tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
      tradeBlotterWidget.getFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().asset1, 1).then($asset1 => {
        expect($asset1.text(), 'Check Asset1').to.equal(ASSET.USD)
      })
    })
  }

  /* Validate Asset2 */
  cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
  if (row_borrower == 0) {
    cy.findColumnXpath(tradeBlotterWidget.getXpathFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().asset2, 0), tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
      tradeBlotterWidget.getFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().asset2, 0).then($asset2 => {
        expect($asset2.text(), 'Check Asset2').to.equal(asset)
      })
    })
  } else {
    cy.findColumnXpath(tradeBlotterWidget.getXpathFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().asset2, 1), tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
      tradeBlotterWidget.getFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().asset2, 1).then($asset2 => {
        expect($asset2.text(), 'Check Asset2').to.equal(asset)
      })
    })
  }

  /* Save Price in a task to validate balances after revert */
  cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
  cy.findColumnXpath(tradeBlotterWidget.getXpathFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().total, 0), tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
    tradeBlotterWidget.getFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().total, 0).then($price => {
      cy.task(TASK.SET_PRICE, $price.text())
    })
  })

  /* Save Autoliquidation Price in a task to validate balances after revert */
  cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
  cy.findColumnXpath(tradeBlotterWidget.getXpathFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().avgRate, 0), tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
    tradeBlotterWidget.getFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().avgRate, 0).then($price => {
      cy.task(TASK.SET_AUTOLIQUIDATION_PRICE, $price.text())
    })
  })

  /* Save ETH selling Price in a task to validate balances after revert */
  /* Instead of getting the qty-2 field we need to get qty-1 and filled fields to calculate the qty-2 and not lose decimals */
  if (fixture.symbol == SYMBOL.U15_RPO) {
    cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
    cy.findColumnXpath(tradeBlotterWidget.getXpathFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().quantity, 2), tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
      tradeBlotterWidget.getFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().quantity, 2).then($quantity => {
        cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
        tradeBlotterWidget.getFieldSpanByRow(tradeBlotterWidget.getClassIdsColumns().avgRate, 2).then($avg_rate => {
          let calculatedPrice = parseFloat($quantity.text().replace(',', '').replace('(', '').replace(')', '')) * parseFloat($avg_rate.text().replace(',', '').replace('(', '').replace(')', ''))
          cy.task(TASK.SET_ETH_SELLING_PRICE, calculatedPrice)
        })
      })
    })
  } else {
    /* Init the ETH selling price acum */
    cy.task(TASK.SET_ETH_SELLING_PRICE, 0)
    /* Get rows quantity to iterate */
    cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.ROWS_QUANTITY).then(quantity => {
      let stopFlag = false
      for (let i = 0; i < quantity; i++) {
        cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
        cy.findColumnXpath(WIDGET.TRADER_TRADE_BLOTTER.COLUMNS_PARTS.QTY_1_FIRST_PART + i + WIDGET.TRADER_TRADE_BLOTTER.COLUMNS_PARTS.QTY_1_SECOND_PART, tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
          cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.COLUMNS_PARTS.QTY_1_FIRST_PART + i + WIDGET.TRADER_TRADE_BLOTTER.COLUMNS_PARTS.QTY_1_SECOND_PART).then($quantity => {
            cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
            cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.COLUMNS_PARTS.AVG_RATE_FIRST_PART + i + WIDGET.TRADER_TRADE_BLOTTER.COLUMNS_PARTS.AVG_RATE_SECOND_PART).then($avg_rate => {
              cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.COLUMNS_PARTS.SIDE_FIRST_PART + i + WIDGET.TRADER_TRADE_BLOTTER.COLUMNS_PARTS.SIDE_SECOND_PART).then($side => {
                cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.COLUMNS_PARTS.ASSET1_FIRST_PART + i + WIDGET.TRADER_TRADE_BLOTTER.COLUMNS_PARTS.ASSET1_SECOND_PART).then($asset1 => {
                  if ($asset1.text() == ASSET.B15 || $asset1.text() == ASSET.U15) {
                    stopFlag = true
                  }
                  if ($side.text() == SIDE.SELL && $asset1.text() == ASSET.ETH && !stopFlag) {
                    cy.task(TASK.GET_ETH_SELLING_PRICE).then($ethSellingPrice => {
                      let calculatedPrice = parseFloat($quantity.text().replace(',', '').replace('(', '').replace(')', '')) * parseFloat($avg_rate.text().replace(',', '').replace('(', '').replace(')', ''))
                      let acumEthSellingPrice = calculatedPrice + parseFloat($ethSellingPrice)
                      cy.task(TASK.SET_ETH_SELLING_PRICE, acumEthSellingPrice)
                    })
                  }
                })
              })
            })
          })
        })
      }
    })

    /* Minimize Trade Blotter Widget */
    cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.BTN_MAXIMIZE_WIDGET).click({ force: true })
  }

  cy.logout()

  cy.loginAndDescription(lenderInfo.url, lenderInfo.user, 'Validate fields in Trade Blotter')

  /* Click on Repo Layout */
  cy.contains(WIDGET.TRADER.REPO_BTN).click().wait(WAIT.LONG)

  /* Click in Repo Position Widget and Maximize */
  cy.contains(WIDGET.REPO_POSITION.NAME).click()
  cy.xpath(WIDGET.REPO_POSITION.MAXIMIZE).click()

  /* Refresh */
  cy.reload()

  /* Check if the Open D/T, Close D/T and Early Close D/T are completed and correct */
  cy.task(TASK.GET_TODAY_DATE).then(today => {
    cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.EARLY_CLOSE_DT).then($earlyCloseDt => {
      expect($earlyCloseDt.text().substring(0, $earlyCloseDt.text().indexOf(' ')), "Early Close D/T is completed and the date is today's date").to.equal(today)
    })
    cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.CLOSE_DT).then($closeDt => {
      expect($closeDt.text().substring(0, $closeDt.text().indexOf(' ')), "Close D/T is completed and the date is today's date").to.equal(today)
    })
    cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.OPEN_DT).then($openDt => {
      expect($openDt.text().substring(0, $openDt.text().indexOf(' ')), "Open D/T is completed and the date is today's date").to.equal(today)
    })
  })

  cy.xpath(WIDGET.REPO_POSITION.LENDER.BTN_MAXIMIZE_WIDGET).click().wait(WAIT.LOW)

  /* Get Lend Price and save on task to validate balances in Repo Default Test */
  cy.dragAndDropXpath(repoPositionsLendsWidget.getHorizontalScrollBar(), 0, 0)
  cy.findColumnXpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.LEND_PRICE, repoPositionsLendsWidget.getHorizontalScrollBar()).then(() => {
    cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.LEND_PRICE).then($lendPrice => {
      cy.task(TASK.SET_LEND_PRICE, $lendPrice.text().replace(',', ''))
    })
  })

  /* Get Repo Fees and save on task to validate balances in Repo Default Test */
  cy.dragAndDropXpath(repoPositionsLendsWidget.getHorizontalScrollBar(), 0, 0)
  cy.findColumnXpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.FEES, repoPositionsLendsWidget.getHorizontalScrollBar()).then(() => {
    cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.FEES).then($fees => {
      cy.task(TASK.SET_REPO_FEES, $fees.text().replace(',', ''))
    })
  })

  /* Get Interest Received and save on task to validate balances in Repo Default Test */
  cy.dragAndDropXpath(repoPositionsLendsWidget.getHorizontalScrollBar(), 0, 0)
  cy.findColumnXpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.INTEREST_RECEIVED, repoPositionsLendsWidget.getHorizontalScrollBar()).then(() => {
    cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.INTEREST_RECEIVED).then($interestReceived => {
      cy.task(TASK.SET_INTEREST_RECEIVED, $interestReceived.text().replace(',', ''))
    })
  })

  cy.xpath(WIDGET.REPO_POSITION.LENDER.BTN_MAXIMIZE_WIDGET).click().wait(WAIT.LOW)

  /* Validate fields in Trade Blotter */
  cy.contains(WIDGET.TRADER_TRADE_BLOTTER.NAME).click()

  /* If it is a 'default test' need to check if the asset pair information is in the first or in the second row because the order is random */
  let row_lender = 0
  if (defaultRepo) {
    cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
    cy.findColumnXpath(WIDGET.TRADER_TRADE_BLOTTER.FIRST_ROW_COLUMNS.ASSET_PAIR, tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
      cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.FIRST_ROW_COLUMNS.ASSET_PAIR).then($assetPair => {
        if ($assetPair.text() == fixture.symbol) {
          row_lender = 1
        }
      })
    })
  }

  /* Validate Status */
  cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
  cy.findColumnXpath(WIDGET.TRADER_TRADE_BLOTTER.FIRST_ROW_COLUMNS.STATUS, tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
    cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.FIRST_ROW_COLUMNS.STATUS).then($status => {
      expect($status.text(), 'Status is equal to PARTFILL-CONFIRMED').to.equal(STATUS.PARTFILL_CONFIRMED)
    })
  })

  /* Validate Asset Pair */
  cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
  if (row_lender == 0) {
    cy.findColumnXpath(WIDGET.TRADER_TRADE_BLOTTER.FIRST_ROW_COLUMNS.ASSET_PAIR, tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
      cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.FIRST_ROW_COLUMNS.ASSET_PAIR).then($assetPair => {
        expect($assetPair.text(), 'Check Asset Pair').to.equal(fixture.assetPair)
      })
    })
  }
  else {
    cy.findColumnXpath(WIDGET.TRADER_TRADE_BLOTTER.SECOND_ROW_COLUMNS.ASSET_PAIR, tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
      cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.SECOND_ROW_COLUMNS.ASSET_PAIR).then($assetPair => {
        expect($assetPair.text(), 'Check Asset Pair').to.equal(fixture.assetPair)
      })
    })
  }

  /* Validate Side */
  cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
  cy.findColumnXpath(WIDGET.TRADER_TRADE_BLOTTER.FIRST_ROW_COLUMNS.SIDE, tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
    cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.FIRST_ROW_COLUMNS.SIDE).then($side => {
      expect($side.text(), 'Check Side').to.equal(SIDE.BUY)
    })
  })

  /* Validate Asset1 */
  cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
  if (row_lender == 0) {
    cy.findColumnXpath(WIDGET.TRADER_TRADE_BLOTTER.FIRST_ROW_COLUMNS.ASSET1, tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
      cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.FIRST_ROW_COLUMNS.ASSET1).then($asset1 => {
        switch (fixture.symbol) {
          case SYMBOL.U15_RPO:
            expect($asset1.text(), 'Check Asset1').to.equal(ASSET.USD)
            break
          case SYMBOL.U15_RPOS:
            expect($asset1.text(), 'Check Asset1').to.equal(ASSET.USDC)
            break
          default:
            expect($asset1.text(), 'Check Asset1').to.equal(ASSET.BTC)
            break

        }
      })
    })
  } else {
    cy.findColumnXpath(WIDGET.TRADER_TRADE_BLOTTER.SECOND_ROW_COLUMNS.ASSET1, tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
      cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.SECOND_ROW_COLUMNS.ASSET1).then($asset1 => {
        expect($asset1.text(), 'Check Asset1').to.equal(ASSET.USD)
      })
    })
  }

  /* Validate Asset2 */
  cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
  if (row_lender == 0) {
    cy.findColumnXpath(WIDGET.TRADER_TRADE_BLOTTER.FIRST_ROW_COLUMNS.ASSET2, tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
      cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.FIRST_ROW_COLUMNS.ASSET2).then($asset2 => {
        expect($asset2.text(), 'Check Asset2').to.equal(asset)
      })
    })
  } else {
    cy.findColumnXpath(WIDGET.TRADER_TRADE_BLOTTER.SECOND_ROW_COLUMNS.ASSET2, tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
      cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.SECOND_ROW_COLUMNS.ASSET2).then($asset2 => {
        expect($asset2.text(), 'Check Asset2').to.equal(asset)
      })
    })
  }

  cy.logout()
})

/**
 * Make a Repo via UI
 * @param {Json} fixture: Data used in test
 * @param {Object} userInfo: User who will create the repo
 * @param {String} side: Side of the repo (Lender or Borrower)
 */
Cypress.Commands.add('makeRepoViaUI', (fixture, userInfo, side) => {

  /* Intercept when an Repo order is made */
  if (side == SIDE.BUY) {
    cy.intercept(BOSONIC_CONSTANTS.REQUEST_POST, INTERCEPTOR_REPO_BORROWER).as('repoTrade')
  } else {
    cy.intercept(BOSONIC_CONSTANTS.REQUEST_POST, INTERCEPTOR_REPO_LENDER).as('repoTrade')
  }

  /* Login with user and make a repo */
  cy.loginAndDescription(userInfo.url, userInfo.user, 'Open Repo Rates Panel and make Repo')
  cy.contains(WIDGET.TRADER.DESK_LABEL).should('be.visible')

  /* Click on Repo Layout */
  cy.contains(WIDGET.TRADER.REPO_BTN).click().wait(WAIT.LONG)

  /* If there are open orders, these are cancelled */
  cy.cancelAllOpenOrders().wait(WAIT.MEDIUM)
  cy.xpath(WIDGET.TRADER.WIDGETS.OPEN_ORDERS.CLOSE_WIDGET).click({ force: true })

  /* Add repo panel to create a repo */
  cy.get(WIDGET.REPO_RATES.ASSET_LIST).contains(fixture.symbol).parent({ force: true }).click().wait(WAIT.LOW)
  cy.get(WIDGET.REPO_PANEL.ASSET_TITLE).contains(fixture.symbol).scrollIntoView().should('be.visible')

  /* Create a repo */
  cy.xpath(`${WIDGET.REPO_PANEL.CONTAINER_XPATH} '${fixture.symbol}']]`).within(
    function () {
      if (side == SIDE.BUY)
        cy.contains(WIDGET.REPO_PANEL.BORROW_BTN).click().wait(WAIT.LOW)
      else {
        cy.contains(WIDGET.REPO_PANEL.LEND_BTN).click().wait(WAIT.LOW)
      }
      cy.get(WIDGET.REPO_PANEL.PRICE).first().clear()
      cy.get(WIDGET.REPO_PANEL.PRICE).first().type(fixture.interest)
      cy.get(WIDGET.REPO_PANEL.AMOUNT).first().clear()
      cy.get(WIDGET.REPO_PANEL.AMOUNT).type(fixture.amount)
      cy.contains(WIDGET.REPO_PANEL.SEND_BTN).click().wait(WAIT.LOW)
    }
  ).wait(WAIT.MEDIUM)

  /* Intercept when the open order widget is open and get response values */
  if (side == SIDE.BUY) {
    cy.intercept(BOSONIC_CONSTANTS.REQUEST_GET, INTERCEPTOR_OPEN_ORDER_BORROWER).as('openOrderValues')
  } else {
    cy.intercept(BOSONIC_CONSTANTS.REQUEST_GET, INTERCEPTOR_OPEN_ORDER_LENDER).as('openOrderValues')
  }

  /**
   * Close before and open widget again to "refresh" values from API
   */
  cy.addWidget(WIDGET.TRADER.WIDGETS.OPEN_ORDERS.NAME, 250, 500)
  cy.contains(WIDGET.TRADER.WIDGETS.OPEN_ORDERS.NAME).click()

  /* Wait to intercept the repo trade */
  cy.wait('@repoTrade').then(() => {

    /* Wait to intercept the open orders */
    cy.wait('@openOrderValues').then(interceptRepoOrders => {

      const TOTAL_ORDERS = interceptRepoOrders.response.body.total

      /*
       * If there's more than one order in the Open Order widget,
       * there may be stuck orders that could not be canceled
       * in the previous step.
       */

      expect(TOTAL_ORDERS, MESSAGE.NO_ORDER_STUCK).to.equal(ONE_ORDER)
    })
  })

  /* Click in Repo Position Widget */
  cy.contains(WIDGET.REPO_POSITION.NAME).click()

  /* Get the last Repo ID and saves it in a task to check  if after the repo is closed the ID increases */
  if (side == SIDE.BUY) {
    cy.xpath(WIDGET.REPO_POSITION.BORROWER.FIRST_ROW.FIELDS.ID).then($lastRepoId => {
      cy.task(TASK.SET_LAST_REPO_ID, $lastRepoId.text())
    })
  } else {
    cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.ID).then($lastRepoId => {
      cy.task(TASK.SET_LAST_REPO_ID, $lastRepoId.text())
    })
  }
})

/**
 * Match the repo order with lender and check balances (Lender and Borrower) in BTC/USDC tests
 * @param {Json} fixture: Data used in test
 * @param {Object} lenderInfo: Lender user to be used in test
 * @param {Object} borrowerInfo: Borrower user to be used in test
 */
Cypress.Commands.add('matchRepoOrderAndCheckBalancesBtcUsdc', (fixture, lenderInfo, borrowerInfo) => {

  /* Intercept when an Repo order is matched */
  cy.intercept(BOSONIC_CONSTANTS.REQUEST_POST, URL.MATCH_ORDER_URL).as('matchOrder')

  cy.loginAndDescription(lenderInfo.url, lenderInfo.user, 'Match order and get TradeMatch ID')

  /* Click on Repo Layout */
  cy.contains(WIDGET.TRADER.REPO_BTN).click().wait(WAIT.LONG)

  /* Close the window and then open it again to refresh the values of the response. */
  cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.CLOSE_WIDGET).click({ force: true })

  /* Match the repo order */
  cy.get(WIDGET.REPO_RATES.ASSET_LIST).contains(fixture.symbol).parent().click().wait(WAIT.LOW)
  cy.get(WIDGET.REPO_PANEL.ASSET_TITLE).contains(fixture.symbol).scrollIntoView().should('be.visible')
  cy.xpath(WIDGET.REPO_PANEL.CONTAINER_XPATH + `'${fixture.symbol}']]`).within(
    function () {
      cy.wait(WAIT.STANDARD)
      cy.xpath('(' + WIDGET.REPO_PANEL.MATCH_ASSET_ROW_TO_LEND + `${fixture.asset1_repo} (BTC) ')])[1]`).click().wait(WAIT.LOW)
      cy.contains(WIDGET.REPO_PANEL.SEND_BTN).click().wait(WAIT.LOW)
    })

  /* Intercept when the open order widget is open and get response values */
  cy.intercept(BOSONIC_CONSTANTS.REQUEST_GET, URL.QUERY_ALL_TRADEBLOTTER_TM).as('tradeBlotterValues')

  /* Wait to intercept the matching */
  cy.wait('@matchOrder').then(interceptMatchOrder => {

    const CL_ORD_ID_ORD_TAKER = interceptMatchOrder.response.body.clOrdId

    cy.addWidget(WIDGET.TRADER_TRADE_BLOTTER.NAME, 250, 500)
    cy.contains(WIDGET.TRADER_TRADE_BLOTTER.NAME).click()

    /* Wait to intercept the open orders */
    cy.wait('@tradeBlotterValues').then(interceptTradeBlotter => {

      if (interceptTradeBlotter.response.body.total >= MISC.STANDARD_PAGE_SIZE) {
        cy.task(TASK.SET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS, MISC.STANDARD_PAGE_SIZE)
      }
      else {
        cy.task(TASK.SET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS, interceptTradeBlotter.response.body.total)
      }

      for (let i = 0; i < interceptTradeBlotter.response.body.total; i++) {
        if (interceptTradeBlotter.response.body.data[i].clOrdId == CL_ORD_ID_ORD_TAKER) {
          cy.logMessage(`ORDER ID FROM LENDER: ${JSON.stringify(interceptTradeBlotter.response.body.data[i].orderId)}`)
          cy.task(TASK.SET_ORDERID_LENDER, `R_${interceptTradeBlotter.response.body.data[i].orderId}`)

          break
        }
      }
    })
  })

  /* Get the repo id to show in report */
  cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.ID).then($id => {
    addTestContext('Repo ID', $id.text())
  })

  cy.logMessage(`Get balances LENDER after operation.`)

  cy.task(TASK.GET_LENDER_BEARER).then(bearer => {

    cy.getTraderBalanceWithBearerOnlyAPI(lenderInfo.url, fixture.custodian, lenderInfo.user, bearer).then(lenderBalancesAfter => {
      const TOTAL_BALANCE_LENDER_AFTER = [lenderBalancesAfter[fixture.asset1].total, lenderBalancesAfter[fixture.asset2].total, lenderBalancesAfter[fixture.asset3].total, lenderBalancesAfter[fixture.asset4].total]

      cy.logMessage(`User: ${lenderInfo.user.USER}
                      Balance after operation Asset ${fixture.asset1} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_1]}
                      Balance after operation Asset ${fixture.asset2} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_2]}
                      Balance after operation Asset ${fixture.asset3} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_3]}
                      Balance after operation Asset ${fixture.asset4} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_4]}`)

      /* Get the QTY-2 field from Trade Blotter to check balance */
      cy.contains(WIDGET.TRADER_TRADE_BLOTTER.NAME).click()
      cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.BTN_MAXIMIZE_WIDGET).click().wait(WAIT.LOW)
      cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 2000, 2000)
      cy.task(TASK.GET_ORDERID_LENDER).then((orderIdLender) => {
        cy.task(TASK.GET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS).then(rows => {
          for (let rowBlotter = 0; rowBlotter < rows; rowBlotter++) {
            cy.xpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.ORDER_ID + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART).then($rowOrderId => {
              if ($rowOrderId.text() == orderIdLender) {
                /* Set the row where is the order id */
                cy.task(TASK.SET_ROW_BLOTTER_LENDER, rowBlotter)
              }
            })
          }
        })
        /* With the row where is the order id we get the QTY-2 field and check the balances */
        cy.task(TASK.GET_ROW_BLOTTER_LENDER).then(rowBlotter => {
          cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
          cy.findColumnXpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.TOTAL + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART, tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
            cy.xpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.TOTAL + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART).then(qty2 => {
              cy.task(TASK.SET_QTY2, qty2.text())
              cy.task(TASK.GET_BALANCE_LENDER_BEFORE).then(totalLenderBalanceBefore => {
                let decimaltotalBalanceLenderAfterAsset1 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceLenderAfterAsset2 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceLenderAfterAsset3 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceLenderAfterAsset4 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_4]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset1 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset2 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset3 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset4 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_4]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset1MinusAmount = new Decimal(decimaltotalBalanceLenderBeforeAsset1 - fixture.amount).toNumber()
                let decimalQty2 = new Decimal(parseFloat(qty2.text().replace(',', '')).toFixed(MISC.DECIMAL_PLACES))
                let decimaltotalBalanceLenderBeforeAsset4PlusQTY2FiftyPercent = new Decimal((decimaltotalBalanceLenderBeforeAsset4 + (decimalQty2.toNumber() * MISC.FIFTY_PERCENT))).toNumber()
                expect(decimaltotalBalanceLenderAfterAsset1.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset1} after the LM Trade is equal to balance before the trade minus the amount.`).to.equal(decimaltotalBalanceLenderBeforeAsset1MinusAmount.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset2.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceLenderBeforeAsset2.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset3.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset3} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceLenderBeforeAsset3.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset4.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset4} after the LM Trade is equal to balance before the trade plus the amount * price (50%).`).to.equal(decimaltotalBalanceLenderBeforeAsset4PlusQTY2FiftyPercent.toFixed(MISC.DECIMAL_PLACES))
              })
            })
          })
        })
      })
    })
  })

  cy.logMessage(`Get balances BORROWER after operation.`)

  cy.task(TASK.GET_BORROWER_BEARER).then(bearer => {
    cy.getTraderBalanceWithBearerOnlyAPI(borrowerInfo.url, fixture.custodian, borrowerInfo.user, bearer).then(borrowerBalancesAfter => {
      const TOTAL_BALANCE_BORROWER_AFTER = [borrowerBalancesAfter[fixture.asset1].total, borrowerBalancesAfter[fixture.asset2].total, borrowerBalancesAfter[fixture.asset3].total, borrowerBalancesAfter[fixture.asset4].total]

      /* We save the USD balance after matching and before payment to calculate the missing USD in case that the user need to sell ETH to buy BTC */
      cy.task(TASK.SET_BORROWER_USDC_BALANCE_AFTER_REPO_BEFORE_PAYMENT, borrowerBalancesAfter[fixture.asset4].total)

      cy.logMessage(`User: ${borrowerInfo.user.USER}
                      Balance after operation Asset ${fixture.asset1} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_1]}
                      Balance after operation Asset ${fixture.asset2} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_2]}
                      Balance after operation Asset ${fixture.asset3} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_3]}
                      Balance after operation Asset ${fixture.asset4} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_4]}`)

      cy.task(TASK.GET_BALANCE_BORROWER_BEFORE).then(totalBorrowerBalanceBefore => {
        cy.task(TASK.GET_QTY2).then(qty2 => {
          let decimaltotalBalanceBorrowerAfterAsset1 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_1]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset2 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_2]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset3 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_3]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset4 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_4]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset1 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_1]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset2 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_2]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset3 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_3]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset4 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_4]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset1PlusAmount = new Decimal(decimaltotalBalanceBorrowerBeforeAsset1 + fixture.amount).toNumber()
          let decimalQty2 = new Decimal(parseFloat(qty2.replace(',', '')).toFixed(MISC.DECIMAL_PLACES))
          let decimaltotalBalanceBorrowerBeforeAsset4MinusQTY2FiftyPercent = new Decimal((decimaltotalBalanceBorrowerBeforeAsset4 - (decimalQty2.toNumber() * MISC.FIFTY_PERCENT))).toNumber()
          expect(decimaltotalBalanceBorrowerAfterAsset1.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset1} after the LM Trade is equal to balance before the trade plus the amount.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset1PlusAmount.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset2.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset2.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset3.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset3} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset3.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset4.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset4} after the LM Trade is equal to balance before the trade minus the amount * price (50%).`).to.equal(decimaltotalBalanceBorrowerBeforeAsset4MinusQTY2FiftyPercent.toFixed(MISC.DECIMAL_PLACES))
        })
      })
    })
  })

  /* Save the BTC and ETH price to use in price validations */
  cy.xpath(WIDGET.TRADER.HEADER_RATES_CONTAINER.BTC_PRICE).then($btcPrice => {
    cy.xpath(WIDGET.TRADER.HEADER_RATES_CONTAINER.ETH_PRICE).then($ethPrice => {
      cy.task(TASK.SET_BTC_PRICE, $btcPrice.text())
      cy.task(TASK.SET_ETH_PRICE, $ethPrice.text())
    })
  })
})

/**
 * Match the repo order with lender and check balances (Lender and Borrower) in BTC/USD tests
 * @param {Json} fixture: Data used in test
 * @param {Object} lenderInfo: Lender user to be used in test
 * @param {Object} borrowerInfo: Borrower user to be used in test
 * @param {Json} jsonFile: Json file to save data (used in 24hs tests)
 */
Cypress.Commands.add('matchRepoOrderAndCheckBalancesBtcUsd', (fixture, lenderInfo, borrowerInfo, jsonFile) => {

  /* Intercept when an Repo order is matched */
  cy.intercept(BOSONIC_CONSTANTS.REQUEST_POST, URL.MATCH_ORDER_URL).as('matchOrder')

  cy.loginAndDescription(lenderInfo.url, lenderInfo.user, 'Match order and get TradeMatch ID')

  /* Click on Repo Layout */
  cy.contains(WIDGET.TRADER.REPO_BTN).click().wait(WAIT.LONG)

  /* Close the window and then open it again to refresh the values of the response. */
  cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.CLOSE_WIDGET).click({ force: true })

  /* Match the repo order */
  cy.get(WIDGET.REPO_RATES.ASSET_LIST).contains(fixture.symbol).parent().click().wait(WAIT.LOW)
  cy.get(WIDGET.REPO_PANEL.ASSET_TITLE).contains(fixture.symbol).scrollIntoView().should('be.visible')
  cy.xpath(WIDGET.REPO_PANEL.CONTAINER_XPATH + `'${fixture.symbol}']]`).within(
    function () {
      cy.wait(WAIT.STANDARD)
      cy.xpath('(' + WIDGET.REPO_PANEL.MATCH_ASSET_ROW_TO_LEND + `${fixture.asset1_repo} (BTC) ')])[1]`).click().wait(WAIT.LOW)
      cy.contains(WIDGET.REPO_PANEL.SEND_BTN).click().wait(WAIT.LOW)
    })

  /* Intercept when the open order widget is open and get response values */
  cy.intercept(BOSONIC_CONSTANTS.REQUEST_GET, URL.QUERY_ALL_TRADEBLOTTER_TM).as('tradeBlotterValues')

  /* Wait to intercept the matching */
  cy.wait('@matchOrder').then(interceptMatchOrder => {

    const CL_ORD_ID_ORD_TAKER = interceptMatchOrder.response.body.clOrdId

    cy.addWidget(WIDGET.TRADER_TRADE_BLOTTER.NAME, 250, 500)
    cy.contains(WIDGET.TRADER_TRADE_BLOTTER.NAME).click()

    /* Wait to intercept the open orders */
    cy.wait('@tradeBlotterValues').then(interceptTradeBlotter => {

      if (interceptTradeBlotter.response.body.total >= MISC.STANDARD_PAGE_SIZE) {
        cy.task(TASK.SET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS, MISC.STANDARD_PAGE_SIZE)
      } else {
        cy.task(TASK.SET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS, interceptTradeBlotter.response.body.total)
      }

      for (let i = 0; i < interceptTradeBlotter.response.body.total; i++) {
        if (interceptTradeBlotter.response.body.data[i].clOrdId == CL_ORD_ID_ORD_TAKER) {
          cy.logMessage(`ORDER ID FROM LENDER: ${JSON.stringify(interceptTradeBlotter.response.body.data[i].orderId)}`)
          cy.task(TASK.SET_ORDERID_LENDER, `R_${interceptTradeBlotter.response.body.data[i].orderId}`)

          break
        }
      }
    })
  })

  /* Get the repo id to show in report */
  cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.ID).then($id => {
    addTestContext('Repo ID', $id.text())

    if (jsonFile != null) {
      cy.writeFile(jsonFile, { repoId: $id.text() })
    }
  })

  if (jsonFile != null) {
    cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.OPEN_DT).then($openDt => {
      cy.readFile(jsonFile).then((repoInfo) => {
        repoInfo.openDt = $openDt.text().substring(0, $openDt.text().indexOf(' '))
        cy.writeFile(jsonFile, JSON.stringify(repoInfo))
      })
    })
  }

  cy.logMessage(`Get balances LENDER after operation.`)

  cy.task(TASK.GET_LENDER_BEARER).then(bearer => {

    cy.getTraderBalanceWithBearerOnlyAPI(lenderInfo.url, fixture.custodian, lenderInfo.user, bearer).then(lenderBalancesAfter => {
      const TOTAL_BALANCE_LENDER_AFTER = [lenderBalancesAfter[fixture.asset1].total, lenderBalancesAfter[fixture.asset2].total, lenderBalancesAfter[fixture.asset3].total, lenderBalancesAfter[fixture.asset4].total]

      cy.logMessage(`User: ${lenderInfo.user.USER}  
                      Balance after operation Asset ${fixture.asset1} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_1]}
                      Balance after operation Asset ${fixture.asset2} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_2]}
                      Balance after operation Asset ${fixture.asset3} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_3]}
                      Balance after operation Asset ${fixture.asset4} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_4]}`)

      /* Get the QTY-2 field from Trade Blotter to check balance */
      cy.contains(WIDGET.TRADER_TRADE_BLOTTER.NAME).click()
      cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.BTN_MAXIMIZE_WIDGET).click().wait(WAIT.LOW)
      cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 2000, 2000)
      cy.task(TASK.GET_ORDERID_LENDER).then((orderIdLender) => {
        cy.task(TASK.GET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS).then(rows => {
          for (let rowBlotter = 0; rowBlotter < rows; rowBlotter++) {
            cy.xpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.ORDER_ID + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART).then($rowOrderId => {
              if ($rowOrderId.text() == orderIdLender) {
                /* Set the row where is the order id */
                cy.task(TASK.SET_ROW_BLOTTER_LENDER, rowBlotter)
              }
            })
          }
        })
        /* With the row where is the order id we get the QTY-2 field and check the balances */
        cy.task(TASK.GET_ROW_BLOTTER_LENDER).then(rowBlotter => {
          cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
          cy.findColumnXpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.TOTAL + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART, tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
            cy.xpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.TOTAL + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART).then(qty2 => {
              cy.task(TASK.SET_QTY2, qty2.text())
              cy.task(TASK.GET_BALANCE_LENDER_BEFORE).then(totalLenderBalanceBefore => {
                let decimaltotalBalanceLenderAfterAsset1 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceLenderAfterAsset2 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceLenderAfterAsset3 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceLenderAfterAsset4 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_4]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset1 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset2 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset3 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset4 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_4]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset1MinusAmount = new Decimal(decimaltotalBalanceLenderBeforeAsset1 - fixture.amount).toNumber()
                let decimalQty2 = new Decimal(parseFloat(qty2.text().replace(',', '')).toFixed(MISC.DECIMAL_PLACES))
                let decimaltotalBalanceLenderBeforeAsset2PlusQTY2FiftyPercent = new Decimal((decimaltotalBalanceLenderBeforeAsset2 + (decimalQty2.toNumber() * MISC.FIFTY_PERCENT))).toNumber()
                expect(decimaltotalBalanceLenderAfterAsset1.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset1} after the LM Trade is equal to balance before the trade minus the amount.`).to.equal(decimaltotalBalanceLenderBeforeAsset1MinusAmount.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset2.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceLenderBeforeAsset2PlusQTY2FiftyPercent.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset3.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset3} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceLenderBeforeAsset3.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset4.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset4} after the LM Trade is equal to balance before the trade plus the amount * price (50%).`).to.equal(decimaltotalBalanceLenderBeforeAsset4.toFixed(MISC.DECIMAL_PLACES))
              })
            })
          })
        })
      })
    })
  })

  cy.logMessage(`Get balances BORROWER after operation.`)

  cy.task(TASK.GET_BORROWER_BEARER).then(bearer => {
    cy.getTraderBalanceWithBearerOnlyAPI(borrowerInfo.url, fixture.custodian, borrowerInfo.user, bearer).then(borrowerBalancesAfter => {
      const TOTAL_BALANCE_BORROWER_AFTER = [borrowerBalancesAfter[fixture.asset1].total, borrowerBalancesAfter[fixture.asset2].total, borrowerBalancesAfter[fixture.asset3].total, borrowerBalancesAfter[fixture.asset4].total]

      /* We save the USD balance after matching and before payment to calculate the missing USD in case that the user need to sell ETH to buy BTC */
      cy.task(TASK.SET_BORROWER_USDC_BALANCE_AFTER_REPO_BEFORE_PAYMENT, borrowerBalancesAfter[fixture.asset4].total)

      cy.logMessage(`User: ${borrowerInfo.user.USER}  
                      Balance after operation Asset ${fixture.asset1} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_1]}
                      Balance after operation Asset ${fixture.asset2} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_2]}
                      Balance after operation Asset ${fixture.asset3} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_3]}
                      Balance after operation Asset ${fixture.asset4} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_4]}`)

      cy.task(TASK.GET_BALANCE_BORROWER_BEFORE).then(totalBorrowerBalanceBefore => {
        cy.task(TASK.GET_QTY2).then(qty2 => {
          let decimaltotalBalanceBorrowerAfterAsset1 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_1]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset2 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_2]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset3 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_3]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset4 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_4]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset1 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_1]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset2 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_2]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset3 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_3]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset4 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_4]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset1PlusAmount = new Decimal(decimaltotalBalanceBorrowerBeforeAsset1 + fixture.amount).toNumber()
          let decimalQty2 = new Decimal(parseFloat(qty2.replace(',', '')).toFixed(MISC.DECIMAL_PLACES))
          let decimaltotalBalanceBorrowerBeforeAsset2MinusQTY2FiftyPercent = new Decimal((decimaltotalBalanceBorrowerBeforeAsset2 - (decimalQty2.toNumber() * MISC.FIFTY_PERCENT))).toNumber()
          expect(decimaltotalBalanceBorrowerAfterAsset1.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset1} after the LM Trade is equal to balance before the trade plus the amount.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset1PlusAmount.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset2.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset2MinusQTY2FiftyPercent.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset3.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset3} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset3.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset4.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset4} after the LM Trade is equal to balance before the trade minus the amount * price (50%).`).to.equal(decimaltotalBalanceBorrowerBeforeAsset4.toFixed(MISC.DECIMAL_PLACES))
        })
      })
    })
  })

  /* Save the BTC and ETH price to use in price validations */
  cy.xpath(WIDGET.TRADER.HEADER_RATES_CONTAINER.BTC_PRICE).then($btcPrice => {
    cy.xpath(WIDGET.TRADER.HEADER_RATES_CONTAINER.ETH_PRICE).then($ethPrice => {
      cy.task(TASK.SET_BTC_PRICE, $btcPrice.text())
      cy.task(TASK.SET_ETH_PRICE, $ethPrice.text())
    })
  })
})

/**
 * Match the repo order with lender and check balances (Lender and Borrower) in USD/USD tests
 * @param {Json} fixture: Data used in test
 * @param {Object} lenderInfo: Lender user to be used in test
 * @param {Object} borrowerInfo: Borrower user to be used in test 
 */
Cypress.Commands.add('matchRepoOrderAndCheckBalancesUsdUsd', (fixture, lenderInfo, borrowerInfo) => {

  /* Intercept when an Repo order is matched */
  cy.intercept(BOSONIC_CONSTANTS.REQUEST_POST, URL.MATCH_ORDER_URL).as('matchOrder')

  cy.loginAndDescription(lenderInfo.url, lenderInfo.user, 'Match order and get TradeMatch ID')

  /* Click on Repo Layout */
  cy.contains(WIDGET.TRADER.REPO_BTN).click().wait(WAIT.LONG)

  /* Close the window and then open it again to refresh the values of the response. */
  cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.CLOSE_WIDGET).click({ force: true })

  /* Match the repo order */
  cy.get(WIDGET.REPO_RATES.ASSET_LIST).contains(fixture.symbol).parent().click().wait(WAIT.LOW)
  cy.get(WIDGET.REPO_PANEL.ASSET_TITLE).contains(fixture.symbol).scrollIntoView().should('be.visible')
  cy.xpath(WIDGET.REPO_PANEL.CONTAINER_XPATH + `'${fixture.symbol}']]`).within(
    function () {
      cy.wait(WAIT.STANDARD)
      cy.xpath('(' + WIDGET.REPO_PANEL.MATCH_ASSET_ROW_TO_LEND + `${fixture.asset1_repo} (USD) ')])[1]`).click().wait(WAIT.LOW)
      cy.contains(WIDGET.REPO_PANEL.SEND_BTN).click().wait(WAIT.LOW)
    })

  /* Intercept when the open order widget is open and get response values */
  cy.intercept(BOSONIC_CONSTANTS.REQUEST_GET, URL.QUERY_ALL_TRADEBLOTTER_TM).as('tradeBlotterValues')

  /* Wait to intercept the matching */
  cy.wait('@matchOrder').then(interceptMatchOrder => {

    const CL_ORD_ID_ORD_TAKER = interceptMatchOrder.response.body.clOrdId

    cy.addWidget(WIDGET.TRADER_TRADE_BLOTTER.NAME, 250, 500)
    cy.contains(WIDGET.TRADER_TRADE_BLOTTER.NAME).click()

    /* Wait to intercept the open orders */
    cy.wait('@tradeBlotterValues').then(interceptTradeBlotter => {

      if (interceptTradeBlotter.response.body.total >= MISC.STANDARD_PAGE_SIZE) {
        cy.task(TASK.SET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS, MISC.STANDARD_PAGE_SIZE)
      }
      else {
        cy.task(TASK.SET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS, interceptTradeBlotter.response.body.total)
      }

      for (let i = 0; i < interceptTradeBlotter.response.body.total; i++) {
        if (interceptTradeBlotter.response.body.data[i].clOrdId == CL_ORD_ID_ORD_TAKER) {
          cy.logMessage(`ORDER ID FROM LENDER: ${JSON.stringify(interceptTradeBlotter.response.body.data[i].orderId)}`)
          cy.task(TASK.SET_ORDERID_LENDER, `R_${interceptTradeBlotter.response.body.data[i].orderId}`)

          break
        }
      }
    })
  })

  /* Get the repo id to show in report */
  cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.ID).then($id => {
    addTestContext('Repo ID', $id.text())
  })

  cy.logMessage(`Get balances LENDER after operation.`)

  cy.task(TASK.GET_LENDER_BEARER).then(bearer => {

    cy.getTraderBalanceWithBearerOnlyAPI(lenderInfo.url, fixture.custodian, lenderInfo.user, bearer).then(lenderBalancesAfter => {
      const TOTAL_BALANCE_LENDER_AFTER = [lenderBalancesAfter[fixture.asset1].total, lenderBalancesAfter[fixture.asset2].total, lenderBalancesAfter[fixture.asset3].total, lenderBalancesAfter[fixture.asset4].total]

      cy.logMessage(`User: ${lenderInfo.user.USER}
                      Balance after operation Asset ${fixture.asset1} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_1]}
                      Balance after operation Asset ${fixture.asset2} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_2]}
                      Balance after operation Asset ${fixture.asset3} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_3]}
                      Balance after operation Asset ${fixture.asset4} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_4]}`)

      /* Get the QTY-2 field from Trade Blotter to check balance */
      cy.contains(WIDGET.TRADER_TRADE_BLOTTER.NAME).click()
      cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.BTN_MAXIMIZE_WIDGET).click().wait(WAIT.LOW)
      cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 2000, 2000)
      cy.task(TASK.GET_ORDERID_LENDER).then((orderIdLender) => {
        cy.task(TASK.GET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS).then(rows => {
          for (let rowBlotter = 0; rowBlotter < rows; rowBlotter++) {
            cy.xpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.ORDER_ID + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART).then($rowOrderId => {
              if ($rowOrderId.text() == orderIdLender) {
                /* Set the row where is the order id */
                cy.task(TASK.SET_ROW_BLOTTER_LENDER, rowBlotter)
              }
            })
          }
        })
        /* With the row where is the order id we get the QTY-2 field and check the balances */
        cy.task(TASK.GET_ROW_BLOTTER_LENDER).then(rowBlotter => {
          cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
          cy.findColumnXpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.TOTAL + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART, tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
            cy.xpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.TOTAL + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART).then(qty2 => {
              cy.task(TASK.SET_QTY2, qty2.text())
              cy.task(TASK.GET_BALANCE_LENDER_BEFORE).then(totalLenderBalanceBefore => {
                let decimaltotalBalanceLenderAfterAsset1 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceLenderAfterAsset2 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceLenderAfterAsset3 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceLenderAfterAsset4 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_4]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset1 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset2 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset3 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset4 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_4]).toNumber()
                let decimalQty2 = new Decimal(parseFloat(qty2.text().replace(',', '')).toFixed(MISC.DECIMAL_PLACES))
                let decimaltotalBalanceLenderBeforeAsset2PlusQTY2FiftyPercentMinusAmount = new Decimal((decimaltotalBalanceLenderBeforeAsset2 + (decimalQty2.toNumber() * MISC.FIFTY_PERCENT) - fixture.amount)).toNumber()
                expect(decimaltotalBalanceLenderAfterAsset1.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset1} after the LM Trade is equal to balance before the trade minus the amount.`).to.equal(decimaltotalBalanceLenderBeforeAsset1.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset2.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceLenderBeforeAsset2PlusQTY2FiftyPercentMinusAmount.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset3.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset3} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceLenderBeforeAsset3.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset4.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset4} after the LM Trade is equal to balance before the trade plus the amount * price (50%).`).to.equal(decimaltotalBalanceLenderBeforeAsset4.toFixed(MISC.DECIMAL_PLACES))
              })
            })
          })
        })
      })
    })
  })

  cy.logMessage(`Get balances BORROWER after operation.`)

  cy.task(TASK.GET_BORROWER_BEARER).then(bearer => {
    cy.getTraderBalanceWithBearerOnlyAPI(borrowerInfo.url, fixture.custodian, borrowerInfo.user, bearer).then(borrowerBalancesAfter => {
      const TOTAL_BALANCE_BORROWER_AFTER = [borrowerBalancesAfter[fixture.asset1].total, borrowerBalancesAfter[fixture.asset2].total, borrowerBalancesAfter[fixture.asset3].total, borrowerBalancesAfter[fixture.asset4].total]

      /* We save the USD balance after matching and before payment to calculate the missing USD in case that the user need to sell ETH to buy BTC */
      cy.task(TASK.SET_BORROWER_USDC_BALANCE_AFTER_REPO_BEFORE_PAYMENT, borrowerBalancesAfter[fixture.asset4].total)

      cy.logMessage(`User: ${borrowerInfo.user.USER}
                      Balance after operation Asset ${fixture.asset1} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_1]}
                      Balance after operation Asset ${fixture.asset2} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_2]}
                      Balance after operation Asset ${fixture.asset3} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_3]}
                      Balance after operation Asset ${fixture.asset4} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_4]}`)

      cy.task(TASK.GET_BALANCE_BORROWER_BEFORE).then(totalBorrowerBalanceBefore => {
        cy.task(TASK.GET_QTY2).then(qty2 => {
          let decimaltotalBalanceBorrowerAfterAsset1 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_1]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset2 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_2]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset3 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_3]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset4 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_4]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset1 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_1]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset2 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_2]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset3 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_3]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset4 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_4]).toNumber()
          let decimalQty2 = new Decimal(parseFloat(qty2.replace(',', '')).toFixed(MISC.DECIMAL_PLACES))
          let decimaltotalBalanceBorrowerBeforeAsset2MinusQTY2FiftyPercentPlusAmount = new Decimal((decimaltotalBalanceBorrowerBeforeAsset2 - (decimalQty2.toNumber() * MISC.FIFTY_PERCENT) + fixture.amount)).toNumber()
          expect(decimaltotalBalanceBorrowerAfterAsset1.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset1} after the LM Trade is equal to balance before the trade plus the amount.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset1.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset2.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset2MinusQTY2FiftyPercentPlusAmount.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset3.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset3} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset3.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset4.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset4} after the LM Trade is equal to balance before the trade minus the amount.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset4.toFixed(MISC.DECIMAL_PLACES))
        })
      })
    })
  })

  /* Save the BTC and ETH price to use in price validations */
  cy.xpath(WIDGET.TRADER.HEADER_RATES_CONTAINER.BTC_PRICE).then($btcPrice => {
    cy.xpath(WIDGET.TRADER.HEADER_RATES_CONTAINER.ETH_PRICE).then($ethPrice => {
      cy.task(TASK.SET_BTC_PRICE, $btcPrice.text())
      cy.task(TASK.SET_ETH_PRICE, $ethPrice.text())
    })
  })
})

/**
 * Match the repo order with lender and check balances (Lender and Borrower) in USDC/USDC tests
 * @param {Json} fixture: Data used in test
 * @param {Object} lenderInfo: Lender user to be used in test
 * @param {Object} borrowerInfo: Borrower user to be used in test 
 */
Cypress.Commands.add('matchRepoOrderAndCheckBalancesUsdcUsdc', (fixture, lenderInfo, borrowerInfo) => {

  /* Intercept when an Repo order is matched */
  cy.intercept(BOSONIC_CONSTANTS.REQUEST_POST, URL.MATCH_ORDER_URL).as('matchOrder')

  cy.loginAndDescription(lenderInfo.url, lenderInfo.user, 'Match order and get TradeMatch ID')

  /* Click on Repo Layout */
  cy.contains(WIDGET.TRADER.REPO_BTN).click().wait(WAIT.LONG)

  /* Close the window and then open it again to refresh the values of the response. */
  cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.CLOSE_WIDGET).click({ force: true })

  /* Match the repo order */
  cy.get(WIDGET.REPO_RATES.ASSET_LIST).contains(fixture.symbol).parent().click().wait(WAIT.LOW)
  cy.get(WIDGET.REPO_PANEL.ASSET_TITLE).contains(fixture.symbol).scrollIntoView().should('be.visible')
  cy.xpath(WIDGET.REPO_PANEL.CONTAINER_XPATH + `'${fixture.symbol}']]`).within(
    function () {
      cy.wait(WAIT.STANDARD)
      cy.xpath('(' + WIDGET.REPO_PANEL.MATCH_ASSET_ROW_TO_LEND + `${fixture.asset1_repo} (USD) ')])[1]`).click().wait(WAIT.LOW)
      cy.contains(WIDGET.REPO_PANEL.SEND_BTN).click().wait(WAIT.LOW)
    })

  /* Intercept when the open order widget is open and get response values */
  cy.intercept(BOSONIC_CONSTANTS.REQUEST_GET, URL.QUERY_ALL_TRADEBLOTTER_TM).as('tradeBlotterValues')

  /* Wait to intercept the matching */
  cy.wait('@matchOrder').then(interceptMatchOrder => {

    const CL_ORD_ID_ORD_TAKER = interceptMatchOrder.response.body.clOrdId

    cy.addWidget(WIDGET.TRADER_TRADE_BLOTTER.NAME, 250, 500)
    cy.contains(WIDGET.TRADER_TRADE_BLOTTER.NAME).click()

    /* Wait to intercept the open orders */
    cy.wait('@tradeBlotterValues').then(interceptTradeBlotter => {

      if (interceptTradeBlotter.response.body.total >= MISC.STANDARD_PAGE_SIZE) {
        cy.task(TASK.SET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS, MISC.STANDARD_PAGE_SIZE)
      }
      else {
        cy.task(TASK.SET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS, interceptTradeBlotter.response.body.total)
      }

      for (let i = 0; i < interceptTradeBlotter.response.body.total; i++) {
        if (interceptTradeBlotter.response.body.data[i].clOrdId == CL_ORD_ID_ORD_TAKER) {
          cy.logMessage(`ORDER ID FROM LENDER: ${JSON.stringify(interceptTradeBlotter.response.body.data[i].orderId)}`)
          cy.task(TASK.SET_ORDERID_LENDER, `R_${interceptTradeBlotter.response.body.data[i].orderId}`)

          break
        }
      }
    })
  })

  /* Get the repo id to show in report */
  cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.ID).then($id => {
    addTestContext('Repo ID', $id.text())
  })

  cy.logMessage(`Get balances LENDER after operation.`)

  cy.task(TASK.GET_LENDER_BEARER).then(bearer => {

    cy.getTraderBalanceWithBearerOnlyAPI(lenderInfo.url, fixture.custodian, lenderInfo.user, bearer).then(lenderBalancesAfter => {
      const TOTAL_BALANCE_LENDER_AFTER = [lenderBalancesAfter[fixture.asset1].total, lenderBalancesAfter[fixture.asset2].total, lenderBalancesAfter[fixture.asset3].total, lenderBalancesAfter[fixture.asset4].total]

      cy.logMessage(`User: ${lenderInfo.user.USER}
                      Balance after operation Asset ${fixture.asset1} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_1]}
                      Balance after operation Asset ${fixture.asset2} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_2]}
                      Balance after operation Asset ${fixture.asset3} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_3]}
                      Balance after operation Asset ${fixture.asset4} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_4]}`)

      /* Get the QTY-2 field from Trade Blotter to check balance */
      cy.contains(WIDGET.TRADER_TRADE_BLOTTER.NAME).click()
      cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.BTN_MAXIMIZE_WIDGET).click().wait(WAIT.LOW)
      cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 2000, 2000)
      cy.task(TASK.GET_ORDERID_LENDER).then((orderIdLender) => {
        cy.task(TASK.GET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS).then(rows => {
          for (let rowBlotter = 0; rowBlotter < rows; rowBlotter++) {
            cy.xpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.ORDER_ID + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART).then($rowOrderId => {
              if ($rowOrderId.text() == orderIdLender) {
                /* Set the row where is the order id */
                cy.task(TASK.SET_ROW_BLOTTER_LENDER, rowBlotter)
              }
            })
          }
        })
        /* With the row where is the order id we get the QTY-2 field and check the balances */
        cy.task(TASK.GET_ROW_BLOTTER_LENDER).then(rowBlotter => {
          cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
          cy.findColumnXpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.TOTAL + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART, tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
            cy.xpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.TOTAL + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART).then(qty2 => {
              cy.task(TASK.SET_QTY2, qty2.text())
              cy.task(TASK.GET_BALANCE_LENDER_BEFORE).then(totalLenderBalanceBefore => {
                let decimaltotalBalanceLenderAfterAsset1 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceLenderAfterAsset2 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceLenderAfterAsset3 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceLenderAfterAsset4 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_4]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset1 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset2 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset3 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset4 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_4]).toNumber()
                let decimalQty2 = new Decimal(parseFloat(qty2.text().replace(',', '')).toFixed(MISC.DECIMAL_PLACES))
                let decimaltotalBalanceLenderBeforeAsset4PlusQTY2FiftyPercentMinusAmount = new Decimal((decimaltotalBalanceLenderBeforeAsset4 + (decimalQty2.toNumber() * MISC.FIFTY_PERCENT) - fixture.amount)).toNumber()
                expect(decimaltotalBalanceLenderAfterAsset1.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset1} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceLenderBeforeAsset1.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset2.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceLenderBeforeAsset2.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset3.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset3} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceLenderBeforeAsset3.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset4.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset4} after the LM Trade is equal to balance before the trade plus the amount * price (50%) minus amount.`).to.equal(decimaltotalBalanceLenderBeforeAsset4PlusQTY2FiftyPercentMinusAmount.toFixed(MISC.DECIMAL_PLACES))
              })
            })
          })
        })
      })
    })
  })

  cy.logMessage(`Get balances BORROWER after operation.`)

  cy.task(TASK.GET_BORROWER_BEARER).then(bearer => {
    cy.getTraderBalanceWithBearerOnlyAPI(borrowerInfo.url, fixture.custodian, borrowerInfo.user, bearer).then(borrowerBalancesAfter => {
      const TOTAL_BALANCE_BORROWER_AFTER = [borrowerBalancesAfter[fixture.asset1].total, borrowerBalancesAfter[fixture.asset2].total, borrowerBalancesAfter[fixture.asset3].total, borrowerBalancesAfter[fixture.asset4].total]

      /* We save the USD balance after matching and before payment to calculate the missing USD in case that the user need to sell ETH to buy BTC */
      cy.task(TASK.SET_BORROWER_USDC_BALANCE_AFTER_REPO_BEFORE_PAYMENT, borrowerBalancesAfter[fixture.asset4].total)

      cy.logMessage(`User: ${borrowerInfo.user.USER}
                      Balance after operation Asset ${fixture.asset1} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_1]}
                      Balance after operation Asset ${fixture.asset2} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_2]}
                      Balance after operation Asset ${fixture.asset3} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_3]}
                      Balance after operation Asset ${fixture.asset4} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_4]}`)

      cy.task(TASK.GET_BALANCE_BORROWER_BEFORE).then(totalBorrowerBalanceBefore => {
        cy.task(TASK.GET_QTY2).then(qty2 => {
          let decimaltotalBalanceBorrowerAfterAsset1 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_1]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset2 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_2]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset3 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_3]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset4 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_4]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset1 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_1]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset2 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_2]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset3 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_3]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset4 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_4]).toNumber()
          let decimalQty2 = new Decimal(parseFloat(qty2.replace(',', '')).toFixed(MISC.DECIMAL_PLACES))
          let decimaltotalBalanceBorrowerBeforeAsset4MinusQTY2FiftyPercentPlusAmount = new Decimal((decimaltotalBalanceBorrowerBeforeAsset4 - (decimalQty2.toNumber() * MISC.FIFTY_PERCENT) + fixture.amount)).toNumber()
          expect(decimaltotalBalanceBorrowerAfterAsset1.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset1} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset1.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset2.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset2.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset3.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset3} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset3.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset4.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset4} after the LM Trade is equal to balance before minus the amount * price (50%) plus the amount.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset4MinusQTY2FiftyPercentPlusAmount.toFixed(MISC.DECIMAL_PLACES))
        })
      })
    })
  })

  /* Save the BTC and ETH price to use in price validations */
  cy.xpath(WIDGET.TRADER.HEADER_RATES_CONTAINER.BTC_PRICE).then($btcPrice => {
    cy.xpath(WIDGET.TRADER.HEADER_RATES_CONTAINER.ETH_PRICE).then($ethPrice => {
      cy.task(TASK.SET_BTC_PRICE, $btcPrice.text())
      cy.task(TASK.SET_ETH_PRICE, $ethPrice.text())
    })
  })
})

/**
 * Close repo via UI with close button
 * @param {String} method: Method to close the repo (Manual or Autorevert)
 * @param {Object} borrowerInfo: Borrower user to be used in test 
 */
Cypress.Commands.add('closeRepoViaUI', (method, borrowerInfo) => {

  cy.loginAndDescription(borrowerInfo.url, borrowerInfo.user, 'Close Repo Order')

  /* Click on Repo Layout */
  cy.contains(WIDGET.TRADER.REPO_BTN).click().wait(WAIT.LONG)

  /* Click in Repo Position Widget and Maximize */
  cy.contains(WIDGET.REPO_POSITION.NAME).click()
  cy.xpath(WIDGET.REPO_POSITION.MAXIMIZE).click()

  /* Close Repo */
  switch (method) {
    case CLOSE_REPO_METHOD.MANUAL:
      cy.xpath(WIDGET.REPO_POSITION.BORROWER.FIRST_ROW.CLOSE_REPO_BTN).click({ force: true })
      cy.xpath(WIDGET.REPO_POSITION.BORROWER.FIRST_ROW.CONFIRM_BTN).click({ force: true }).wait(WAIT.EXTRA_LOW)
      cy.wait(WAIT.EXTRA_LOW)
    case CLOSE_REPO_METHOD.AUTOREVERT:
      /* Wait autorevert */
      cy.wait(WAIT.EXTRA_LOW)
  }

  /* Get and save in a task the system date to validate repo position widget after */
  cy.getTodaysDate(TODAY_PATTERN).then(today => {
    cy.task(TASK.SET_TODAY_DATE, today)
  })

  /* Get the lastRepoId (before the new repo) and check if the ID increase after the new repo */
  cy.task(TASK.GET_LAST_REPO_ID).then(lastRepoID => {
    /* Get the new Repo ID and check if is greater than the last RepoID */
    cy.xpath(WIDGET.REPO_POSITION.BORROWER.FIRST_ROW.FIELDS.ID).then($newRepoId => {
      expect(Number($newRepoId.text())).to.be.greaterThan(Number(lastRepoID))
    })
  })

  /* Check status */
  cy.xpath(WIDGET.REPO_POSITION.BORROWER.FIRST_ROW.FIELDS.STATUS).then($status => {
    expect($status.text(), "Status is REPAID").to.equal(STATUS.REPAID)
  })

  /* Refresh */
  cy.reload()
})

/**
 * Create a Borrower Repo via API (BID)
 * @param {Json} fixture: Data used in test
 * @param {Object} borrowerInfo: Borrower user to be used in test 
 */
Cypress.Commands.add('createBorrowerBidRepoViaAPI', (fixture, borrowerInfo) => {

  /* Login Borrower user and make an LM Order */
  cy.loginAndDescription(borrowerInfo.url, borrowerInfo.user, 'Open Repo Rates Panel and make Repo BID')
  cy.contains(WIDGET.TRADER.DESK_LABEL).should('be.visible')

  /* Click on Repo Layout */
  mainPage.getRepoOptionMenu().click().wait(WAIT.LONG)

  /* If there are open orders, these are cancelled */
  cy.cancelAllOpenOrders().wait(WAIT.MEDIUM)
  openOrdersWidget.getCloseWidgetButton().click({ force: true })

  /* Create Repo via API */
  cy.task(TASK.GET_BORROWER_BEARER).then(bearer => {
    cy.makeRepoViaAPI(SIDE.BID, fixture, borrowerInfo.url, bearer)
  })

  /* Intercept when the open order widget is open and get response values */
  cy.intercept(BOSONIC_CONSTANTS.REQUEST_GET, URL.INTERCEPTOR_OPEN_ORDER_BORROWER).as('openOrderValues')

  /**
   * Close before and open widget again to "refresh" values from API
   */
  cy.addWidget(openOrdersWidget.getWidgetNameText(), 250, 500)
  cy.contains(openOrdersWidget.getWidgetNameText()).click()

  /* Wait to intercept the open orders */
  cy.wait('@openOrderValues').then(interceptRepoOrders => {

    cy.task('getClOrdId').then(() => {

      const TOTAL_ORDERS = interceptRepoOrders.response.body.total

      /*
       * If there's more than one order in the Open Order widget,
       * there may be stuck orders that could not be canceled
       * in the previous step.
       */

      expect(TOTAL_ORDERS, MESSAGE.NO_ORDER_STUCK).to.equal(ONE_ORDER)
    })
  })
})

/**
 * Create a lender sell repo via API and check balances (Lender and Borrower) in BTC/USDC tests
 * @param {Json} fixture: Data used in test
 * @param {Object} lenderInfo: Lender user to be used in test
 * @param {Object} borrowerInfo: Borrower user to be used in test
 */
Cypress.Commands.add('createLenderSellRepoViaAPIAndCheckBalancesBtcUsdc', (fixture, lenderInfo, borrowerInfo) => {

  cy.loginAndDescription(lenderInfo.url, lenderInfo.user)

  /* Click on Repo Layout */
  cy.contains(WIDGET.TRADER.REPO_BTN).click().wait(WAIT.LONG)

  /* Close the window and then open it again to refresh the values of the response. */
  cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.CLOSE_WIDGET).click({ force: true })

  /* Send a order via API to match */
  cy.task(TASK.GET_LENDER_BEARER).then(bearer => {
    cy.makeRepoViaAPI(SIDE.ASK, fixture, lenderInfo.url, bearer).wait(WAIT.HIGH)
  })

  /* Intercept when the open order widget is open and get response values */
  cy.intercept(BOSONIC_CONSTANTS.REQUEST_GET, URL.QUERY_ALL_TRADEBLOTTER_TM).as('tradeBlotterValues')

  /* Open Trade Blotter */
  cy.addWidget(WIDGET.TRADER_TRADE_BLOTTER.NAME, 250, 500)
  cy.contains(WIDGET.TRADER_TRADE_BLOTTER.NAME).click()

  /* Wait to intercept the open orders */
  cy.wait('@tradeBlotterValues').then(interceptTradeBlotter => {

    cy.task('getClOrdId').then(clOrdId => {

      if (interceptTradeBlotter.response.body.total >= MISC.STANDARD_PAGE_SIZE) {
        cy.task(TASK.SET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS, MISC.STANDARD_PAGE_SIZE)
      }
      else {
        cy.task(TASK.SET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS, interceptTradeBlotter.response.body.total)
      }

      for (let i = 0; i < interceptTradeBlotter.response.body.total; i++) {
        if (interceptTradeBlotter.response.body.data[i].clOrdId == clOrdId) {
          cy.logMessage(`ORDER ID FROM LENDER: ${JSON.stringify(interceptTradeBlotter.response.body.data[i].orderId)}`)
          cy.task(TASK.SET_ORDERID_LENDER, `R_${interceptTradeBlotter.response.body.data[i].orderId}`)

          break
        }
      }
    })
  })

  /* Get the repo id to show in report */
  cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.ID).then($id => {
    addTestContext('Repo ID', $id.text())
  })

  cy.logMessage(`Get balances LENDER after operation.`)

  cy.task(TASK.GET_LENDER_BEARER).then(bearer => {

    cy.getTraderBalanceWithBearerOnlyAPI(lenderInfo.url, fixture.custodian, lenderInfo.user, bearer).then(lenderBalancesAfter => {
      const TOTAL_BALANCE_LENDER_AFTER = [lenderBalancesAfter[fixture.asset1].total, lenderBalancesAfter[fixture.asset2].total, lenderBalancesAfter[fixture.asset3].total, lenderBalancesAfter[fixture.asset4].total]

      cy.logMessage(`User: ${lenderInfo.user.USER}
                      Balance after operation Asset ${fixture.asset1} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_1]}
                      Balance after operation Asset ${fixture.asset2} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_2]}
                      Balance after operation Asset ${fixture.asset3} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_3]}
                      Balance after operation Asset ${fixture.asset4} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_4]}`)

      /* Get the QTY-2 field from Trade Blotter to check balance */
      cy.reload()
      cy.contains(WIDGET.TRADER_TRADE_BLOTTER.NAME).click()
      cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.BTN_MAXIMIZE_WIDGET).click().wait(WAIT.LOW)
      cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 2000, 2000)
      cy.task(TASK.GET_ORDERID_LENDER).then((orderIdLender) => {
        cy.task(TASK.GET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS).then(rows => {
          for (let rowBlotter = 0; rowBlotter < rows; rowBlotter++) {
            cy.xpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.ORDER_ID + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART).then($rowOrderId => {
              if ($rowOrderId.text() == orderIdLender) {
                /* Set the row where is the order id */
                cy.task(TASK.SET_ROW_BLOTTER_LENDER, rowBlotter)
              }
            })
          }
        })
        /* With the row where is the order id we get the QTY-2 field and check the balances */
        cy.task(TASK.GET_ROW_BLOTTER_LENDER).then(rowBlotter => {
          cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
          cy.findColumnXpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.TOTAL + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART, tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
            cy.xpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.TOTAL + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART).then(qty2 => {
              cy.task(TASK.SET_QTY2, qty2.text())
              cy.task(TASK.GET_BALANCE_LENDER_BEFORE).then(totalLenderBalanceBefore => {
                let decimaltotalBalanceLenderAfterAsset1 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceLenderAfterAsset2 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceLenderAfterAsset3 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceLenderAfterAsset4 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_4]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset1 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset2 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset3 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset4 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_4]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset1MinusAmount = new Decimal(decimaltotalBalanceLenderBeforeAsset1 - fixture.amount).toNumber()
                let decimalQty2 = new Decimal(parseFloat(qty2.text().replace(',', '')).toFixed(MISC.DECIMAL_PLACES))
                let decimaltotalBalanceLenderBeforeAsset4PlusQTY2FiftyPercent = new Decimal((decimaltotalBalanceLenderBeforeAsset4 + (decimalQty2.toNumber() * MISC.FIFTY_PERCENT))).toNumber()
                expect(decimaltotalBalanceLenderAfterAsset1.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset1} after the LM Trade is equal to balance before the trade minus the amount.`).to.equal(decimaltotalBalanceLenderBeforeAsset1MinusAmount.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset2.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceLenderBeforeAsset2.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset3.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset3} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceLenderBeforeAsset3.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset4.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset4} after the LM Trade is equal to balance before the trade plus the amount * price (50%).`).to.equal(decimaltotalBalanceLenderBeforeAsset4PlusQTY2FiftyPercent.toFixed(MISC.DECIMAL_PLACES))
              })
            })
          })
        })
      })
    })
  })

  cy.logMessage(`Get balances BORROWER after operation.`)

  cy.task(TASK.GET_BORROWER_BEARER).then(bearer => {
    cy.getTraderBalanceWithBearerOnlyAPI(borrowerInfo.url, fixture.custodian, borrowerInfo.user, bearer).then(borrowerBalancesAfter => {
      const TOTAL_BALANCE_BORROWER_AFTER = [borrowerBalancesAfter[fixture.asset1].total, borrowerBalancesAfter[fixture.asset2].total, borrowerBalancesAfter[fixture.asset3].total, borrowerBalancesAfter[fixture.asset4].total]

      /* We save the USD balance after matching and before payment to calculate the missing USD in case that the user need to sell ETH to buy BTC */
      cy.task(TASK.SET_BORROWER_USDC_BALANCE_AFTER_REPO_BEFORE_PAYMENT, borrowerBalancesAfter[fixture.asset2].total)

      cy.logMessage(`User: ${borrowerInfo.user.USER}
                      Balance after operation Asset ${fixture.asset1} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_1]}
                      Balance after operation Asset ${fixture.asset2} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_2]}
                      Balance after operation Asset ${fixture.asset3} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_3]}
                      Balance after operation Asset ${fixture.asset4} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_4]}`)

      cy.task(TASK.GET_BALANCE_BORROWER_BEFORE).then(totalBorrowerBalanceBefore => {
        cy.task(TASK.GET_QTY2).then(qty2 => {
          let decimaltotalBalanceBorrowerAfterAsset1 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_1]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset2 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_2]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset3 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_3]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset4 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_4]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset1 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_1]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset2 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_2]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset3 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_3]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset4 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_4]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset1PlusAmount = new Decimal(decimaltotalBalanceBorrowerBeforeAsset1 + fixture.amount).toNumber()
          let decimalQty2 = new Decimal(parseFloat(qty2.replace(',', '')).toFixed(MISC.DECIMAL_PLACES))
          let decimaltotalBalanceBorrowerBeforeAsset4MinusQTY2FiftyPercent = new Decimal((decimaltotalBalanceBorrowerBeforeAsset4 - (decimalQty2.toNumber() * MISC.FIFTY_PERCENT))).toNumber()
          expect(decimaltotalBalanceBorrowerAfterAsset1.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset1} after the LM Trade is equal to balance before the trade minus the amount.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset1PlusAmount.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset2.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset2.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset3.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset3} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset3.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset4.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before the trade plus the amount * price  (50%).`).to.equal(decimaltotalBalanceBorrowerBeforeAsset4MinusQTY2FiftyPercent.toFixed(MISC.DECIMAL_PLACES))
        })
      })
    })
  })

  /* Save the BTC and ETH price to use in price validations */
  cy.xpath(WIDGET.TRADER.HEADER_RATES_CONTAINER.BTC_PRICE).then($btcPrice => {
    cy.xpath(WIDGET.TRADER.HEADER_RATES_CONTAINER.ETH_PRICE).then($ethPrice => {
      cy.task(TASK.SET_BTC_PRICE, $btcPrice.text())
      cy.task(TASK.SET_ETH_PRICE, $ethPrice.text())
    })
  })
})

/**
 * Create a lender sell repo via API and check balances (Lender and Borrower) in USD/USD tests
 * @param {Json} fixture: Data used in test
 * @param {Object} lenderInfo: Lender user to be used in test
 * @param {Object} borrowerInfo: Borrower user to be used in test
 */
Cypress.Commands.add('createLenderSellRepoViaAPIAndCheckBalancesUsdUsd', (fixture, lenderInfo, borrowerInfo) => {

  cy.loginAndDescription(lenderInfo.url, lenderInfo.user)

  /* Click on Repo Layout */
  cy.contains(WIDGET.TRADER.REPO_BTN).click().wait(WAIT.LONG)

  /* Close the window and then open it again to refresh the values of the response. */
  cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.CLOSE_WIDGET).click({ force: true })

  /* Send a order via API to match */
  cy.task(TASK.GET_LENDER_BEARER).then(bearer => {
    cy.makeRepoViaAPI(SIDE.ASK, fixture, lenderInfo.url, bearer).wait(WAIT.HIGH)
  })

  /* Intercept when the open order widget is open and get response values */
  cy.intercept(BOSONIC_CONSTANTS.REQUEST_GET, URL.QUERY_ALL_TRADEBLOTTER_TM).as('tradeBlotterValues')

  /* Open Trade Blotter */
  cy.addWidget(WIDGET.TRADER_TRADE_BLOTTER.NAME, 250, 500)
  cy.contains(WIDGET.TRADER_TRADE_BLOTTER.NAME).click()

  /* Wait to intercept the open orders */
  cy.wait('@tradeBlotterValues').then(interceptTradeBlotter => {

    cy.task('getClOrdId').then(clOrdId => {

      if (interceptTradeBlotter.response.body.total >= MISC.STANDARD_PAGE_SIZE) {
        cy.task(TASK.SET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS, MISC.STANDARD_PAGE_SIZE)
      }
      else {
        cy.task(TASK.SET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS, interceptTradeBlotter.response.body.total)
      }

      for (let i = 0; i < interceptTradeBlotter.response.body.total; i++) {
        if (interceptTradeBlotter.response.body.data[i].clOrdId == clOrdId) {
          cy.logMessage(`ORDER ID FROM LENDER: ${JSON.stringify(interceptTradeBlotter.response.body.data[i].orderId)}`)
          cy.task(TASK.SET_ORDERID_LENDER, `R_${interceptTradeBlotter.response.body.data[i].orderId}`)

          break
        }
      }
    })
  })

  /* Get the repo id to show in report */
  cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.ID).then($id => {
    addTestContext('Repo ID', $id.text())
  })

  cy.logMessage(`Get balances LENDER after operation.`)

  cy.task(TASK.GET_LENDER_BEARER).then(bearer => {

    cy.getTraderBalanceWithBearerOnlyAPI(lenderInfo.url, fixture.custodian, lenderInfo.user, bearer).then(lenderBalancesAfter => {
      const TOTAL_BALANCE_LENDER_AFTER = [lenderBalancesAfter[fixture.asset1].total, lenderBalancesAfter[fixture.asset2].total, lenderBalancesAfter[fixture.asset3].total, lenderBalancesAfter[fixture.asset4].total]

      cy.logMessage(`User: ${lenderInfo.user.USER}
                      Balance after operation Asset ${fixture.asset1} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_1]}
                      Balance after operation Asset ${fixture.asset2} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_2]}
                      Balance after operation Asset ${fixture.asset3} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_3]}
                      Balance after operation Asset ${fixture.asset4} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_4]}`)

      /* Get the QTY-2 field from Trade Blotter to check balance */
      cy.reload()
      cy.contains(WIDGET.TRADER_TRADE_BLOTTER.NAME).click()
      cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.BTN_MAXIMIZE_WIDGET).click().wait(WAIT.LOW)
      cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 2000, 2000)
      cy.task(TASK.GET_ORDERID_LENDER).then((orderIdLender) => {
        cy.task(TASK.GET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS).then(rows => {
          for (let rowBlotter = 0; rowBlotter < rows; rowBlotter++) {
            cy.xpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.ORDER_ID + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART).then($rowOrderId => {
              if ($rowOrderId.text() == orderIdLender) {
                /* Set the row where is the order id */
                cy.task(TASK.SET_ROW_BLOTTER_LENDER, rowBlotter)
              }
            })
          }
        })
        /* With the row where is the order id we get the QTY-2 field and check the balances */
        cy.task(TASK.GET_ROW_BLOTTER_LENDER).then(rowBlotter => {
          cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
          cy.findColumnXpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.TOTAL + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART, tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
            cy.xpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.TOTAL + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART).then(qty2 => {
              cy.task(TASK.SET_QTY2, qty2.text())
              cy.task(TASK.GET_BALANCE_LENDER_BEFORE).then(totalLenderBalanceBefore => {
                let decimaltotalBalanceLenderAfterAsset1 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceLenderAfterAsset2 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceLenderAfterAsset3 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceLenderAfterAsset4 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_4]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset1 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset2 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset3 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset4 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_4]).toNumber()
                let decimalQty2 = new Decimal(parseFloat(qty2.text().replace(',', '')).toFixed(MISC.DECIMAL_PLACES))
                let decimaltotalBalanceLenderBeforeAsset2PlusQTY2FiftyPercentMinusAmount = new Decimal((decimaltotalBalanceLenderBeforeAsset2 + (decimalQty2.toNumber() * MISC.FIFTY_PERCENT) - fixture.amount)).toNumber()
                expect(decimaltotalBalanceLenderAfterAsset1.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset1} after the LM Trade is equal to balance before the trade minus the amount.`).to.equal(decimaltotalBalanceLenderBeforeAsset1.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset2.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceLenderBeforeAsset2PlusQTY2FiftyPercentMinusAmount.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset3.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset3} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceLenderBeforeAsset3.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset4.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset4} after the LM Trade is equal to balance before the trade plus the amount * price (50%).`).to.equal(decimaltotalBalanceLenderBeforeAsset4.toFixed(MISC.DECIMAL_PLACES))
              })
            })
          })
        })
      })
    })
  })

  cy.logMessage(`Get balances BORROWER after operation.`)

  cy.task(TASK.GET_BORROWER_BEARER).then(bearer => {
    cy.getTraderBalanceWithBearerOnlyAPI(borrowerInfo.url, fixture.custodian, borrowerInfo.user, bearer).then(borrowerBalancesAfter => {
      const TOTAL_BALANCE_BORROWER_AFTER = [borrowerBalancesAfter[fixture.asset1].total, borrowerBalancesAfter[fixture.asset2].total, borrowerBalancesAfter[fixture.asset3].total, borrowerBalancesAfter[fixture.asset4].total]

      /* We save the USD balance after matching and before payment to calculate the missing USD in case that the user need to sell ETH to buy BTC */
      cy.task(TASK.SET_BORROWER_USDC_BALANCE_AFTER_REPO_BEFORE_PAYMENT, borrowerBalancesAfter[fixture.asset2].total)

      cy.logMessage(`User: ${borrowerInfo.user.USER}
                      Balance after operation Asset ${fixture.asset1} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_1]}
                      Balance after operation Asset ${fixture.asset2} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_2]}
                      Balance after operation Asset ${fixture.asset3} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_3]}
                      Balance after operation Asset ${fixture.asset4} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_4]}`)

      cy.task(TASK.GET_BALANCE_BORROWER_BEFORE).then(totalBorrowerBalanceBefore => {
        cy.task(TASK.GET_QTY2).then(qty2 => {
          let decimaltotalBalanceBorrowerAfterAsset1 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_1]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset2 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_2]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset3 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_3]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset4 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_4]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset1 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_1]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset2 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_2]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset3 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_3]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset4 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_4]).toNumber()
          let decimalQty2 = new Decimal(parseFloat(qty2.replace(',', '')).toFixed(MISC.DECIMAL_PLACES))
          let decimaltotalBalanceBorrowerBeforeAsset2MinusQTY2FiftyPercentPlusAmount = new Decimal((decimaltotalBalanceBorrowerBeforeAsset2 - (decimalQty2.toNumber() * MISC.FIFTY_PERCENT) + fixture.amount)).toNumber()
          expect(decimaltotalBalanceBorrowerAfterAsset1.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset1} after the LM Trade is equal to balance before the trade minus the amount.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset1.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset2.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset2MinusQTY2FiftyPercentPlusAmount.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset3.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset3} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset3.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset4.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before the trade plus the amount * price  (50%).`).to.equal(decimaltotalBalanceBorrowerBeforeAsset4.toFixed(MISC.DECIMAL_PLACES))
        })
      })
    })
  })

  /* Save the BTC and ETH price to use in price validations */
  cy.xpath(WIDGET.TRADER.HEADER_RATES_CONTAINER.BTC_PRICE).then($btcPrice => {
    cy.xpath(WIDGET.TRADER.HEADER_RATES_CONTAINER.ETH_PRICE).then($ethPrice => {
      cy.task(TASK.SET_BTC_PRICE, $btcPrice.text())
      cy.task(TASK.SET_ETH_PRICE, $ethPrice.text())
    })
  })
})

/**
 * Create a lender sell repo via API and check balances (Lender and Borrower) in USDC/USDC tests
 * @param {Json} fixture: Data used in test
 * @param {Object} lenderInfo: Lender user to be used in test
 * @param {Object} borrowerInfo: Borrower user to be used in test
 */
Cypress.Commands.add('createLenderSellRepoViaAPIAndCheckBalancesUsdcUsdc', (fixture, lenderInfo, borrowerInfo) => {

  cy.loginAndDescription(lenderInfo.url, lenderInfo.user)

  /* Click on Repo Layout */
  cy.contains(WIDGET.TRADER.REPO_BTN).click().wait(WAIT.LONG)

  /* Close the window and then open it again to refresh the values of the response. */
  cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.CLOSE_WIDGET).click({ force: true })

  /* Send a order via API to match */
  cy.task(TASK.GET_LENDER_BEARER).then(bearer => {
    cy.makeRepoViaAPI(SIDE.ASK, fixture, lenderInfo.url, bearer).wait(WAIT.HIGH)
  })

  /* Intercept when the open order widget is open and get response values */
  cy.intercept(BOSONIC_CONSTANTS.REQUEST_GET, URL.QUERY_ALL_TRADEBLOTTER_TM).as('tradeBlotterValues')

  /* Open Trade Blotter */
  cy.addWidget(WIDGET.TRADER_TRADE_BLOTTER.NAME, 250, 500)
  cy.contains(WIDGET.TRADER_TRADE_BLOTTER.NAME).click()

  /* Wait to intercept the open orders */
  cy.wait('@tradeBlotterValues').then(interceptTradeBlotter => {

    cy.task('getClOrdId').then(clOrdId => {

      if (interceptTradeBlotter.response.body.total >= MISC.STANDARD_PAGE_SIZE) {
        cy.task(TASK.SET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS, MISC.STANDARD_PAGE_SIZE)
      }
      else {
        cy.task(TASK.SET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS, interceptTradeBlotter.response.body.total)
      }

      for (let i = 0; i < interceptTradeBlotter.response.body.total; i++) {
        if (interceptTradeBlotter.response.body.data[i].clOrdId == clOrdId) {
          cy.logMessage(`ORDER ID FROM LENDER: ${JSON.stringify(interceptTradeBlotter.response.body.data[i].orderId)}`)
          cy.task(TASK.SET_ORDERID_LENDER, `R_${interceptTradeBlotter.response.body.data[i].orderId}`)

          break
        }
      }
    })
  })

  /* Get the repo id to show in report */
  cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.ID).then($id => {
    addTestContext('Repo ID', $id.text())
  })

  cy.logMessage(`Get balances LENDER after operation.`)

  cy.task(TASK.GET_LENDER_BEARER).then(bearer => {

    cy.getTraderBalanceWithBearerOnlyAPI(lenderInfo.url, fixture.custodian, lenderInfo.user, bearer).then(lenderBalancesAfter => {
      const TOTAL_BALANCE_LENDER_AFTER = [lenderBalancesAfter[fixture.asset1].total, lenderBalancesAfter[fixture.asset2].total, lenderBalancesAfter[fixture.asset3].total, lenderBalancesAfter[fixture.asset4].total]

      cy.logMessage(`User: ${lenderInfo.user.USER}
                      Balance after operation Asset ${fixture.asset1} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_1]}
                      Balance after operation Asset ${fixture.asset2} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_2]}
                      Balance after operation Asset ${fixture.asset3} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_3]}
                      Balance after operation Asset ${fixture.asset4} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_4]}`)

      /* Get the QTY-2 field from Trade Blotter to check balance */
      cy.reload()
      cy.contains(WIDGET.TRADER_TRADE_BLOTTER.NAME).click()
      cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.BTN_MAXIMIZE_WIDGET).click().wait(WAIT.LOW)
      cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 2000, 2000)
      cy.task(TASK.GET_ORDERID_LENDER).then((orderIdLender) => {
        cy.task(TASK.GET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS).then(rows => {
          for (let rowBlotter = 0; rowBlotter < rows; rowBlotter++) {
            cy.xpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.ORDER_ID + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART).then($rowOrderId => {
              if ($rowOrderId.text() == orderIdLender) {
                /* Set the row where is the order id */
                cy.task(TASK.SET_ROW_BLOTTER_LENDER, rowBlotter)
              }
            })
          }
        })
        /* With the row where is the order id we get the QTY-2 field and check the balances */
        cy.task(TASK.GET_ROW_BLOTTER_LENDER).then(rowBlotter => {
          cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
          cy.findColumnXpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.TOTAL + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART, tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
            cy.xpath(WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_FIRST_PART + rowBlotter + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_SECOND_PART + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.COLUMN.TOTAL + WIDGET.TRADER.WIDGETS.TRADE_BLOTTER.ROW_THIRD_PART).then(qty2 => {
              cy.task(TASK.SET_QTY2, qty2.text())
              cy.task(TASK.GET_BALANCE_LENDER_BEFORE).then(totalLenderBalanceBefore => {
                let decimaltotalBalanceLenderAfterAsset1 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceLenderAfterAsset2 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceLenderAfterAsset3 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceLenderAfterAsset4 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_4]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset1 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset2 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset3 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset4 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_4]).toNumber()
                let decimalQty2 = new Decimal(parseFloat(qty2.text().replace(',', '')).toFixed(MISC.DECIMAL_PLACES))
                let decimaltotalBalanceLenderBeforeAsset4PlusQTY2FiftyPercentMinusAmount = new Decimal((decimaltotalBalanceLenderBeforeAsset4 + (decimalQty2.toNumber() * MISC.FIFTY_PERCENT) - fixture.amount)).toNumber()
                expect(decimaltotalBalanceLenderAfterAsset1.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset1} after the LM Trade is equal to balance before the trade minus the amount.`).to.equal(decimaltotalBalanceLenderBeforeAsset1.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset2.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceLenderBeforeAsset2.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset3.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset3} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceLenderBeforeAsset3.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset4.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset4} after the LM Trade is equal to balance before the trade plus the amount * price (50%).`).to.equal(decimaltotalBalanceLenderBeforeAsset4PlusQTY2FiftyPercentMinusAmount.toFixed(MISC.DECIMAL_PLACES))
              })
            })
          })
        })
      })
    })
  })

  cy.logMessage(`Get balances BORROWER after operation.`)

  cy.task(TASK.GET_BORROWER_BEARER).then(bearer => {
    cy.getTraderBalanceWithBearerOnlyAPI(borrowerInfo.url, fixture.custodian, borrowerInfo.user, bearer).then(borrowerBalancesAfter => {
      const TOTAL_BALANCE_BORROWER_AFTER = [borrowerBalancesAfter[fixture.asset1].total, borrowerBalancesAfter[fixture.asset2].total, borrowerBalancesAfter[fixture.asset3].total, borrowerBalancesAfter[fixture.asset4].total]

      /* We save the USD balance after matching and before payment to calculate the missing USD in case that the user need to sell ETH to buy BTC */
      cy.task(TASK.SET_BORROWER_USDC_BALANCE_AFTER_REPO_BEFORE_PAYMENT, borrowerBalancesAfter[fixture.asset2].total)

      cy.logMessage(`User: ${borrowerInfo.user.USER}
                      Balance after operation Asset ${fixture.asset1} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_1]}
                      Balance after operation Asset ${fixture.asset2} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_2]}
                      Balance after operation Asset ${fixture.asset3} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_3]}
                      Balance after operation Asset ${fixture.asset4} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_4]}`)

      cy.task(TASK.GET_BALANCE_BORROWER_BEFORE).then(totalBorrowerBalanceBefore => {
        cy.task(TASK.GET_QTY2).then(qty2 => {
          let decimaltotalBalanceBorrowerAfterAsset1 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_1]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset2 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_2]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset3 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_3]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset4 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_4]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset1 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_1]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset2 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_2]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset3 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_3]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset4 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_4]).toNumber()
          let decimalQty2 = new Decimal(parseFloat(qty2.replace(',', '')).toFixed(MISC.DECIMAL_PLACES))
          let decimaltotalBalanceBorrowerBeforeAsset4MinusQTY2FiftyPercentPlusAmount = new Decimal((decimaltotalBalanceBorrowerBeforeAsset4 - (decimalQty2.toNumber() * MISC.FIFTY_PERCENT) + fixture.amount)).toNumber()
          expect(decimaltotalBalanceBorrowerAfterAsset1.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset1} after the LM Trade is equal to balance before the trade minus the amount.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset1.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset2.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset2.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset3.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset3} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset3.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset4.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset4} after the LM Trade is equal to balance before the trade plus the amount * price  (50%).`).to.equal(decimaltotalBalanceBorrowerBeforeAsset4MinusQTY2FiftyPercentPlusAmount.toFixed(MISC.DECIMAL_PLACES))
        })
      })
    })
  })

  /* Save the BTC and ETH price to use in price validations */
  cy.xpath(WIDGET.TRADER.HEADER_RATES_CONTAINER.BTC_PRICE).then($btcPrice => {
    cy.xpath(WIDGET.TRADER.HEADER_RATES_CONTAINER.ETH_PRICE).then($ethPrice => {
      cy.task(TASK.SET_BTC_PRICE, $btcPrice.text())
      cy.task(TASK.SET_ETH_PRICE, $ethPrice.text())
    })
  })
})

/**
 * Create a lender sell repo via API and check balances (Lender and Borrower) in BTC/USD tests
 * @param {Json} fixture: Data used in test
 * @param {Object} lenderInfo: Lender user to be used in test
 * @param {Object} borrowerInfo: Borrower user to be used in test
 */
Cypress.Commands.add('createLenderSellRepoViaAPIAndCheckBalancesBtcUsd', (fixture, lenderInfo, borrowerInfo) => {

  cy.loginAndDescription(lenderInfo.url, lenderInfo.user)

  /* Click on Repo Layout */
  mainPage.getRepoOptionMenu().click().wait(WAIT.LONG)

  /* Close the window and then open it again to refresh the values of the response. */
  tradeBlotterWidget.getCloseWidgetButton().click({ force: true })

  /* Send a order via API to match */
  cy.task(TASK.GET_LENDER_BEARER).then(bearer => {
    cy.makeRepoViaAPI(SIDE.ASK, fixture, lenderInfo.url, bearer).wait(WAIT.HIGH)
  })

  /* Intercept when the open order widget is open and get response values */
  cy.intercept(BOSONIC_CONSTANTS.REQUEST_GET, URL.QUERY_ALL_TRADEBLOTTER_TM).as('tradeBlotterValues')

  /* Open Trade Blotter */
  cy.addWidget(tradeBlotterWidget.getWidgetNameText(), 250, 500)
  cy.contains(tradeBlotterWidget.getWidgetNameText()).click()

  /* Wait to intercept the open orders */
  cy.wait('@tradeBlotterValues').then(interceptTradeBlotter => {

    cy.task('getClOrdId').then(clOrdId => {

      if (interceptTradeBlotter.response.body.total >= MISC.STANDARD_PAGE_SIZE) {
        cy.task(TASK.SET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS, MISC.STANDARD_PAGE_SIZE)
      }
      else {
        cy.task(TASK.SET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS, interceptTradeBlotter.response.body.total)
      }

      for (let i = 0; i < interceptTradeBlotter.response.body.total; i++) {
        if (interceptTradeBlotter.response.body.data[i].clOrdId == clOrdId) {
          cy.logMessage(`ORDER ID FROM LENDER: ${JSON.stringify(interceptTradeBlotter.response.body.data[i].orderId)}`)
          cy.task(TASK.SET_ORDERID_LENDER, `R_${interceptTradeBlotter.response.body.data[i].orderId}`)

          break
        }
      }
    })
  })

  /* Get the repo id to show in report */
  cy.dragAndDropXpath(repoPositionsLendsWidget.getHorizontalScrollBar(), 0, 0)
  cy.findColumnXpath(repoPositionsLendsWidget.getXpathStringFieldByRow(repoPositionsLendsWidget.getClassIdsColumns().id, 0), repoPositionsLendsWidget.getHorizontalScrollBar()).then(() => {
    repoPositionsLendsWidget.getFieldByRow(repoPositionsLendsWidget.getClassIdsColumns().id, 0).then($id => {
      addTestContext('Repo ID', $id.text())
    })
  })

  cy.logMessage(`Get balances LENDER after operation.`)

  cy.task(TASK.GET_LENDER_BEARER).then(bearer => {

    cy.getTraderBalanceWithBearerOnlyAPI(lenderInfo.url, fixture.custodian, lenderInfo.user, bearer).then(lenderBalancesAfter => {
      const TOTAL_BALANCE_LENDER_AFTER = [lenderBalancesAfter[fixture.asset1].total, lenderBalancesAfter[fixture.asset2].total, lenderBalancesAfter[fixture.asset3].total, lenderBalancesAfter[fixture.asset4].total]

      cy.logMessage(`User: ${lenderInfo.user.USER}
                      Balance after operation Asset ${fixture.asset1} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_1]}
                      Balance after operation Asset ${fixture.asset2} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_2]}
                      Balance after operation Asset ${fixture.asset3} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_3]}
                      Balance after operation Asset ${fixture.asset4} = ${TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_4]}`)

      /* Get the QTY-2 field from Trade Blotter to check balance */
      cy.reload()
      cy.contains(tradeBlotterWidget.getWidgetNameText()).click()
      tradeBlotterWidget.getMaximizeButton().click().wait(WAIT.LOW)
      cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 2000, 2000)
      cy.task(TASK.GET_ORDERID_LENDER).then((orderIdLender) => {
        cy.task(TASK.GET_TRADE_BLOTTER_LENDER_QUANTITY_ROWS).then(rows => {
          for (let rowBlotter = 0; rowBlotter < rows; rowBlotter++) {
            tradeBlotterWidget.getColumnFieldDivByRow(tradeBlotterWidget.getClassIdsColumns().id, rowBlotter).then($rowOrderId => {
              if ($rowOrderId.text() == orderIdLender) {
                /* Set the row where is the order id */
                cy.task(TASK.SET_ROW_BLOTTER_LENDER, rowBlotter)
              }
            })
          }
        })
        /* With the row where is the order id we get the QTY-2 field and check the balances */
        cy.task(TASK.GET_ROW_BLOTTER_LENDER).then(rowBlotter => {
          cy.dragAndDropXpath(tradeBlotterWidget.getHorizontalScrollBarInRepoLayout(), 0, 0)
          cy.findColumnXpath(tradeBlotterWidget.getXpathStringColumnFieldDivByRow(tradeBlotterWidget.getClassIdsColumns().total, rowBlotter), tradeBlotterWidget.getHorizontalScrollBarInRepoLayout()).then(() => {
            tradeBlotterWidget.getColumnFieldDivByRow(tradeBlotterWidget.getClassIdsColumns().total, rowBlotter).then(qty2 => {
              cy.task(TASK.SET_QTY2, qty2.text())
              cy.task(TASK.GET_BALANCE_LENDER_BEFORE).then(totalLenderBalanceBefore => {
                let decimaltotalBalanceLenderAfterAsset1 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceLenderAfterAsset2 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceLenderAfterAsset3 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceLenderAfterAsset4 = new Decimal(TOTAL_BALANCE_LENDER_AFTER[INDEX_ASSET_4]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset1 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_1]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset2 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_2]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset3 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_3]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset4 = new Decimal(totalLenderBalanceBefore[INDEX_ASSET_4]).toNumber()
                let decimaltotalBalanceLenderBeforeAsset1MinusAmount = new Decimal(decimaltotalBalanceLenderBeforeAsset1 - fixture.amount).toNumber()
                let decimalQty2 = new Decimal(parseFloat(qty2.text().replace(',', '')).toFixed(MISC.DECIMAL_PLACES))
                let decimaltotalBalanceLenderBeforeAsset2PlusQTY2FiftyPercent = new Decimal((decimaltotalBalanceLenderBeforeAsset2 + (decimalQty2.toNumber() * MISC.FIFTY_PERCENT))).toNumber()
                expect(decimaltotalBalanceLenderAfterAsset1.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset1} after the LM Trade is equal to balance before the trade minus the amount.`).to.equal(decimaltotalBalanceLenderBeforeAsset1MinusAmount.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset2.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceLenderBeforeAsset2PlusQTY2FiftyPercent.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset3.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset3} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceLenderBeforeAsset3.toFixed(MISC.DECIMAL_PLACES))
                expect(decimaltotalBalanceLenderAfterAsset4.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset4} after the LM Trade is equal to balance before the trade plus the amount * price (50%).`).to.equal(decimaltotalBalanceLenderBeforeAsset4.toFixed(MISC.DECIMAL_PLACES))
              })
            })
          })
        })
      })
    })
  })

  cy.logMessage(`Get balances BORROWER after operation.`)

  cy.task(TASK.GET_BORROWER_BEARER).then(bearer => {
    cy.getTraderBalanceWithBearerOnlyAPI(borrowerInfo.url, fixture.custodian, borrowerInfo.user, bearer).then(borrowerBalancesAfter => {
      const TOTAL_BALANCE_BORROWER_AFTER = [borrowerBalancesAfter[fixture.asset1].total, borrowerBalancesAfter[fixture.asset2].total, borrowerBalancesAfter[fixture.asset3].total, borrowerBalancesAfter[fixture.asset4].total]

      /* We save the USD balance after matching and before payment to calculate the missing USD in case that the user need to sell ETH to buy BTC */
      cy.task(TASK.SET_BORROWER_USDC_BALANCE_AFTER_REPO_BEFORE_PAYMENT, borrowerBalancesAfter[fixture.asset2].total)

      cy.logMessage(`User: ${borrowerInfo.user.USER}
                      Balance after operation Asset ${fixture.asset1} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_1]}
                      Balance after operation Asset ${fixture.asset2} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_2]}
                      Balance after operation Asset ${fixture.asset3} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_3]}
                      Balance after operation Asset ${fixture.asset4} = ${TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_4]}`)

      cy.task(TASK.GET_BALANCE_BORROWER_BEFORE).then(totalBorrowerBalanceBefore => {
        cy.task(TASK.GET_QTY2).then(qty2 => {
          let decimaltotalBalanceBorrowerAfterAsset1 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_1]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset2 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_2]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset3 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_3]).toNumber()
          let decimaltotalBalanceBorrowerAfterAsset4 = new Decimal(TOTAL_BALANCE_BORROWER_AFTER[INDEX_ASSET_4]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset1 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_1]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset2 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_2]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset3 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_3]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset4 = new Decimal(totalBorrowerBalanceBefore[INDEX_ASSET_4]).toNumber()
          let decimaltotalBalanceBorrowerBeforeAsset1PlusAmount = new Decimal(decimaltotalBalanceBorrowerBeforeAsset1 + fixture.amount).toNumber()
          let decimalQty2 = new Decimal(parseFloat(qty2.replace(',', '')).toFixed(MISC.DECIMAL_PLACES))
          let decimaltotalBalanceBorrowerBeforeAsset2MinusQTY2FiftyPercent = new Decimal((decimaltotalBalanceBorrowerBeforeAsset2 - (decimalQty2.toNumber() * MISC.FIFTY_PERCENT))).toNumber()
          expect(decimaltotalBalanceBorrowerAfterAsset1.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset1} after the LM Trade is equal to balance before the trade minus the amount.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset1PlusAmount.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset2.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset2MinusQTY2FiftyPercent.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset3.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset3} after the LM Trade is equal to balance before.`).to.equal(decimaltotalBalanceBorrowerBeforeAsset3.toFixed(MISC.DECIMAL_PLACES))
          expect(decimaltotalBalanceBorrowerAfterAsset4.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset2} after the LM Trade is equal to balance before the trade plus the amount * price  (50%).`).to.equal(decimaltotalBalanceBorrowerBeforeAsset4.toFixed(MISC.DECIMAL_PLACES))
        })
      })
    })
  })

  /* Save the BTC and ETH price to use in price validations */
  cy.xpath(WIDGET.TRADER.HEADER_RATES_CONTAINER.BTC_PRICE).then($btcPrice => {
    cy.xpath(WIDGET.TRADER.HEADER_RATES_CONTAINER.ETH_PRICE).then($ethPrice => {
      cy.task(TASK.SET_BTC_PRICE, $btcPrice.text())
      cy.task(TASK.SET_ETH_PRICE, $ethPrice.text())
    })
  })
})

/**
 * Make a payment and wait until autoloquidation is finished
 * @param {Json} fixture: Data used in test
 * @param {String} sentAsset: Asset sent in payment
 * @param {Object} borrowerInfo: Borrower user to be used in test
 * @param {Boolean} waitAutoliquidation: indicates if it should wait until autoliquidation is finished
 * @param {Number} percentage: indicates the percentage of BTC to pay (1 represents 100%)
 */
Cypress.Commands.add('makePaymentAndWaitAutoliquidation', (fixture, sentAsset, borrowerInfo, waitAutoliquidation, percentage) => {

  cy.logMessage('Making a Payment (API) from ' + borrowerInfo.user.USER + ' to ' + USER.USER_TM_TAKER.USER + ' for ' + fixture.amount + ' ' + fixture.asset1 + ' in ' + fixture.custodian)

  /* Make a Payment via API */
  cy.task(TASK.GET_BORROWER_BEARER).then(bearer => {

    cy.request({
      method: 'POST',
      url: URL.PUBLIC_API + 'rest/payment/send',
      auth: {
        'bearer': bearer
      },
      body: {
        eventId: BOSONIC_CONSTANTS.COMMON.BOSONIC_EVENT_ID,
        custodianId: fixture.custodian,
        asset: sentAsset,
        chainId: fixture.custodian + "-" + sentAsset,
        destinationMemberId: USER.USER_TM_TAKER.USER,
        amount: String(fixture.amount) * percentage
      },
    }).then(($status) => {
      cy.logMessage("Checking if the status is ok")
      expect($status.status).to.equal(BOSONIC_CONSTANTS.REQUEST_RESPONSE.OK)
    })

    /* Get and save in a task the system date to validate repo position widget after */
    cy.getTodaysDate(TODAY_PATTERN).then(today => {
      cy.task(TASK.SET_TODAY_DATE, today)
    })
  })

  /* Wait autoliquidation process */
  if (waitAutoliquidation) {
    cy.wait(WAIT.EXTRA_HIGH)
  }
})

/**
 * Get BTC Price
 */
Cypress.Commands.add('getBTCPrice', () => {
  cy.xpath(WIDGET.TRADER.HEADER_RATES_CONTAINER.BTC_PRICE).then(btcPrice => {
    return btcPrice.text().replace('BTC:', '').replace(',', '').replace('$', '')
  })
})

/** Function to add context information to test 
 * @param {String} title: Context title
 * @param {String} value: Context value
 */
function addTestContext(title, value) {
  cy.once('test:after:run', test => addContext({ test }, { title, value }));
}

/**
 * Validate balance after revert in default state (BTC/USD)
 * @param {String} type 
 * @param {Json} fixture
 * @param {Number} decimals
 * @param {Boolean} autoliquidation
 * @param {Number} autoliquidationPrice
 * @param {Boolean} useEth
 * @param {Number} ethSellingPrice
 */
Cypress.Commands.add('validateBalanceAfterRevertDefaultStateBtcUsd', (type, fixture, decimals, lendPrice, repoFees, interestReceived, userInfo, paymentPercentaje) => {

  /* Variables */
  let collateralAmount = lendPrice * MISC.FIFTY_PERCENT
  let enoughCollateral = collateralAmount - (paymentPercentaje * lendPrice)
  let modifiedBalanceLender
  let modifiedBalanceBorrower
  let modifiedBalanceFees = parseFloat(repoFees)

  if (enoughCollateral <= 0) {
    modifiedBalanceLender = collateralAmount
    modifiedBalanceBorrower = collateralAmount
  } else {
    modifiedBalanceLender = (paymentPercentaje * lendPrice) + parseFloat(repoFees) + parseFloat(interestReceived)
    modifiedBalanceBorrower = (collateralAmount - enoughCollateral)
  }

  let url, user, decimal_places
  let Decimal = require('decimal.js-light')

  url = userInfo.url
  user = userInfo.user

  switch (decimals) {

    case 3:
      Decimal.config({ precision: 3 })
      decimal_places = 3
      break

    case 6:
      Decimal.config({ precision: 6 })
      decimal_places = 6
      break
  }

  cy.logMessage(`Get balances ${type} after revert.`)

  cy.task(`get${type}Bearer`).then(bearer => {

    cy.getTraderBalanceWithBearerOnlyAPI(url, fixture.custodian, user, bearer).then(balancesAfterRevert => {

      const TOTAL_BALANCE_AFTER_REVERT = [balancesAfterRevert[fixture.asset1].total, balancesAfterRevert[fixture.asset2].total, balancesAfterRevert[fixture.asset3].total, balancesAfterRevert[fixture.asset4].total]

      cy.logMessage('TOTAL_BALANCE_AFTER_REVERT: ' + TOTAL_BALANCE_AFTER_REVERT)

      /* Get price from task to check balances */
      cy.task(`getTotalBalance${type}Before`).then(totalBalanceBefore => {

        let decimaltotalBalanceAfterAsset1 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_1]).toNumber()
        let decimaltotalBalanceAfterAsset2 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_2]).toNumber()
        let decimaltotalBalanceBeforeAsset1 = new Decimal(totalBalanceBefore[INDEX_ASSET_1]).toNumber()
        let decimaltotalBalanceBeforeAsset2 = new Decimal(totalBalanceBefore[INDEX_ASSET_2]).toNumber()
        let decimaltotalBalanceBeforeAsset1WithModifiedBalance
        let decimaltotalBalanceBeforeAsset2WithModifiedBalance

        if (type == LENDER) {
          decimaltotalBalanceBeforeAsset1WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset1 - paymentPercentaje)).toNumber()
          /* Validate BTC balance with aproximation */
          /* TODO: get the BTC purchased from Repo Default Widget. Also validate fields of the widget */
          let balanceDifferenceAsset1 = Math.abs(decimaltotalBalanceBeforeAsset1WithModifiedBalance - decimaltotalBalanceAfterAsset1)
          cy.task(TASK.SET_DIFF_ASSET_1, balanceDifferenceAsset1)
          decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 + modifiedBalanceLender)).toNumber()
          /* We need to validate the the balance by approximation because we have known differences */
          let balanceDifferenceAsset2 = Math.abs(decimaltotalBalanceBeforeAsset2WithModifiedBalance - decimaltotalBalanceAfterAsset2)
          cy.task(TASK.SET_DIFF_ASSET_2, balanceDifferenceAsset2)
        } else if (type == BORROWER) {
          decimaltotalBalanceBeforeAsset1WithModifiedBalance = decimaltotalBalanceBeforeAsset1
          decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 - modifiedBalanceBorrower)).toNumber()
          /* We need to validate the the balance by approximation because we have known differences */
          let balanceDifferenceAsset2 = Math.abs(decimaltotalBalanceBeforeAsset2WithModifiedBalance - decimaltotalBalanceAfterAsset2)
          cy.task(TASK.SET_DIFF_ASSET_2, balanceDifferenceAsset2)
        } else if (type == FEES) {
          decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 + (modifiedBalanceFees))).toNumber()
        }

        if (type == LENDER) {
          cy.task(TASK.GET_DIFF_ASSET_1).then($diffAsset1 => {
            expect($diffAsset1, `${type} Balance diff for Asset ${fixture.asset1} after repo is beetwen 0.09 and -0.09`).to.be.within(0, 0.09)
          })
        } else {
          expect(decimaltotalBalanceAfterAsset1.toFixed(MISC.DECIMAL_PLACES), `Balance for Asset: ${fixture.asset1} after the LM Trade is equal to balance before the trade with modified balance.`).to.equal(0)
        }

        cy.task(TASK.GET_DIFF_ASSET_2).then($diffAsset2 => {
          expect($diffAsset2, `${type} Balance diff for Asset ${fixture.asset2} after repo is beetwen 0.9 and -0.9`).to.be.within(0, 0.9)
        })
      })
    })
  })
})

/**
 * Validate balance after revert in default state (USD/USD)
 * @param {String} type 
 * @param {Json} fixture
 * @param {Number} decimals
 * @param {Boolean} autoliquidation
 * @param {Number} autoliquidationPrice
 * @param {Boolean} useEth
 * @param {Number} ethSellingPrice
 */
Cypress.Commands.add('validateBalanceAfterRevertDefaultStateUsdUsd', (type, fixture, decimals, repoFees, interestReceived, userInfo, paymentPercentaje) => {

  /* Variables */
  let modifiedBalanceLender = -parseFloat(repoFees) + parseFloat(interestReceived)
  let modifiedBalanceBorrower = parseFloat(interestReceived) + (fixture.amount * paymentPercentaje)

  let url, user, decimal_places
  let Decimal = require('decimal.js-light')

  url = userInfo.url
  user = userInfo.user

  switch (decimals) {

    case 3:
      Decimal.config({ precision: 3 })
      decimal_places = 3
      break

    case 6:
      Decimal.config({ precision: 6 })
      decimal_places = 6
      break
  }

  cy.logMessage(`Get balances ${type} after revert.`)

  cy.task(`get${type}Bearer`).then(bearer => {

    cy.getTraderBalanceWithBearerOnlyAPI(url, fixture.custodian, user, bearer).then(balancesAfterRevert => {

      const TOTAL_BALANCE_AFTER_REVERT = [balancesAfterRevert[fixture.asset1].total, balancesAfterRevert[fixture.asset2].total, balancesAfterRevert[fixture.asset3].total, balancesAfterRevert[fixture.asset4].total]

      cy.logMessage('TOTAL_BALANCE_AFTER_REVERT: ' + TOTAL_BALANCE_AFTER_REVERT)

      /* Get price from task to check balances */
      cy.task(`getTotalBalance${type}Before`).then(totalBalanceBefore => {

        let decimaltotalBalanceAfterAsset2 = new Decimal(TOTAL_BALANCE_AFTER_REVERT[INDEX_ASSET_2]).toNumber()
        let decimaltotalBalanceBeforeAsset2 = new Decimal(totalBalanceBefore[INDEX_ASSET_2]).toNumber()
        let decimaltotalBalanceBeforeAsset2WithModifiedBalance

        if (type == LENDER) {
          decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 + modifiedBalanceLender)).toNumber()
        } else if (type == BORROWER) {
          decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 - modifiedBalanceBorrower)).toNumber()
        } else if (type == FEES) {
          decimaltotalBalanceBeforeAsset2WithModifiedBalance = new Decimal((decimaltotalBalanceBeforeAsset2 + modifiedBalanceFees)).toNumber()
        }
        expect(decimaltotalBalanceBeforeAsset2WithModifiedBalance.toFixed(decimal_places)).to.equal(decimaltotalBalanceAfterAsset2.toFixed(decimal_places))
      })
    })
  })
})

/**
 * Match repo order
 * @param {Json} fixture: Data used in test
 * @param {Object} userInfo: User who match the repo  
 * @param {Object} side: Side of the repo (borrower or lender)
 */
Cypress.Commands.add('matchRepoOrder', (fixture, userInfo, side) => {

  /* Intercept when an Repo order is matched */
  cy.intercept(BOSONIC_CONSTANTS.REQUEST_POST, URL.MATCH_ORDER_URL).as('matchOrder')

  cy.loginAndDescription(userInfo.url, userInfo.user, 'Match order')

  /* Click on Repo Layout */
  cy.contains(WIDGET.TRADER.REPO_BTN).click().wait(WAIT.LONG)

  /* Close the window and then open it again to refresh the values of the response. */
  cy.xpath(WIDGET.TRADER_TRADE_BLOTTER.CLOSE_WIDGET).click({ force: true })

  /* Match the repo order */
  cy.get(WIDGET.REPO_RATES.ASSET_LIST).contains(fixture.symbol).parent().click().wait(WAIT.LOW)
  cy.get(WIDGET.REPO_PANEL.ASSET_TITLE).contains(fixture.symbol).scrollIntoView().should('be.visible')
  cy.xpath(WIDGET.REPO_PANEL.CONTAINER_XPATH + `'${fixture.symbol}']]`).within(
    function () {
      cy.wait(WAIT.STANDARD)
      if (side == SIDE.BUY) {
        cy.xpath('(' + WIDGET.REPO_PANEL.MATCH_ASSET_ROW_TO_BORROW + `${fixture.asset1_repo}')])[1]`).click().wait(WAIT.LOW)
      } else {
        cy.xpath('(' + WIDGET.REPO_PANEL.MATCH_ASSET_ROW_TO_LEND + `${fixture.asset1_repo}')])[1]`).click().wait(WAIT.LOW)
      }
      cy.contains(WIDGET.REPO_PANEL.SEND_BTN).click().wait(WAIT.MEDIUM)
    })

  /* Intercept when the open order widget is open and get response values */
  cy.intercept(BOSONIC_CONSTANTS.REQUEST_GET, URL.QUERY_ALL_TRADEBLOTTER_TM).as('tradeBlotterValues')

  cy.logout()
})

/**
 * 
 */
Cypress.Commands.add('validateNewRepostOrder', (userInfo, repoStatus, after24Hours) => {

  cy.loginAndDescription(userInfo.url, userInfo.user)

  /* Click on Repo Layout */
  cy.contains(WIDGET.TRADER.REPO_BTN).click().wait(WAIT.LONG)

  if (!after24Hours) {

    /* Click in Repo Position Widget and Maximize */
    cy.contains(WIDGET.REPO_POSITION.NAME).click({ force: true })
    cy.xpath(WIDGET.REPO_POSITION.MAXIMIZE).click()

    /* Get the lastRepoId (before the new repo) and check if the ID increase after the new repo */
    cy.task(TASK.GET_LAST_REPO_ID).then(lastRepoID => {
      /* Get the new Repo ID and check if is greater than the last RepoID */
      cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.ID).then($newRepoId => {
        expect(Number($newRepoId.text())).to.be.greaterThan(Number(lastRepoID))
      })
    })
  }

  /* Check status */
  cy.xpath(WIDGET.REPO_POSITION.LENDER.FIRST_ROW.FIELDS.STATUS).then($status => {
    if (repoStatus == STATUS.REPAID) {
      expect($status.text(), "Status is REPAID").to.equal(STATUS.REPAID)
    } else {
      expect($status.text(), "Status is DEFAULT").to.equal(STATUS.DEFAULT)
    }
  })

  cy.xpath('//*[contains(@id, "toolbarOpenOrdersBlotter")]/div/button').then(($btn) => {

    if (repoStatus == STATUS.REPAID) {
      /* Check if the Cancel All button is enabled */
      cy.get($btn).should('not.be.disabled')
    } else {
      /* Check if the Cancel All button is disabled */
      cy.get($btn).should('be.disabled')
    }

    /* Cancel order */
    if (cy.get($btn).should('not.be.disabled')) {
      cy.log("There are open orders, then they will be canceled... ")
      cy.xpath('//*[contains(@id, "toolbarOpenOrdersBlotter")]/div/button').click({
        force: true
      }).wait(WAIT.STANDARD)
      cy.xpath("//div[contains(@class,'modal-content')]//button[contains(@class, 'positive')]").click().wait(WAIT.MEDIUM).log("The orders were canceled.")
      cy.get($btn).should('be.disabled')
    } else {
      cy.log("There aren't open orders.")
    }

    cy.logout()
  })
})

/**
 * 
 */
Cypress.Commands.add('validateNotRepostOrderAppear', (userInfo) => {

  cy.loginAndDescription(userInfo.url, userInfo.user)

  /* Click on Repo Layout */
  cy.contains(WIDGET.TRADER.REPO_BTN).click().wait(WAIT.LONG)

  cy.xpath('//*[contains(@id, "toolbarOpenOrdersBlotter")]/div/button').then(($btn) => {

    /* Check if the Cancel All button is disabled */
    cy.get($btn).should('be.disabled')

    cy.logout()
  })
})

/**
 * Send all the balance to a pivot user
 * @param {Json} fixture: Data used in test
 * @param {Object} initialBalancesBorrower: Borrower initial balance needed to start test
 * @param {Object} borrowerInfo: Borrower user to be used in test
 * @param {Object} lenderInfo: Lender user to be used in test
 */
Cypress.Commands.add('sendBalanceToPivotUser', (fixture, userInfo) => {

  /* Get balances */
  cy.getRequestToken(userInfo.url, userInfo.user).then(token => {

    const BEARER = token.headers['authorization'].replace('Bearer ', '')

    cy.getTraderBalanceWithTokenOnlyAPI(userInfo.url, fixture.custodian, userInfo.user.USER, token).then(balances => {

      const TOTAL_BALANCE = [balances[fixture.asset1].total, balances[fixture.asset2].total]

      /* Send all the balance to pivot user */
      let decimaltotalBalanceUserBeforeBTC = new Decimal(TOTAL_BALANCE[INDEX_ASSET_1]).toNumber()
      let decimaltotalBalanceUserBeforeUSD = new Decimal(TOTAL_BALANCE[INDEX_ASSET_2]).toNumber()

      let paymentsMap = new Map()
      if (decimaltotalBalanceUserBeforeBTC != 0) paymentsMap.set(ASSET.BTC, decimaltotalBalanceUserBeforeBTC)
      if (decimaltotalBalanceUserBeforeUSD != 0) paymentsMap.set(ASSET.USD, decimaltotalBalanceUserBeforeUSD)

      cy.rebalanceWithPayments(BEARER, fixture.custodian, paymentsMap, USER.USER_TM_TAKER.USER)

    })
  })

})

/**
 * Get quantity hours from a string with format "XXh XXm"
 * @param {String} timeText 
 * @returns {integer} Quantity Hours
 */
function getEntireHours(timeText) {
  const hPosition = timeText.indexOf("h")
  const mPosition = timeText.indexOf("m")
  let hours = 0
  let minutes
  if (hPosition >= 0) { // if "h" doesn't exist, hposition is -1
    hours = Number(timeText.substring(0, hPosition - 1))
    minutes = Number(timeText.substring(hPosition + 1, mPosition - 1))
  } else {
    minutes = Number(timeText.substring(0, mPosition - 1))
  }

  return (minutes > 0) ? hours + 1 : hours
}


/**
 * Quantity of hours between two dates
 * @param {String} firstDate 
 * @param {String} secondDate 
 * @returns 
 */
function getHoursBetweenRepoContractDates(firstDate, secondDate) {
  const openDateMoment = moment(firstDate)
  const closeDateMoment = moment(secondDate)

  const qtyHours = closeDateMoment.diff(openDateMoment, 'hours');

  return qtyHours;
} 