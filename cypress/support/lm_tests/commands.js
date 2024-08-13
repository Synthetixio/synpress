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
 * Date: 28/02/23 4:17
 * Author(s): Diego Graf
 * -----
 * Last Modified: 02/06/2023
 * Modified By: Diego Graf
 * -----
 * 
 */

const BosonicUI = require('../bosonic.constants')

let Decimal = require('decimal.js-light');
Decimal.config({
  precision: 4,
})

let DecimalQty2 = require('decimal.js-light');
DecimalQty2.config({
  precision: 2,
})

/* Number */
const TWO = 2

/* Area of the book */
const TOP = 'TOP'
const MIDDLE = 'MIDDLE'
const BOTTOM = 'BOTTOM'

/* Indexes */
const ASSET_1 = 0
const ASSET_2 = 1

/* X_AXIS and Y_AXIS to Drag and Drop */
const X_AXIS = 800
const Y_AXIS = 800
const X_AXIS_START = 0
const Y_AXIS_START = 0

/* Status */
const PARTFILL_CONFIRMED = 'PARTFILL-CONFIRMED'

/* Sides */
const BUY_SIDE = 'BUY'
const SELL_SIDE = 'SELL'

/* TIF */
const IOC_TIF = 'IOC'
const GTC_TIF = 'GTC'

/* Characters */
const NO_CHARACTER = ''
const COMMA = ','
const LEFT_PARENTHESIS = '('
const RIGHT_PARENTHESIS = ')'
const LEFT_BRACKET = '['
const RIGHT_BRACKET = ']'

/* Decimal Places */
const DECIMAL_PLACES = 4
const DECIMAL_PLACES_QTY2 = 2

/* Messages */
const IOC_EXPIRED = 'IOC expired'

/* Filled */
const NOTHING_FILLED = '0.00'

/* Widgets */
const RATE_PANEL = BosonicUI.TRADER.WIDGETS.RATE_PANEL
const RATES_PANEL = BosonicUI.TRADER.WIDGETS.RATES_PANEL
const TRADE_BLOTTER = BosonicUI.TRADER.WIDGETS.TRADE_BLOTTER

/* Waits */
const LOW = BosonicUI.WAIT.LOW
const HIGH = BosonicUI.WAIT.HIGH
const MEDIUM = BosonicUI.WAIT.MEDIUM
const EXTRA = BosonicUI.WAIT.EXTRA
const STANDARD = BosonicUI.WAIT.STANDARD

/* Percentage to add and substract to prices */
const PERCENTAGE_TO_ADD = 0.005
const TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL = "#jqxScrollThumbhorizontalScrollBarTradeBlotter-21"
const START_TRADE_BLOTTER_TM_ROW = "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row"
const MIDDLE_TRADE_BLOTTER_TM_ROW = "TradeBlotter')]//div[contains(@class, '"
const END_TRADE_BLOTTER_TM_ROW = "')]/div"

/**
 * Make a IOC LM BID trade and validate
 * @param {String} areaOfTheBook
 * @param {Json} fixture 
 * @param {String} url_tm
 * @param {Json} user_tm
 */

Cypress.Commands.add('tradeBidIoc', (areaOfTheBook, fixture, url_tm, user_tm) => {

  /* Const Interceptor */
  const interceptorTradeLm = url_tm + "rest/lmorder"
  const interceptorTradeBlotterWidget = url_tm + "rest/lmorder/queryAll?**"

  cy.intercept(BosonicUI.REQUEST_POST, interceptorTradeLm).as('tradeLm')

  cy.loginAndDescription(url_tm, user_tm)

  /* Decrease the Memory use */
  cy.decreaseMemoryUse()

  /* Get token from API */
  cy.getRequestToken(url_tm, user_tm).as('token')

  /* Get token from API */
  cy.get('@token').then((token) => {

    /* Get balances trader before operation */
    cy.getTraderBalanceWithToken(fixture.custodian, user_tm, token).then(traderBalancesBefore => {
      const totalBalanceTraderBefore = [traderBalancesBefore[fixture.asset1].total, traderBalancesBefore[fixture.asset2].total]

      cy.logMessage('User: ' + user_tm.USER)
      cy.logMessage('Balance before operation Asset ' + fixture.asset1 + " = " + totalBalanceTraderBefore[ASSET_1])
      cy.logMessage('Balance before operation Asset ' + fixture.asset2 + " = " + totalBalanceTraderBefore[ASSET_2])
      cy.task('setTotalBalanceTraderBefore', totalBalanceTraderBefore)
    })

    /* Close all the Rates Panel */
    cy.xpath(RATE_PANEL.CLOSE_BUTTON).click({ multiple: true })

    /* If there are open orders, these are cancelled */
    cy.cancelAllOpenOrders()

    /* Add Rate Panel */
    cy.get(RATES_PANEL.ASSET_LIST).contains(fixture.symbol).parent().click({ force: true }).wait(LOW)
    cy.get(RATE_PANEL.ASSET_TITLE).contains(fixture.symbol).scrollIntoView().should('be.visible')

    cy.wait(MEDIUM)

    /* First check if there are prices in the order book */
    /* We get the book's quantity of rows */
    cy.xpath('count(' + RATE_PANEL.ALL_BUY_BOOK_ROWS + ')').then($elements => {
      expect($elements, "THERE'S LIQUIDITY: The levels in the order book (buy side) must be at least 1").at.least(1)
    }).wait(HIGH)

    /* Here, click at the Book */
    let quantityRows = 0

    switch (areaOfTheBook) {

      case TOP:
        /* Here, click at the TOB */
        cy.xpath(RATE_PANEL.IOC_BUY_FIRST_PART + fixture.asset1 + RATE_PANEL.IOC_BUY_SECOND_PART).dblclick({ force: true }).wait(MEDIUM)
        break

      case MIDDLE:
        /* Here, click at the MOB operation */
        /* First, we get the book's quantity of rows to calculate the middle of the this */
        cy.xpath(RATE_PANEL.ALL_BUY_BOOK_ROWS).then($elements => {
          quantityRows = $elements.length
          let middleOfTheBook = Math.floor(quantityRows / TWO)
          if (middleOfTheBook == 0) {
            middleOfTheBook = 1
          }
          cy.xpath(LEFT_PARENTHESIS + RATE_PANEL.BUY_BOOK_ROWS + RIGHT_PARENTHESIS + LEFT_BRACKET + middleOfTheBook + RIGHT_BRACKET).dblclick({ force: true }).wait(MEDIUM)
        }).wait(HIGH)
        break

      case BOTTOM:
        /* Here, click at the BOB operation */
        /* First, we get the book's quantity of rows to calculate the middle of the this */
        cy.xpath(RATE_PANEL.ALL_BUY_BOOK_ROWS).then($elements => {
          quantityRows = $elements.length
          cy.xpath(LEFT_PARENTHESIS + RATE_PANEL.BUY_BOOK_ROWS + RIGHT_PARENTHESIS + LEFT_BRACKET + quantityRows + RIGHT_BRACKET).dblclick({ force: true }).wait(MEDIUM)
        }).wait(HIGH)
        break

    }

    cy.wait('@tradeLm').then(interceptTradeLm => {

      const clOrdId = interceptTradeLm.response.body.clOrdId

      cy.task('setClOrdId', clOrdId)

      cy.task('getClOrdId').then(clOrdIdSaved => {
        cy.intercept(BosonicUI.REQUEST_GET, interceptorTradeBlotterWidget).as('tradeBlotter')

        cy.xpath(TRADE_BLOTTER.CLOSE_WIDGET).click().wait(LOW)
        cy.addWidget(TRADE_BLOTTER.NAME, 500, 750).wait(STANDARD)
        cy.xpath(TRADE_BLOTTER.BTN_MAXIMIZE_WIDGET).click()

        /* Validate the Trade Blotter */
        cy.task('setBooleanValue', false)

        cy.wait('@tradeBlotter').then($tradeBlotter => {

          for (let row = 0; row < 10; row++) {

            const clOrdIdRow = $tradeBlotter.response.body.data[row].clOrdId

            if (clOrdIdRow == clOrdIdSaved) {

              cy.task('setBooleanValue', true)

              cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.STATUS + END_TRADE_BLOTTER_TM_ROW).then(status => {
                cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.FILLED + END_TRADE_BLOTTER_TM_ROW).then(filled => {
                  cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS, Y_AXIS).wait(LOW)
                  cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.MESSAGE + END_TRADE_BLOTTER_TM_ROW).then(message => {
                    cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS_START, Y_AXIS_START).wait(LOW)
                    /* If status = 'PARTFILL-CONFIRMED' we continue with the test, else, we need try to match another order */
                    if (status.text() == PARTFILL_CONFIRMED) {
                      /* Validate Status */
                      expect(status.text(), "Status must be equal to 'PARTFILL-CONFIRMED'").to.be.equal(PARTFILL_CONFIRMED)

                      /* Validate SIDE */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.SIDE + END_TRADE_BLOTTER_TM_ROW).then(side => {
                        expect(side.text(), "Side must be equal to 'BUY'").to.be.equal(BUY_SIDE)
                      })

                      /* Validate ASSET PAIR */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET_PAIR + END_TRADE_BLOTTER_TM_ROW).then(asset_pair => {
                        expect(asset_pair.text(), "Asset Pair must be equal to " + fixture.symbol).to.be.equal(fixture.symbol)
                      })

                      /* Validate ASSET-1 */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET1 + END_TRADE_BLOTTER_TM_ROW).then(asset1 => {
                        expect(asset1.text(), "Asset1 must be equal to " + fixture.asset1).to.be.equal(fixture.asset1)
                      })

                      /* Validate ASSET-2 */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET2 + END_TRADE_BLOTTER_TM_ROW).then(asset2 => {
                        expect(asset2.text(), "Asset2 must be equal to " + fixture.asset2).to.be.equal(fixture.asset2)
                      })

                      cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS, Y_AXIS).wait(LOW)

                      /* Validate  TIF */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.TIF + END_TRADE_BLOTTER_TM_ROW).then(tif => {
                        expect(tif.text(), "TIF must be equal to IOC").to.be.equal(IOC_TIF)
                      })

                      cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS_START, Y_AXIS_START).wait(LOW)

                      /* Get trader balances after operation */

                      cy.getTraderBalanceWithToken(fixture.custodian, user_tm, token).then(traderBalancesAfter => {
                        const totalBalanceTraderAfter = [traderBalancesAfter[fixture.asset1].total, traderBalancesAfter[fixture.asset2].total]

                        cy.logMessage('User: ' + user_tm.USER + '_')
                        cy.logMessage('Balance after operation Asset ' + fixture.asset1 + " = " + totalBalanceTraderAfter[ASSET_1])
                        cy.logMessage('Balance after operation Asset ' + fixture.asset2 + " = " + totalBalanceTraderAfter[ASSET_2])
                        cy.task('setTotalBalanceTraderAfter', totalBalanceTraderAfter)

                        cy.task('getTotalBalanceTraderBefore').then(totalTraderBalanceBefore => {
                          cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.FILLED + END_TRADE_BLOTTER_TM_ROW).then(filled => {
                            cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.QTY_2 + END_TRADE_BLOTTER_TM_ROW).then(qty_2 => {
                              let decimalQty2 = new DecimalQty2(parseFloat(qty_2.text().replaceAll(LEFT_PARENTHESIS, NO_CHARACTER).replaceAll(RIGHT_PARENTHESIS, NO_CHARACTER).replaceAll(COMMA, NO_CHARACTER))).toNumber()
                              let decimalFilled = new Decimal(parseFloat(filled.text().replaceAll(LEFT_PARENTHESIS, NO_CHARACTER).replaceAll(RIGHT_PARENTHESIS, NO_CHARACTER).replaceAll(COMMA, NO_CHARACTER))).toNumber()
                              expect((totalBalanceTraderAfter[ASSET_1]).toFixed(DECIMAL_PLACES), "Balance for Asset: " + fixture.asset1 + " after operation is equal to balance before operation plus filled.").to.equal((totalTraderBalanceBefore[ASSET_1] + decimalFilled).toFixed(DECIMAL_PLACES))
                              let operationValidation = (parseFloat(truncateNumber(totalBalanceTraderAfter[ASSET_2], 2)) - (parseFloat(truncateNumber(totalTraderBalanceBefore[ASSET_2], 2)) - decimalQty2.toFixed(DECIMAL_PLACES_QTY2)))
                              let assert = false
                              if ((Math.round(operationValidation * 100) / 100) <= 0.01 && (Math.round(operationValidation * 100) / 100) >= -0.01) {
                                assert = true
                              }
                              expect(assert, "Balance for Asset: " + fixture.asset2 + " after operation is equal to balance before operation minus qty2.").to.equal(true)
                            })
                          })
                        })
                      })
                      // TODO: See ticket: https://bosonic.atlassian.net/browse/QAT-568
                      cy.logout().wait(MEDIUM)
                    } else {
                      /* If the status is diferent to PARTFILL-CONFIRMED, we validate if the message is IOC Expired and the filled = 0 
                       * Next, we try to match another order
                       */
                      expect(message.text(), "The message is 'IOC expired'").to.be.equal(IOC_EXPIRED)
                      expect(filled.text(), "Filled is 0.00").to.be.equal(NOTHING_FILLED)
                      cy.logout().wait(MEDIUM)
                      if (areaOfTheBook != TOP) {
                        cy.tradeBidIoc(areaOfTheBook, fixture, url_tm, user_tm)
                      }
                    }
                  })
                })
              })
            }

            break;
          }

          cy.task('getBooleanValue').then(value => {
            expect(value, "LM ORDER EXIST IN TRADE BLOTTER WIDGET.").to.equal(true)
          })

        })

      })
    })
  })
})

/**
 * Make a IOC LM OFFER trade and validate
 * @param {String} areaOfTheBook
 * @param {Json} fixture 
 * @param {String} url_tm
 * @param {Json} user_tm
 */

Cypress.Commands.add('tradeOfferIoc', (areaOfTheBook, fixture, url_tm, user_tm) => {

  /* Const Interceptor */
  const interceptorTradeLm = url_tm + "rest/lmorder"
  const interceptorTradeBlotterWidget = url_tm + "rest/lmorder/queryAll?**"

  cy.intercept(BosonicUI.REQUEST_POST, interceptorTradeLm).as('tradeLm')

  cy.loginAndDescription(url_tm, user_tm)

  /* Decrease the Memory use */
  cy.decreaseMemoryUse()

  /* Get token from API */
  cy.getRequestToken(url_tm, user_tm).as('token')

  /* Get token from API */
  cy.get('@token').then((token) => {

    /* Get balances trader before operation */

    cy.getTraderBalanceWithToken(fixture.custodian, user_tm, token).then(traderBalancesBefore => {
      const totalBalanceTraderBefore = [traderBalancesBefore[fixture.asset1].total, traderBalancesBefore[fixture.asset2].total]

      cy.logMessage('User: ' + user_tm.USER)
      cy.logMessage('Balance before operation Asset ' + fixture.asset1 + " = " + totalBalanceTraderBefore[ASSET_1])
      cy.logMessage('Balance before operation Asset ' + fixture.asset2 + " = " + totalBalanceTraderBefore[ASSET_2])
      cy.task('setTotalBalanceTraderBefore', totalBalanceTraderBefore)
    })

    /* Close all the Rates Panel */
    cy.xpath(RATE_PANEL.CLOSE_BUTTON).click({ multiple: true })

    /* If there are open orders, these are cancelled */
    cy.cancelAllOpenOrders()

    /* Add Rate Panel */
    cy.get(RATES_PANEL.ASSET_LIST).contains(fixture.symbol).parent().click({ force: true }).wait(LOW)
    cy.get(RATE_PANEL.ASSET_TITLE).contains(fixture.symbol).scrollIntoView().should('be.visible')

    cy.wait(MEDIUM)

    /* First check if there are prices in the order book */
    /* We get the book's quantity of rows */
    cy.xpath('count(' + RATE_PANEL.ALL_SELL_BOOK_ROWS + ')').then($elements => {
      expect($elements, "THERE'S LIQUIDITY: The levels in the order book (sell side) must be at least 1").at.least(1)
    }).wait(HIGH)

    /* Here, click at the Book */
    let quantityRows = 0

    switch (areaOfTheBook) {

      case TOP:
        /* Here, click at the TOB */
        cy.xpath(RATE_PANEL.IOC_SELL_FIRST_PART + fixture.asset1 + RATE_PANEL.IOC_SELL_SECOND_PART).dblclick({ force: true }).wait(MEDIUM)
        break

      case MIDDLE:
        /* Here, click at the MOB operation */
        /* First, we get the book's quantity of rows to calculate the middle of the this */
        cy.xpath(RATE_PANEL.ALL_SELL_BOOK_ROWS).then($elements => {
          quantityRows = $elements.length
          let middleOfTheBook = Math.floor(quantityRows / TWO)
          if (middleOfTheBook == 0) {
            middleOfTheBook = 1
          }
          cy.xpath(LEFT_PARENTHESIS + RATE_PANEL.SELL_BOOK_ROWS + RIGHT_PARENTHESIS + LEFT_BRACKET + middleOfTheBook + RIGHT_BRACKET).dblclick({ force: true }).wait(MEDIUM)
        }).wait(HIGH)
        break

      case BOTTOM:
        /* Here, click at the BOB operation */
        /* First, we get the book's quantity of rows to calculate the middle of the this */
        cy.xpath(RATE_PANEL.ALL_SELL_BOOK_ROWS).then($elements => {
          quantityRows = $elements.length
          cy.xpath(LEFT_PARENTHESIS + RATE_PANEL.SELL_BOOK_ROWS + RIGHT_PARENTHESIS + LEFT_BRACKET + quantityRows + RIGHT_BRACKET).dblclick({ force: true }).wait(MEDIUM)
        }).wait(HIGH)
        break

    }

    cy.wait('@tradeLm').then(interceptTradeLm => {

      const clOrdId = interceptTradeLm.response.body.clOrdId

      cy.task('setClOrdId', clOrdId)

      cy.task('getClOrdId').then(clOrdIdSaved => {

        cy.intercept(BosonicUI.REQUEST_GET, interceptorTradeBlotterWidget).as('tradeBlotter')

        cy.xpath(TRADE_BLOTTER.CLOSE_WIDGET).click().wait(LOW)
        cy.addWidget(TRADE_BLOTTER.NAME, 500, 750).wait(STANDARD)
        cy.xpath(TRADE_BLOTTER.BTN_MAXIMIZE_WIDGET).click()

        cy.task('setBooleanValue', false)

        cy.wait('@tradeBlotter').then($tradeBlotter => {

          for (let row = 0; row < 10; row++) {
            const clOrdIdRow = $tradeBlotter.response.body.data[row].clOrdId

            if (clOrdIdRow == clOrdIdSaved) {
              cy.task('setBooleanValue', true)

              cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.STATUS + END_TRADE_BLOTTER_TM_ROW).then(status => {
                cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.FILLED + END_TRADE_BLOTTER_TM_ROW).then(filled => {
                  cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS, Y_AXIS).wait(LOW)
                  cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.MESSAGE + END_TRADE_BLOTTER_TM_ROW).then(message => {
                    cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS_START, Y_AXIS_START).wait(LOW)
                    /* If status = 'PARTFILL-CONFIRMED' we continue with the test, else, we need try to match another order */
                    if (status.text() == PARTFILL_CONFIRMED) {
                      /* Validate Status */
                      expect(status.text(), "Status must be equal to 'PARTFILL-CONFIRMED'").to.be.equal(PARTFILL_CONFIRMED)

                      /* Validate SIDE */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.SIDE + END_TRADE_BLOTTER_TM_ROW).then(side => {
                        expect(side.text(), "Side must be equal to 'BUY'").to.be.equal(SELL_SIDE)
                      })

                      /* Validate ASSET PAIR */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET_PAIR + END_TRADE_BLOTTER_TM_ROW).then(asset_pair => {
                        expect(asset_pair.text(), "Asset Pair must be equal to " + fixture.symbol).to.be.equal(fixture.symbol)
                      })

                      /* Validate ASSET-1 */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET1 + END_TRADE_BLOTTER_TM_ROW).then(asset1 => {
                        expect(asset1.text(), "Asset1 must be equal to " + fixture.asset1).to.be.equal(fixture.asset1)
                      })

                      /* Validate ASSET-2 */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET2 + END_TRADE_BLOTTER_TM_ROW).then(asset2 => {
                        expect(asset2.text(), "Asset2 must be equal to " + fixture.asset2).to.be.equal(fixture.asset2)
                      })

                      cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS, Y_AXIS).wait(LOW)

                      /* Validate  TIF */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.TIF + END_TRADE_BLOTTER_TM_ROW).then(tif => {
                        expect(tif.text(), "TIF must be equal to IOC").to.be.equal(IOC_TIF)
                      })

                      cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS_START, Y_AXIS_START).wait(LOW)

                      /* Get trader balances after operation */

                      cy.getTraderBalanceWithToken(fixture.custodian, user_tm, token).then(traderBalancesAfter => {
                        const totalBalanceTraderAfter = [traderBalancesAfter[fixture.asset1].total, traderBalancesAfter[fixture.asset2].total]

                        cy.logMessage('User: ' + user_tm.USER + '_')
                        cy.logMessage('Balance after operation Asset ' + fixture.asset1 + " = " + totalBalanceTraderAfter[ASSET_1])
                        cy.logMessage('Balance after operation Asset ' + fixture.asset2 + " = " + totalBalanceTraderAfter[ASSET_2])
                        cy.task('setTotalBalanceTraderAfter', totalBalanceTraderAfter)

                        cy.task('getTotalBalanceTraderBefore').then(totalTraderBalanceBefore => {
                          cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.FILLED + END_TRADE_BLOTTER_TM_ROW).then(filled => {
                            cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.QTY_2 + END_TRADE_BLOTTER_TM_ROW).then(qty_2 => {
                              let decimalQty2 = new DecimalQty2(parseFloat(qty_2.text().replaceAll(LEFT_PARENTHESIS, NO_CHARACTER).replaceAll(RIGHT_PARENTHESIS, NO_CHARACTER).replaceAll(COMMA, NO_CHARACTER))).toNumber()
                              let decimalFilled = new Decimal(parseFloat(filled.text().replaceAll(LEFT_PARENTHESIS, NO_CHARACTER).replaceAll(RIGHT_PARENTHESIS, NO_CHARACTER).replaceAll(COMMA, NO_CHARACTER))).toNumber()
                              expect((totalBalanceTraderAfter[ASSET_1]).toFixed(DECIMAL_PLACES), "Balance for Asset: " + fixture.asset1 + " after operation is equal to balance before operation minus filled.").to.equal((totalTraderBalanceBefore[ASSET_1] - decimalFilled).toFixed(DECIMAL_PLACES))
                              let operationValidation = (parseFloat(truncateNumber(totalBalanceTraderAfter[ASSET_2], 2)) - (parseFloat(truncateNumber(totalTraderBalanceBefore[ASSET_2], 2)) + parseFloat(decimalQty2.toFixed(DECIMAL_PLACES_QTY2))))
                              let assert = false
                              if ((Math.round(operationValidation * 100) / 100) <= 0.01 && (Math.round(operationValidation * 100) / 100) >= -0.01) {
                                assert = true
                              }
                              expect(assert, "Balance for Asset: " + fixture.asset2 + " after operation is equal to balance before operation plus qty2.").to.equal(true)
                            })
                          })
                        })
                      })
                      // TODO: See ticket: https://bosonic.atlassian.net/browse/QAT-568
                      cy.logout().wait(MEDIUM)
                    } else {
                      /* If the status is diferent to PARTFILL-CONFIRMED, we validate if the message is IOC Expired and the filled = 0 
                       * Next, we try to match another order
                       */
                      expect(message.text(), "The message is 'IOC expired'").to.be.equal(IOC_EXPIRED)
                      expect(filled.text(), "Filled is 0.00").to.be.equal(NOTHING_FILLED)
                      cy.logout().wait(MEDIUM)
                      if (areaOfTheBook != TOP) {
                        cy.tradeOfferIoc(areaOfTheBook, fixture, url_tm, user_tm)
                      }
                    }
                  })
                })
              })
            }

            break;
          }

          cy.task('getBooleanValue').then(value => {
            expect(value, "LM ORDER EXIST IN TRADE BLOTTER WIDGET.").to.equal(true)
          })
        })
      })

    })

  })
})

/**
 * Make a GTC LM BID trade and validate
 * @param {String} areaOfTheBook
 * @param {Json} fixture 
 * @param {String} url_tm
 * @param {Json} user_tm
 */

Cypress.Commands.add('tradeBidGtc', (areaOfTheBook, fixture, url_tm, user_tm) => {

  /* Const Interceptor */
  const interceptorTradeLm = url_tm + "rest/lmorder"
  const interceptorTradeBlotterWidget = url_tm + "rest/lmorder/queryAll?**"

  cy.intercept(BosonicUI.REQUEST_POST, interceptorTradeLm).as('tradeLm')

  cy.loginAndDescription(url_tm, user_tm)

  /* Decrease the Memory use */
  cy.decreaseMemoryUse()

  /* Get token from API */
  cy.getRequestToken(url_tm, user_tm).as('token')

  /* Get token from API */
  cy.get('@token').then((token) => {

    /* Get balances trader before operation */

    cy.getTraderBalanceWithToken(fixture.custodian, user_tm, token).then(traderBalancesBefore => {
      const totalBalanceTraderBefore = [traderBalancesBefore[fixture.asset1].total, traderBalancesBefore[fixture.asset2].total]

      cy.logMessage('User: ' + user_tm.USER)
      cy.logMessage('Balance before operation Asset ' + fixture.asset1 + " = " + totalBalanceTraderBefore[ASSET_1])
      cy.logMessage('Balance before operation Asset ' + fixture.asset2 + " = " + totalBalanceTraderBefore[ASSET_2])
      cy.task('setTotalBalanceTraderBefore', totalBalanceTraderBefore)
    })

    /* Close all the Rates Panel */
    cy.xpath(RATE_PANEL.CLOSE_BUTTON).click({ multiple: true })

    /* If there are open orders, these are cancelled */
    cy.cancelAllOpenOrders()

    /* Add Rate Panel */
    cy.get(RATES_PANEL.ASSET_LIST).contains(fixture.symbol).parent().click({ force: true }).wait(LOW)
    cy.get(RATE_PANEL.ASSET_TITLE).contains(fixture.symbol).scrollIntoView().should('be.visible')

    cy.wait(MEDIUM)

    /* First check if there are prices in the order book */
    /* We get the book's quantity of rows */
    cy.xpath('count(' + RATE_PANEL.ALL_BUY_BOOK_ROWS + ')').then($elements => {
      expect($elements, "THERE'S LIQUIDITY: The levels in the order book (buy side) must be at least 1").at.least(1)
    }).wait(HIGH)

    /* Here, click at the Book */
    let quantityRows = 0

    switch (areaOfTheBook) {

      case TOP:
        /* Here, click at the TOB */
        cy.xpath(RATE_PANEL.IOC_BUY_FIRST_PART + fixture.asset1 + RATE_PANEL.IOC_BUY_SECOND_PART).click({ force: true }).wait(MEDIUM)
        /* Adding 5% to price to match faster */
        cy.xpath(RATE_PANEL.PRICE_XPATH).invoke('attr', 'value').as('value').then($price => {
          let price = parseFloat($price.replaceAll(',', ''))
          price += (price * PERCENTAGE_TO_ADD)
          cy.xpath(RATE_PANEL.PRICE_XPATH).clear().type(price.toFixed(2))
        }).wait(LOW)
        /* Round to 2 decimals the amount */
        cy.xpath(RATE_PANEL.AMOUNT_XPATH).invoke('attr', 'value').as('value').then($amount => {
          let amount = parseFloat($amount.replaceAll(',', ''))
          cy.xpath(RATE_PANEL.AMOUNT_XPATH).clear().type(amount.toFixed(2))
        }).wait(LOW)
        /* Here send the order */
        cy.contains(RATE_PANEL.SEND_BTN).click()
        cy.wait(EXTRA)
        break

      case MIDDLE:
        /* Here, click at the MOB operation */
        /* First, we get the book's quantity of rows to calculate the middle of the this */
        cy.xpath(RATE_PANEL.ALL_BUY_BOOK_ROWS).then($elements => {
          quantityRows = $elements.length;
          let middleOfTheBook = Math.floor(quantityRows / TWO)
          if (middleOfTheBook == 0) {
            middleOfTheBook = 1
          }
          cy.xpath(LEFT_PARENTHESIS + RATE_PANEL.BUY_BOOK_ROWS + RIGHT_PARENTHESIS + LEFT_BRACKET + middleOfTheBook + RIGHT_BRACKET).click({ force: true }).wait(MEDIUM)
          /* Adding 5% to price to match faster */
          cy.xpath(RATE_PANEL.PRICE_XPATH).invoke('attr', 'value').as('value').then($price => {
            let price = parseFloat($price.replaceAll(',', ''))
            price += (price * PERCENTAGE_TO_ADD)
            cy.xpath(RATE_PANEL.PRICE_XPATH).clear().type(price.toFixed(2))
          }).wait(LOW)
          /* Round to 2 decimals the amount */
          cy.xpath(RATE_PANEL.AMOUNT_XPATH).invoke('attr', 'value').as('value').then($amount => {
            let amount = parseFloat($amount.replaceAll(',', ''))
            cy.xpath(RATE_PANEL.AMOUNT_XPATH).clear().type(amount.toFixed(2))
          }).wait(LOW)
          /* Here send the order */
          cy.contains(RATE_PANEL.SEND_BTN).click()
          cy.wait(EXTRA)
        }).wait(EXTRA)
        break

      case BOTTOM:
        /* Here, click at the BOB operation */
        /* First, we get the book's quantity of rows to calculate the middle of the this */
        cy.xpath(RATE_PANEL.ALL_BUY_BOOK_ROWS).then($elements => {
          quantityRows = $elements.length;
          cy.xpath(LEFT_PARENTHESIS + RATE_PANEL.BUY_BOOK_ROWS + RIGHT_PARENTHESIS + LEFT_BRACKET + quantityRows + RIGHT_BRACKET).click({ force: true }).wait(MEDIUM)
          /* Adding 5% to price to match faster */
          cy.xpath(RATE_PANEL.PRICE_XPATH).invoke('attr', 'value').as('value').then($price => {
            let price = parseFloat($price.replaceAll(',', ''))
            price += (price * PERCENTAGE_TO_ADD)
            cy.xpath(RATE_PANEL.PRICE_XPATH).clear().type(price.toFixed(2))
          }).wait(LOW)
          /* Round to 2 decimals the amount */
          cy.xpath(RATE_PANEL.AMOUNT_XPATH).invoke('attr', 'value').as('value').then($amount => {
            let amount = parseFloat($amount.replaceAll(',', ''))
            cy.xpath(RATE_PANEL.AMOUNT_XPATH).clear().type(amount.toFixed(2))
          }).wait(LOW)
          /* Here send the order */
          cy.contains(RATE_PANEL.SEND_BTN).click()
          cy.wait(EXTRA)
        }).wait(EXTRA)
        break
    }

    cy.wait('@tradeLm').then(interceptTradeLm => {

      const clOrdId = interceptTradeLm.response.body.clOrdId

      cy.task('setClOrdId', clOrdId)

      cy.task('getClOrdId').then(clOrdIdSaved => {
        cy.intercept(BosonicUI.REQUEST_GET, interceptorTradeBlotterWidget).as('tradeBlotter')

        cy.xpath(TRADE_BLOTTER.CLOSE_WIDGET).click().wait(LOW)
        cy.addWidget(TRADE_BLOTTER.NAME, 500, 750).wait(STANDARD)
        cy.xpath(TRADE_BLOTTER.BTN_MAXIMIZE_WIDGET).click()

        /* Validate the Trade Blotter */
        cy.task('setBooleanValue', false)

        cy.wait('@tradeBlotter').then($tradeBlotter => {

          for (let row = 0; row < 10; row++) {
            const clOrdIdRow = $tradeBlotter.response.body.data[row].clOrdId

            if (clOrdIdRow == clOrdIdSaved) {
              cy.task('setBooleanValue', true)

              /* Validate the Trade Blotter */
              cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.STATUS + END_TRADE_BLOTTER_TM_ROW).then(status => {
                cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.FILLED + END_TRADE_BLOTTER_TM_ROW).then(filled => {
                  cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS, Y_AXIS).wait(LOW)
                  cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.MESSAGE + END_TRADE_BLOTTER_TM_ROW).then(message => {
                    cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS_START, Y_AXIS_START).wait(LOW)
                    /* If status = 'PARTFILL-CONFIRMED' we continue with the test, else, we need try to match another order */
                    if (status.text() == PARTFILL_CONFIRMED) {
                      /* Validate Status */
                      expect(status.text(), "Status must be equal to 'PARTFILL-CONFIRMED'").to.be.equal(PARTFILL_CONFIRMED)

                      /* Validate SIDE */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.SIDE + END_TRADE_BLOTTER_TM_ROW).then(side => {
                        expect(side.text(), "Side must be equal to 'BUY'").to.be.equal(BUY_SIDE)
                      })

                      /* Validate ASSET PAIR */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET_PAIR + END_TRADE_BLOTTER_TM_ROW).then(asset_pair => {
                        expect(asset_pair.text(), "Asset Pair must be equal to " + fixture.symbol).to.be.equal(fixture.symbol)
                      })

                      /* Validate ASSET-1 */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET1 + END_TRADE_BLOTTER_TM_ROW).then(asset1 => {
                        expect(asset1.text(), "Asset1 must be equal to " + fixture.asset1).to.be.equal(fixture.asset1)
                      })

                      /* Validate ASSET-2 */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET2 + END_TRADE_BLOTTER_TM_ROW).then(asset2 => {
                        expect(asset2.text(), "Asset2 must be equal to " + fixture.asset2).to.be.equal(fixture.asset2)
                      })

                      cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS, Y_AXIS).wait(LOW)

                      /* Validate  TIF */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.TIF + END_TRADE_BLOTTER_TM_ROW).then(tif => {
                        expect(tif.text(), "TIF must be equal to GTC").to.be.equal(GTC_TIF)
                      })

                      cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS_START, Y_AXIS_START).wait(LOW)

                      /* Get trader balances after operation */

                      cy.getTraderBalanceWithToken(fixture.custodian, user_tm, token).then(traderBalancesAfter => {
                        const totalBalanceTraderAfter = [traderBalancesAfter[fixture.asset1].total, traderBalancesAfter[fixture.asset2].total]

                        cy.logMessage('User: ' + user_tm.USER + '_')
                        cy.logMessage('Balance after operation Asset ' + fixture.asset1 + " = " + totalBalanceTraderAfter[ASSET_1])
                        cy.logMessage('Balance after operation Asset ' + fixture.asset2 + " = " + totalBalanceTraderAfter[ASSET_2])
                        cy.task('setTotalBalanceTraderAfter', totalBalanceTraderAfter)

                        cy.task('getTotalBalanceTraderBefore').then(totalTraderBalanceBefore => {
                          cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.FILLED + END_TRADE_BLOTTER_TM_ROW).then(filled => {
                            cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.QTY_2 + END_TRADE_BLOTTER_TM_ROW).then(qty_2 => {
                              let decimalQty2 = new DecimalQty2(parseFloat(qty_2.text().replaceAll(LEFT_PARENTHESIS, NO_CHARACTER).replaceAll(RIGHT_PARENTHESIS, NO_CHARACTER).replaceAll(COMMA, NO_CHARACTER))).toNumber()
                              let decimalFilled = new Decimal(parseFloat(filled.text().replaceAll(LEFT_PARENTHESIS, NO_CHARACTER).replaceAll(RIGHT_PARENTHESIS, NO_CHARACTER).replaceAll(COMMA, NO_CHARACTER))).toNumber()
                              expect((totalBalanceTraderAfter[ASSET_1]).toFixed(DECIMAL_PLACES), "Balance for Asset: " + fixture.asset1 + " after operation is equal to balance before operation plus filled.").to.equal((totalTraderBalanceBefore[ASSET_1] + decimalFilled).toFixed(DECIMAL_PLACES))
                              let operationValidation = (parseFloat(truncateNumber(totalBalanceTraderAfter[ASSET_2], 2)) - (parseFloat(truncateNumber(totalTraderBalanceBefore[ASSET_2], 2)) - decimalQty2.toFixed(DECIMAL_PLACES_QTY2)))
                              let assert = false
                              if ((Math.round(operationValidation * 100) / 100) <= 0.01 && (Math.round(operationValidation * 100) / 100) >= -0.01) {
                                assert = true
                              }
                              expect(assert, "Balance for Asset: " + fixture.asset2 + " after operation is equal to balance before operation minus qty2.").to.equal(true)
                            })
                          })
                        })
                      })
                      // TODO: See ticket: https://bosonic.atlassian.net/browse/QAT-568
                      cy.logout().wait(MEDIUM)
                    } else {
                      /* If the status is diferent to PARTFILL-CONFIRMED, we validate if the message is IOC Expired and the filled = 0 
                       * Next, we try to match another order
                       */
                      expect(filled.text(), "Filled is 0.00").to.be.equal(NOTHING_FILLED)
                      cy.logout().wait(MEDIUM)
                      cy.tradeBidGtc(areaOfTheBook, fixture, url_tm, user_tm)
                    }
                  })
                })
              })
            }

            break;
          }

          cy.task('getBooleanValue').then(value => {
            expect(value, "LM ORDER EXIST IN TRADE BLOTTER WIDGET.").to.equal(true)
          })
        })
      })
    })
  })
})

/**
 * Make a GTC LM OFFER trade and validate
 * @param {String} areaOfTheBook
 * @param {Json} fixture 
 * @param {String} url_tm
 * @param {Json} user_tm
 */

Cypress.Commands.add('tradeOfferGtc', (areaOfTheBook, fixture, url_tm, user_tm) => {

  /* Const Interceptor */
  const interceptorTradeLm = url_tm + "rest/lmorder"
  const interceptorTradeBlotterWidget = url_tm + "rest/lmorder/queryAll?**"

  cy.intercept(BosonicUI.REQUEST_POST, interceptorTradeLm).as('tradeLm')

  cy.loginAndDescription(url_tm, user_tm)

  /* Decrease the Memory use */
  cy.decreaseMemoryUse()

  /* Get token from API */
  cy.getRequestToken(url_tm, user_tm).as('token')

  /* Get token from API */
  cy.get('@token').then((token) => {

    /* Get balances trader before operation */

    cy.getTraderBalanceWithToken(fixture.custodian, user_tm, token).then(traderBalancesBefore => {
      const totalBalanceTraderBefore = [traderBalancesBefore[fixture.asset1].total, traderBalancesBefore[fixture.asset2].total]

      cy.logMessage('User: ' + user_tm.USER)
      cy.logMessage('Balance before operation Asset ' + fixture.asset1 + " = " + totalBalanceTraderBefore[ASSET_1])
      cy.logMessage('Balance before operation Asset ' + fixture.asset2 + " = " + totalBalanceTraderBefore[ASSET_2])
      cy.task('setTotalBalanceTraderBefore', totalBalanceTraderBefore)
    })

    /* Close all the Rates Panel */
    cy.xpath(RATE_PANEL.CLOSE_BUTTON).click({ multiple: true })

    /* If there are open orders, these are cancelled */
    cy.cancelAllOpenOrders()

    /* Add Rate Panel */
    cy.get(RATES_PANEL.ASSET_LIST).contains(fixture.symbol).parent().click({ force: true }).wait(LOW)
    cy.get(RATE_PANEL.ASSET_TITLE).contains(fixture.symbol).scrollIntoView().should('be.visible')

    cy.wait(MEDIUM)

    /* First check if there are prices in the order book */
    /* We get the book's quantity of rows */
    cy.xpath('count(' + RATE_PANEL.ALL_SELL_BOOK_ROWS + ')').then($elements => {
      expect($elements, "THERE'S LIQUIDITY: The levels in the order book (sell side) must be at least 1").at.least(1)
    }).wait(HIGH)

    /* Here, click at the Book */
    let quantityRows = 0

    switch (areaOfTheBook) {

      case TOP:
        /* Select the kind of operation */
        cy.contains(RATE_PANEL.OFFER_BTN).click().wait(LOW)
        /* Here, click at the TOB */
        cy.xpath(RATE_PANEL.IOC_SELL_FIRST_PART + fixture.asset1 + RATE_PANEL.IOC_SELL_SECOND_PART).click({ force: true }).wait(MEDIUM)
        /* Adding 5% to price to match faster */
        cy.xpath(RATE_PANEL.PRICE_XPATH).invoke('attr', 'value').as('value').then($price => {
          let price = parseFloat($price.replaceAll(',', ''))
          price -= (price * PERCENTAGE_TO_ADD)
          cy.xpath(RATE_PANEL.PRICE_XPATH).clear().type(price.toFixed(2))
        }).wait(LOW)
        /* Round to 2 decimals the amount */
        cy.xpath(RATE_PANEL.AMOUNT_XPATH).invoke('attr', 'value').as('value').then($amount => {
          let amount = parseFloat($amount.replaceAll(',', ''))
          cy.xpath(RATE_PANEL.AMOUNT_XPATH).clear().type(amount.toFixed(2))
        }).wait(LOW)
        /* Here send the order */
        cy.contains(RATE_PANEL.SEND_BTN).click().wait(LOW)
        cy.wait(EXTRA)
        break

      case MIDDLE:
        /* Select the kind of operation */
        cy.contains(RATE_PANEL.OFFER_BTN).click().wait(LOW)
        /* Here, click at the MOB operation */
        /* First, we get the book's quantity of rows to calculate the middle of the this */
        cy.xpath(RATE_PANEL.ALL_SELL_BOOK_ROWS).then($elements => {
          quantityRows = $elements.length;
          let middleOfTheBook = Math.floor(quantityRows / TWO)
          if (middleOfTheBook == 0) {
            middleOfTheBook = 1
          }
          cy.xpath(LEFT_PARENTHESIS + RATE_PANEL.SELL_BOOK_ROWS + RIGHT_PARENTHESIS + LEFT_BRACKET + middleOfTheBook + RIGHT_BRACKET).click({ force: true }).wait(MEDIUM)
          /* Adding 5% to price to match faster */
          cy.xpath(RATE_PANEL.PRICE_XPATH).invoke('attr', 'value').as('value').then($price => {
            let price = parseFloat($price.replaceAll(',', ''))
            price -= (price * PERCENTAGE_TO_ADD)
            cy.xpath(RATE_PANEL.PRICE_XPATH).clear().type(price.toFixed(2))
          }).wait(LOW)
          /* Round to 2 decimals the amount */
          cy.xpath(RATE_PANEL.AMOUNT_XPATH).invoke('attr', 'value').as('value').then($amount => {
            let amount = parseFloat($amount.replaceAll(',', ''))
            cy.xpath(RATE_PANEL.AMOUNT_XPATH).clear().type(amount.toFixed(2))
          }).wait(LOW)
          /* Here send the order */
          cy.contains(RATE_PANEL.SEND_BTN).click().wait(LOW)
          cy.wait(EXTRA)
        }).wait(EXTRA)
        break

      case BOTTOM:
        /* Select the kind of operation */
        cy.contains(RATE_PANEL.OFFER_BTN).click().wait(LOW)
        /* Here, click at the BOB operation */
        /* First, we get the book's quantity of rows to calculate the middle of the this */
        cy.xpath(RATE_PANEL.ALL_SELL_BOOK_ROWS).then($elements => {
          quantityRows = $elements.length;
          cy.xpath(LEFT_PARENTHESIS + RATE_PANEL.SELL_BOOK_ROWS + RIGHT_PARENTHESIS + LEFT_BRACKET + quantityRows + RIGHT_BRACKET).click({ force: true }).wait(MEDIUM)
          /* Adding 5% to price to match faster */
          cy.xpath(RATE_PANEL.PRICE_XPATH).invoke('attr', 'value').as('value').then($price => {
            let price = parseFloat($price.replaceAll(',', ''))
            price -= (price * PERCENTAGE_TO_ADD)
            cy.xpath(RATE_PANEL.PRICE_XPATH).clear().type(price.toFixed(2))
          }).wait(LOW)
          /* Round to 2 decimals the amount */
          cy.xpath(RATE_PANEL.AMOUNT_XPATH).invoke('attr', 'value').as('value').then($amount => {
            let amount = parseFloat($amount.replaceAll(',', ''))
            cy.xpath(RATE_PANEL.AMOUNT_XPATH).clear().type(amount.toFixed(2))
          }).wait(LOW)
          /* Here send the order */
          cy.contains(RATE_PANEL.SEND_BTN).click().wait(LOW)
          cy.wait(EXTRA)
        }).wait(EXTRA)
        break

    }

    cy.wait('@tradeLm').then(interceptTradeLm => {
      const clOrdId = interceptTradeLm.response.body.clOrdId

      cy.task('setClOrdId', clOrdId)

      cy.task('getClOrdId').then(clOrdIdSaved => {
        cy.intercept(BosonicUI.REQUEST_GET, interceptorTradeBlotterWidget).as('tradeBlotter')

        cy.xpath(TRADE_BLOTTER.CLOSE_WIDGET).click().wait(LOW)
        cy.addWidget(TRADE_BLOTTER.NAME, 500, 750).wait(STANDARD)
        cy.xpath(TRADE_BLOTTER.BTN_MAXIMIZE_WIDGET).click()

        /* Validate the Trade Blotter */
        cy.task('setBooleanValue', false)

        cy.wait('@tradeBlotter').then($tradeBlotter => {

          for (let row = 0; row < 10; row++) {
            const clOrdIdRow = $tradeBlotter.response.body.data[row].clOrdId

            if (clOrdIdRow == clOrdIdSaved) {
              cy.task('setBooleanValue', true)

              /* Validate the Trade Blotter */
              cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.STATUS + END_TRADE_BLOTTER_TM_ROW).then(status => {
                cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.FILLED + END_TRADE_BLOTTER_TM_ROW).then(filled => {
                  cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS, Y_AXIS).wait(LOW)
                  cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.MESSAGE + END_TRADE_BLOTTER_TM_ROW).then(message => {
                    cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS_START, Y_AXIS_START).wait(LOW)
                    /* If status = 'PARTFILL-CONFIRMED' we continue with the test, else, we need try to match another order */
                    if (status.text() == PARTFILL_CONFIRMED) {
                      /* Validate Status */
                      expect(status.text(), "Status must be equal to 'PARTFILL-CONFIRMED'").to.be.equal(PARTFILL_CONFIRMED)

                      /* Validate SIDE */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.SIDE + END_TRADE_BLOTTER_TM_ROW).then(side => {
                        expect(side.text(), "Side must be equal to 'BUY'").to.be.equal(SELL_SIDE)
                      })

                      /* Validate ASSET PAIR */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET_PAIR + END_TRADE_BLOTTER_TM_ROW).then(asset_pair => {
                        expect(asset_pair.text(), "Asset Pair must be equal to " + fixture.symbol).to.be.equal(fixture.symbol)
                      })

                      /* Validate ASSET-1 */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET1 + END_TRADE_BLOTTER_TM_ROW).then(asset1 => {
                        expect(asset1.text(), "Asset1 must be equal to " + fixture.asset1).to.be.equal(fixture.asset1)
                      })

                      /* Validate ASSET-2 */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET2 + END_TRADE_BLOTTER_TM_ROW).then(asset2 => {
                        expect(asset2.text(), "Asset2 must be equal to " + fixture.asset2).to.be.equal(fixture.asset2)
                      })

                      cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS, Y_AXIS).wait(LOW)

                      /* Validate  TIF */
                      cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.TIF + END_TRADE_BLOTTER_TM_ROW).then(tif => {
                        expect(tif.text(), "TIF must be equal to GTC").to.be.equal(GTC_TIF)
                      })

                      cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS_START, Y_AXIS_START).wait(LOW)

                      /* Get trader balances after operation */

                      cy.getTraderBalanceWithToken(fixture.custodian, user_tm, token).then(traderBalancesAfter => {
                        const totalBalanceTraderAfter = [traderBalancesAfter[fixture.asset1].total, traderBalancesAfter[fixture.asset2].total]

                        cy.logMessage('User: ' + user_tm.USER + '_')
                        cy.logMessage('Balance after operation Asset ' + fixture.asset1 + " = " + totalBalanceTraderAfter[ASSET_1])
                        cy.logMessage('Balance after operation Asset ' + fixture.asset2 + " = " + totalBalanceTraderAfter[ASSET_2])
                        cy.task('setTotalBalanceTraderAfter', totalBalanceTraderAfter)

                        cy.task('getTotalBalanceTraderBefore').then(totalTraderBalanceBefore => {
                          cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.FILLED + END_TRADE_BLOTTER_TM_ROW).then(filled => {
                            cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.QTY_2 + END_TRADE_BLOTTER_TM_ROW).then(qty_2 => {
                              let decimalQty2 = new DecimalQty2(parseFloat(qty_2.text().replaceAll(LEFT_PARENTHESIS, NO_CHARACTER).replaceAll(RIGHT_PARENTHESIS, NO_CHARACTER).replaceAll(COMMA, NO_CHARACTER))).toNumber()
                              let decimalFilled = new Decimal(parseFloat(filled.text().replaceAll(LEFT_PARENTHESIS, NO_CHARACTER).replaceAll(RIGHT_PARENTHESIS, NO_CHARACTER).replaceAll(COMMA, NO_CHARACTER))).toNumber()
                              expect((totalBalanceTraderAfter[ASSET_1]).toFixed(DECIMAL_PLACES), "Balance for Asset: " + fixture.asset1 + " after operation is equal to balance before operation minus filled.").to.equal((totalTraderBalanceBefore[ASSET_1] - decimalFilled).toFixed(DECIMAL_PLACES))
                              let operationValidation = (parseFloat(truncateNumber(totalBalanceTraderAfter[ASSET_2], 2)) - (parseFloat(truncateNumber(totalTraderBalanceBefore[ASSET_2], 2)) + parseFloat(decimalQty2.toFixed(DECIMAL_PLACES_QTY2))))
                              let assert = false
                              if ((Math.round(operationValidation * 100) / 100) <= 0.01 && (Math.round(operationValidation * 100) / 100) >= -0.01) {
                                assert = true
                              }
                              expect(assert, "Balance for Asset: " + fixture.asset2 + " after operation is equal to balance before operation plus qty2.").to.equal(true)
                            })
                          })
                        })
                      })
                      // TODO: See ticket: https://bosonic.atlassian.net/browse/QAT-568
                      cy.logout().wait(MEDIUM)
                    } else {
                      /* If the status is diferent to PARTFILL-CONFIRMED, we validate if the message is IOC Expired and the filled = 0 
                       * Next, we try to match another order
                       */
                      expect(filled.text(), "Filled is 0.00").to.be.equal(NOTHING_FILLED)
                      cy.logout().wait(MEDIUM)
                      cy.tradeOfferGtc(areaOfTheBook, fixture, url_tm, user_tm)
                    }
                  })
                })
              })

            }

            break;
          }

          cy.task('getBooleanValue').then(value => {
            expect(value, "LM ORDER EXIST IN TRADE BLOTTER WIDGET.").to.equal(true)
          })
        })
      })
    })
  })
})

/**
 * Make a GTC LM BID trade to validate and check decimal precision 
 * @param {Json} fixture 
 * @param {String} url_tm
 * @param {Json} user_tm
 */

Cypress.Commands.add('tradeBidGtcWithDecimalPrecision', (fixture, url_tm, user_tm) => {

  /* Const Interceptor */
  const interceptorTradeLm = url_tm + "rest/lmorder"
  const interceptorTradeBlotterWidget = url_tm + "rest/lmorder/queryAll?**"

  cy.intercept(BosonicUI.REQUEST_POST, interceptorTradeLm).as('tradeLm')

  cy.loginAndDescription(url_tm, user_tm)

  /* Decrease the Memory use */
  cy.decreaseMemoryUse()

  /* Get token from API */
  cy.getRequestToken(url_tm, user_tm).as('token')

  /* Get token from API */
  cy.get('@token').then((token) => {

    /* Get balances trader before operation */

    cy.getTraderBalanceWithToken(fixture.custodian, user_tm, token).then(traderBalancesBefore => {
      const totalBalanceTraderBefore = [traderBalancesBefore[fixture.asset1].total, traderBalancesBefore[fixture.asset2].total]

      cy.logMessage('User: ' + url_tm.USER)
      cy.logMessage('Balance before operation Asset ' + fixture.asset1 + " = " + totalBalanceTraderBefore[ASSET_1])
      cy.logMessage('Balance before operation Asset ' + fixture.asset2 + " = " + totalBalanceTraderBefore[ASSET_2])
      cy.task('setTotalBalanceTraderBefore', totalBalanceTraderBefore)
    })

    /* Close all the Rates Panel */
    cy.xpath(RATE_PANEL.CLOSE_BUTTON).click({ multiple: true })

    /* If there are open orders, these are cancelled */
    cy.cancelAllOpenOrders()

    /* Add Rate Panel */
    cy.get(RATES_PANEL.ASSET_LIST).contains(fixture.symbol).parent().click({ force: true }).wait(LOW)
    cy.get(RATE_PANEL.ASSET_TITLE).contains(fixture.symbol).scrollIntoView().should('be.visible')

    cy.wait(MEDIUM)

    /* First check if there are prices in the order book */
    /* We get the book's quantity of rows */
    cy.xpath('count(' + RATE_PANEL.ALL_BUY_BOOK_ROWS + ')').then($elements => {
      expect($elements, "THERE'S LIQUIDITY: The levels in the order book (buy side) must be at least 1").at.least(1)
    }).wait(HIGH)

    /* Here, click at the TOB */
    cy.xpath(RATE_PANEL.IOC_BUY_FIRST_PART + fixture.asset1 + RATE_PANEL.IOC_BUY_SECOND_PART).click({ force: true }).wait(MEDIUM)

    /* Type the amount */
    cy.xpath(RATE_PANEL.AMOUNT_XPATH).clear().type(fixture.amount)

    /* Type the price */
    cy.xpath(RATE_PANEL.PRICE_XPATH).clear().type(fixture.buy_price)

    /* Here send the order */
    cy.contains(RATE_PANEL.SEND_BTN).click()
    cy.wait(EXTRA)

    cy.wait('@tradeLm').then(interceptTradeLm => {
      const clOrdId = interceptTradeLm.response.body.clOrdId

      cy.task('setClOrdId', clOrdId)

      cy.task('getClOrdId').then(clOrdIdSaved => {

        cy.intercept(BosonicUI.REQUEST_GET, interceptorTradeBlotterWidget).as('tradeBlotter')

        cy.xpath(TRADE_BLOTTER.CLOSE_WIDGET).click().wait(LOW)
        cy.addWidget(TRADE_BLOTTER.NAME, 500, 750).wait(STANDARD)
        cy.xpath(TRADE_BLOTTER.BTN_MAXIMIZE_WIDGET).click()

        /* Validate the Trade Blotter */
        cy.task('setBooleanValue', false)

        cy.wait('@tradeBlotter').then($tradeBlotter => {

          for (let row = 0; row < 10; row++) {
            const clOrdIdRow = $tradeBlotter.response.body.data[row].clOrdId

            if (clOrdIdRow == clOrdIdSaved) {
              cy.task('setBooleanValue', true)

              /* Validate the Trade Blotter */
              cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.STATUS + END_TRADE_BLOTTER_TM_ROW).then(status => {
                cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.FILLED + END_TRADE_BLOTTER_TM_ROW).then(filled => {
                  cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS, Y_AXIS).wait(LOW)
                  cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.MESSAGE + END_TRADE_BLOTTER_TM_ROW).then(message => {
                    cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS_START, Y_AXIS_START).wait(LOW)

                    /* Validate Status */
                    expect(status.text(), "Status must be equal to 'PARTFILL-CONFIRMED'").to.be.equal(PARTFILL_CONFIRMED)

                    /* Validate SIDE */
                    cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.SIDE + END_TRADE_BLOTTER_TM_ROW).then(side => {
                      expect(side.text(), "Side must be equal to 'BUY'").to.be.equal(BUY_SIDE)
                    })

                    /* Validate ASSET PAIR */
                    cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET_PAIR + END_TRADE_BLOTTER_TM_ROW).then(asset_pair => {
                      expect(asset_pair.text(), "Asset Pair must be equal to " + fixture.symbol).to.be.equal(fixture.symbol)
                    })

                    /* Validate ASSET-1 */
                    cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET1 + END_TRADE_BLOTTER_TM_ROW).then(asset1 => {
                      expect(asset1.text(), "Asset1 must be equal to " + fixture.asset1).to.be.equal(fixture.asset1)
                    })

                    /* Validate ASSET-2 */
                    cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET2 + END_TRADE_BLOTTER_TM_ROW).then(asset2 => {
                      expect(asset2.text(), "Asset2 must be equal to " + fixture.asset2).to.be.equal(fixture.asset2)
                    })

                    cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS, Y_AXIS).wait(LOW)

                    /* Validate  TIF */
                    cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.TIF + END_TRADE_BLOTTER_TM_ROW).then(tif => {
                      expect(tif.text(), "TIF must be equal to GTC").to.be.equal(GTC_TIF)
                    })

                    cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS_START, Y_AXIS_START).wait(LOW)

                    /* Get trader balances after operation */

                    cy.getTraderBalanceWithToken(fixture.custodian, user_tm, token).then(traderBalancesAfter => {
                      const totalBalanceTraderAfter = [traderBalancesAfter[fixture.asset1].total, traderBalancesAfter[fixture.asset2].total]

                      cy.logMessage('User: ' + user_tm.USER + '_')
                      cy.logMessage('Balance after operation Asset ' + fixture.asset1 + " = " + totalBalanceTraderAfter[ASSET_1])
                      cy.logMessage('Balance after operation Asset ' + fixture.asset2 + " = " + totalBalanceTraderAfter[ASSET_2])
                      cy.task('setTotalBalanceTraderAfter', totalBalanceTraderAfter)

                      cy.task('getTotalBalanceTraderBefore').then(totalTraderBalanceBefore => {
                        cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.FILLED + END_TRADE_BLOTTER_TM_ROW).then(filled => {
                          cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.QTY_2 + END_TRADE_BLOTTER_TM_ROW).then(qty_2 => {
                            let decimalQty2 = new DecimalQty2(parseFloat(qty_2.text().replaceAll(LEFT_PARENTHESIS, NO_CHARACTER).replaceAll(RIGHT_PARENTHESIS, NO_CHARACTER).replaceAll(COMMA, NO_CHARACTER))).toNumber()
                            let decimalFilled = new Decimal(parseFloat(filled.text().replaceAll(LEFT_PARENTHESIS, NO_CHARACTER).replaceAll(RIGHT_PARENTHESIS, NO_CHARACTER).replaceAll(COMMA, NO_CHARACTER))).toNumber()
                            expect((totalBalanceTraderAfter[ASSET_1]).toFixed(DECIMAL_PLACES), "Balance for Asset: " + fixture.asset1 + " after operation is equal to balance before operation plus filled.").to.equal((totalTraderBalanceBefore[ASSET_1] + decimalFilled).toFixed(DECIMAL_PLACES))
                            let operationValidation = (parseFloat(truncateNumber(totalBalanceTraderAfter[ASSET_2], 2)) - (parseFloat(truncateNumber(totalTraderBalanceBefore[ASSET_2], 2)) - decimalQty2.toFixed(DECIMAL_PLACES_QTY2)))
                            let assert = false
                            if ((Math.round(operationValidation * 100) / 100) <= 0.01 && (Math.round(operationValidation * 100) / 100) >= -0.01) {
                              assert = true
                            }
                            expect(assert, "Balance for Asset: " + fixture.asset2 + " after operation is equal to balance before operation minus qty2.").to.equal(true)
                          })
                        })
                      })
                    })
                    // TODO: See ticket: https://bosonic.atlassian.net/browse/QAT-568
                    cy.logout().wait(MEDIUM)
                  })
                })
              })
            }

            break;
          }

          cy.task('getBooleanValue').then(value => {
            expect(value, "LM ORDER EXIST IN TRADE BLOTTER WIDGET.").to.equal(true)
          })

        })
      })
    })
  })
})

/**
 * Make a GTC LM OFFER trade to validate and check decimal precision 
 * @param {Json} fixture 
 * @param {String} url_tm
 * @param {Json} user_tm
 */

Cypress.Commands.add('tradeOfferGtcWithDecimalPrecision', (fixture, url_tm, user_tm) => {

  /* Const Interceptor */
  const interceptorTradeLm = url_tm + "rest/lmorder"
  const interceptorTradeBlotterWidget = url_tm + "rest/lmorder/queryAll?**"

  cy.intercept(BosonicUI.REQUEST_POST, interceptorTradeLm).as('tradeLm')

  cy.loginAndDescription(url_tm, user_tm)

  /* Decrease the Memory use */
  cy.decreaseMemoryUse()

  /* Get token from API */
  cy.getRequestToken(url_tm, user_tm).as('token')

  /* Get token from API */
  cy.get('@token').then((token) => {

    /* Get balances trader before operation */

    cy.getTraderBalanceWithToken(fixture.custodian, user_tm, token).then(traderBalancesBefore => {
      const totalBalanceTraderBefore = [traderBalancesBefore[fixture.asset1].total, traderBalancesBefore[fixture.asset2].total]

      cy.logMessage('User: ' + user_tm.USER)
      cy.logMessage('Balance before operation Asset ' + fixture.asset1 + " = " + totalBalanceTraderBefore[ASSET_1])
      cy.logMessage('Balance before operation Asset ' + fixture.asset2 + " = " + totalBalanceTraderBefore[ASSET_2])
      cy.task('setTotalBalanceTraderBefore', totalBalanceTraderBefore)
    })

    /* Close all the Rates Panel */
    cy.xpath(RATE_PANEL.CLOSE_BUTTON).click({ multiple: true })

    /* If there are open orders, these are cancelled */
    cy.cancelAllOpenOrders()

    /* Add Rate Panel */
    cy.get(RATES_PANEL.ASSET_LIST).contains(fixture.symbol).parent().click({ force: true }).wait(LOW)
    cy.get(RATE_PANEL.ASSET_TITLE).contains(fixture.symbol).scrollIntoView().should('be.visible')

    cy.wait(MEDIUM)

    /* Select the kind of operation */
    cy.contains(RATE_PANEL.OFFER_BTN).click().wait(LOW)

    /* First check if there are prices in the order book */
    /* We get the book's quantity of rows */
    cy.xpath('count(' + RATE_PANEL.ALL_SELL_BOOK_ROWS + ')').then($elements => {
      expect($elements, "THERE'S LIQUIDITY: The levels in the order book (sell side) must be at least 1").at.least(1)
    }).wait(HIGH)

    /* Here, click at the TOB */
    cy.xpath(RATE_PANEL.IOC_SELL_FIRST_PART + fixture.asset1 + RATE_PANEL.IOC_SELL_SECOND_PART).click({ force: true }).wait(MEDIUM)

    /* Type the amount */
    cy.xpath(RATE_PANEL.AMOUNT_XPATH).clear().type(fixture.amount)

    /* Type the price */
    cy.xpath(RATE_PANEL.PRICE_XPATH).clear().type(fixture.sell_price)

    /* Here send the order */
    cy.contains(RATE_PANEL.SEND_BTN).click().wait(LOW)
    cy.wait(EXTRA)


    cy.wait('@tradeLm').then(interceptTradeLm => {
      const clOrdId = interceptTradeLm.response.body.clOrdId

      cy.task('setClOrdId', clOrdId)

      cy.task('getClOrdId').then(clOrdIdSaved => {
        cy.log("THIS IS THE CLORDID: ===========>>>>>>>>>>   " + clOrdIdSaved)

        cy.intercept(BosonicUI.REQUEST_GET, interceptorTradeBlotterWidget).as('tradeBlotter')

        cy.xpath(TRADE_BLOTTER.CLOSE_WIDGET).click().wait(LOW)
        cy.addWidget(TRADE_BLOTTER.NAME, 500, 750).wait(STANDARD)
        cy.xpath(TRADE_BLOTTER.BTN_MAXIMIZE_WIDGET).click()

        /* Validate the Trade Blotter */
        cy.task('setBooleanValue', false)

        cy.wait('@tradeBlotter').then($tradeBlotter => {
          cy.log("THIS IS TRADE BLOTTER RESPONSE: " + JSON.stringify($tradeBlotter))

          for (let row = 0; row < 10; row++) {
            const clOrdIdRow = $tradeBlotter.response.body.data[row].clOrdId

            if (clOrdIdRow == clOrdIdSaved) {

              cy.task('setBooleanValue', true)

              /* Validate the Trade Blotter */

              cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.STATUS + END_TRADE_BLOTTER_TM_ROW).then(status => {
                cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.FILLED + END_TRADE_BLOTTER_TM_ROW).then(filled => {
                  cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS, Y_AXIS).wait(LOW)
                  cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.MESSAGE + END_TRADE_BLOTTER_TM_ROW).then(message => {
                    cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS_START, Y_AXIS_START).wait(LOW)

                    /* Validate Status */
                    expect(status.text(), "Status must be equal to 'PARTFILL-CONFIRMED'").to.be.equal(PARTFILL_CONFIRMED)

                    /* Validate SIDE */
                    cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.SIDE + END_TRADE_BLOTTER_TM_ROW).then(side => {
                      expect(side.text(), "Side must be equal to 'BUY'").to.be.equal(SELL_SIDE)
                    })

                    /* Validate ASSET PAIR */
                    cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET_PAIR + END_TRADE_BLOTTER_TM_ROW).then(asset_pair => {
                      expect(asset_pair.text(), "Asset Pair must be equal to " + fixture.symbol).to.be.equal(fixture.symbol)
                    })

                    /* Validate ASSET-1 */
                    cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET1 + END_TRADE_BLOTTER_TM_ROW).then(asset1 => {
                      expect(asset1.text(), "Asset1 must be equal to " + fixture.asset1).to.be.equal(fixture.asset1)
                    })

                    /* Validate ASSET-2 */
                    cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.ASSET2 + END_TRADE_BLOTTER_TM_ROW).then(asset2 => {
                      expect(asset2.text(), "Asset2 must be equal to " + fixture.asset2).to.be.equal(fixture.asset2)
                    })

                    cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS, Y_AXIS).wait(LOW)

                    /* Validate  TIF */
                    cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.TIF + END_TRADE_BLOTTER_TM_ROW).then(tif => {
                      expect(tif.text(), "TIF must be equal to GTC").to.be.equal(GTC_TIF)
                    })

                    cy.dragAndDrop(TRADE_BLOTTER_SCROLL_BAR_HORIZONTAL, X_AXIS_START, Y_AXIS_START).wait(LOW)

                    /* Get trader balances after operation */

                    cy.getTraderBalanceWithToken(fixture.custodian, user_tm, token).then(traderBalancesAfter => {
                      const totalBalanceTraderAfter = [traderBalancesAfter[fixture.asset1].total, traderBalancesAfter[fixture.asset2].total]

                      cy.logMessage('User: ' + user_tm.USER + '_')
                      cy.logMessage('Balance after operation Asset ' + fixture.asset1 + " = " + totalBalanceTraderAfter[ASSET_1])
                      cy.logMessage('Balance after operation Asset ' + fixture.asset2 + " = " + totalBalanceTraderAfter[ASSET_2])
                      cy.task('setTotalBalanceTraderAfter', totalBalanceTraderAfter)

                      cy.task('getTotalBalanceTraderBefore').then(totalTraderBalanceBefore => {
                        cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.FILLED + END_TRADE_BLOTTER_TM_ROW).then(filled => {
                          cy.xpath(START_TRADE_BLOTTER_TM_ROW + row + MIDDLE_TRADE_BLOTTER_TM_ROW + TRADE_BLOTTER.COLUMN.QTY_2 + END_TRADE_BLOTTER_TM_ROW).then(qty_2 => {
                            let decimalQty2 = new DecimalQty2(parseFloat(qty_2.text().replaceAll(LEFT_PARENTHESIS, NO_CHARACTER).replaceAll(RIGHT_PARENTHESIS, NO_CHARACTER).replaceAll(COMMA, NO_CHARACTER))).toNumber()
                            let decimalFilled = new Decimal(parseFloat(filled.text().replaceAll(LEFT_PARENTHESIS, NO_CHARACTER).replaceAll(RIGHT_PARENTHESIS, NO_CHARACTER).replaceAll(COMMA, NO_CHARACTER))).toNumber()
                            expect((totalBalanceTraderAfter[ASSET_1]).toFixed(DECIMAL_PLACES), "Balance for Asset: " + fixture.asset1 + " after operation is equal to balance before operation minus filled.").to.equal((totalTraderBalanceBefore[ASSET_1] - decimalFilled).toFixed(DECIMAL_PLACES))
                            let operationValidation = (parseFloat(truncateNumber(totalBalanceTraderAfter[ASSET_2], 2)) - (parseFloat(truncateNumber(totalTraderBalanceBefore[ASSET_2], 2)) + parseFloat(decimalQty2.toFixed(DECIMAL_PLACES_QTY2))))
                            let assert = false
                            if ((Math.round(operationValidation * 100) / 100) <= 0.01 && (Math.round(operationValidation * 100) / 100) >= -0.01) {
                              assert = true
                            }
                            expect(assert, "Balance for Asset: " + fixture.asset2 + " after operation is equal to balance before operation plus qty2.").to.equal(true)
                          })
                        })
                      })
                    })
                    // TODO: See ticket: https://bosonic.atlassian.net/browse/QAT-568
                    cy.logout().wait(MEDIUM)
                  })
                })
              })
            }

            break;
          }

          cy.task('getBooleanValue').then(value => {
            expect(value, "LM ORDER EXIST IN TRADE BLOTTER WIDGET.").to.equal(true)
          })
        })
      })
    })


  })
})

/* Functions */
let truncateNumber = (number, decimals) => {
  let s = number.toString()
  let decimalLength = s.indexOf('.') + 1
  let numStr = s.substr(0, decimalLength + decimals)
  return Number(numStr)
}