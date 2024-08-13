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
 * Date: 15/05/23 2:11
 * Author(s): Diego Graf
 * -----
 * Last Modified: 14/06/2023
 * Modified By: Diego Graf
 * -----
 * 
 */

let Decimal = require('decimal.js-light');
Decimal.config({
  precision: 6,
})

let DecimalQty2 = require('decimal.js-light');
DecimalQty2.config({
  precision: 2,
})

const ConstBosonic = require('../../support/bosonic.constants')

/* Decimal Places */
const TWO_DECIMAL_PLACES = 2

/* Array parts */
const FIRST_PART = 0
const SECOND_PART = 1
const THIRD_PART = 2

/* Status */
const SUCCESS = 'SUCCESS'

/* One digit time */
const ONE_DIGIT_DAY = 9
const ONE_DIGIT_MONTH = 9
const ONE_DIGIT_HOUR = 9

/* Posttrade types */
const EXCEL = 'excel'
const JENKINS_JOB = 'jenkins_job'
const REST = 'rest'

/* Widget Types */
const CENTRAL = 'CENTRAL'
const MAKER = 'MAKER'

/* Length */
const ID_LENGTH = 13

/**
 * Validate Post Trade Widget
 * @param {String} WIDGET_URL
 * @param {Json} WIDGET_USER 
 * @param {String} WIDGET_TYPE
 * @param {Json} USER_MAKER
 * @param {Json} USER_TAKER
 * @param {Json} FIXTURE
 * @param {String} POSTTRADE_TYPE
 */

Cypress.Commands.add('validatePostTradeWidget', (WIDGET_URL, WIDGET_USER, WIDGET_TYPE, USER_MAKER, USER_TAKER, FIXTURE, POSTTRADE_TYPE, FILE_ID) => {

  /* Widget */
  let POST_TRADES

  /* Characters to split */
  let ROW_SPLIT_FIRST_PART
  let ROW_SPLIT_SECOND_PART = 'row'

  /* Side */
  let SIDE

  /* CPTY TRADER ID */
  let CPTY_TRADER_ID

  /* DEAL CODE USER */
  let DEAL_CODE_USER_APP

  /* TRADER ID */
  let TRADER_ID

  /* CPTY DEAL CODE */
  let CPTY_DEAL_CODE

  /* Create the needed variables */
  if (WIDGET_USER.APP.toUpperCase() == 'CENTRAL') {
    POST_TRADES = ConstBosonic.CENTRAL.WIDGETS.POST_TRADES
    ROW_SPLIT_FIRST_PART = 'CentralPostTradesBlotter'
    SIDE = 'BUY'
    CPTY_TRADER_ID = USER_TAKER.USER
    DEAL_CODE_USER_APP = USER_MAKER.APP.toUpperCase()
    TRADER_ID = USER_MAKER.USER
    CPTY_DEAL_CODE = USER_TAKER.APP.toUpperCase()
  } else {
    POST_TRADES = ConstBosonic.TRADER.WIDGETS.POST_TRADES
    ROW_SPLIT_FIRST_PART = 'PostTradesBlotter'
    if (WIDGET_TYPE == MAKER) {
      SIDE = 'BUY'
      CPTY_TRADER_ID = USER_TAKER.ALIAS
      DEAL_CODE_USER_APP = USER_MAKER.APP.toUpperCase()
      TRADER_ID = USER_MAKER.USER
      CPTY_DEAL_CODE = USER_TAKER.APP.toUpperCase()
    } else {
      SIDE = 'SELL'
      CPTY_TRADER_ID = USER_MAKER.ALIAS
      DEAL_CODE_USER_APP = USER_TAKER.APP.toUpperCase()
      TRADER_ID = USER_TAKER.USER
      CPTY_DEAL_CODE = USER_MAKER.APP.toUpperCase()
    }
  }

  cy.loginAndDescription(WIDGET_URL, WIDGET_USER)

  cy.addWidget(POST_TRADES.NAME, 250, 250)

  /* Maximize Widget */
  cy.xpath(POST_TRADES.MAXIMIZE_BTN).click()

  /* Select the row according to the type of post-trade */

  let rowid
  let columnToFind
  let currentOperationRowFirstPart
  let currentOperationRowSecondPart

  if (POSTTRADE_TYPE == REST) {
    rowid = FIXTURE.tradeReportId
    columnToFind = POST_TRADES.COLUMNS.FIX_MESSAGE
    currentOperationRowFirstPart = POST_TRADES.REST_CURRENT_OPERATION_ROW_FIRST_PART
    currentOperationRowSecondPart = POST_TRADES.REST_CURRENT_OPERATION_ROW_SECOND_PART
  } else if (POSTTRADE_TYPE == EXCEL || POSTTRADE_TYPE == JENKINS_JOB) {
    rowid = FIXTURE.fixMessage
    columnToFind = POST_TRADES.COLUMNS.FIX_MESSAGE
    currentOperationRowFirstPart = POST_TRADES.UPLOAD_CURRENT_OPERATION_ROW_FIRST_PART
    currentOperationRowSecondPart = POST_TRADES.UPLOAD_CURRENT_OPERATION_ROW_SECOND_PART
  }

  cy.findColumn(columnToFind, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {

    cy.xpath(currentOperationRowFirstPart + rowid + FILE_ID.toString() + currentOperationRowSecondPart).invoke('attr', 'id').then(elementId => {
      let id = elementId.split(ROW_SPLIT_FIRST_PART)[0]
      id = id.split(ROW_SPLIT_SECOND_PART)[1]
      cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)
      /* Validate the fields of the Post trades widget */

      /* DATE */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.DATE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.DATE_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.DATE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.DATE_SECOND_PART).then(date => {
          let transactTimeTaskName
          if (POSTTRADE_TYPE == REST) {
            transactTimeTaskName = 'getTransactTime'
          } else if (POSTTRADE_TYPE == EXCEL || POSTTRADE_TYPE == JENKINS_JOB) {
            transactTimeTaskName = 'getAtMostTransactTime'
          }
          cy.task(transactTimeTaskName).then(transactTime => {
            let dateFormat = new Date(transactTime)
            let day = (dateFormat.getDate() <= ONE_DIGIT_DAY) ? '0' + dateFormat.getDate() : dateFormat.getDate()
            let month = (dateFormat.getMonth() <= ONE_DIGIT_MONTH) ? '0' + (dateFormat.getMonth() + 1) : dateFormat.getMonth() + 1
            let year = dateFormat.getFullYear()
            let completeDate = month + "/" + day + "/" + year
            expect(date.text(), "Validate 'DATE'").to.equal(completeDate)
          })
        })
      })

      /* TIME */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.TIME_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.TIME_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.DATE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.DATE_SECOND_PART).then(date => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.TIME_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.TIME_SECOND_PART).then(time => {
            if (POSTTRADE_TYPE == REST) {
              cy.task('getTransactTime').then(transactTime => {
                let timeFormat = new Date(transactTime)
                let localTimeString = timeFormat.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
                let hours = (localTimeString.split(' ')[FIRST_PART].split(':')[FIRST_PART] <= ONE_DIGIT_HOUR) ? '0' + localTimeString.split(' ')[FIRST_PART].split(':')[FIRST_PART] : localTimeString.split(' ')[FIRST_PART].split(':')[FIRST_PART]
                let minutes = localTimeString.split(' ')[FIRST_PART].split(':')[SECOND_PART]
                let seconds = localTimeString.split(' ')[FIRST_PART].split(':')[THIRD_PART]
                let meridian = localTimeString.split(' ')[SECOND_PART]
                let completeHour = hours + ":" + minutes + ":" + seconds + ' ' + meridian
                expect(time.text(), "Validate 'TIME'").to.equal(completeHour)
              })
            } else if (POSTTRADE_TYPE == EXCEL || POSTTRADE_TYPE == JENKINS_JOB) {
              cy.task('getAtLeastTransactTime').then(atLeastTransactTime => {
                let timeFormat = new Date(atLeastTransactTime)
                expect(Date.parse(date.text() + " " + time.text()), "Validate 'TIME'").at.least(Date.parse(timeFormat))
              })
              cy.task('getAtMostTransactTime').then(atMostTransactTime => {
                let timeFormat = new Date(atMostTransactTime)
                expect(Date.parse(date.text() + " " + time.text()), "Validate 'TIME'").at.most(Date.parse(timeFormat))
              })
            }
          })
        })
      })

      /* STATUS */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.STATUS_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.STATUS_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.STATUS_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.STATUS_SECOND_PART).then(status => {
          expect(status.text(), "Validate 'STATUS'").to.equal(SUCCESS)
        })
      })

      cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

      /* SYMBOL */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.SYMBOL_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.SYMBOL_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.SYMBOL_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.SYMBOL_SECOND_PART).then(symbol => {
          expect(symbol.text(), "Validate 'SYMBOL'").to.equal(FIXTURE.symbol)
        })
      })

      cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

      /* SIDE */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.SIDE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.SIDE_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.SIDE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.SIDE_SECOND_PART).then(side => {
          expect(side.text(), "Validate 'SIDE'").to.equal(SIDE)
        })
      })

      cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

      /* CURRENCY */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.CURRENCY_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.CURRENCY_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.CURRENCY_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.CURRENCY_SECOND_PART).then(currency => {
          expect(currency.text(), "Validate 'CURRENCY'").to.equal(FIXTURE.currency)
        })
      })

      cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

      /* QTY */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.QTY_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.QTY_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.QTY_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.QTY_SECOND_PART).then(qty => {
          if (WIDGET_TYPE == CENTRAL || WIDGET_TYPE == MAKER) {
            expect((qty.text().split('('))[FIRST_PART], "Validate 'QTY'").to.equal(parseFloat(FIXTURE.quantity).toFixed(TWO_DECIMAL_PLACES))
          }
          else {
            expect((qty.text().split(')'))[FIRST_PART].replace('(', ''), "Validate 'QTY'").to.equal(parseFloat(FIXTURE.quantity).toFixed(TWO_DECIMAL_PLACES))
          }
        })
      })

      cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

      /* PRICE */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.PRICE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.PRICE_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.PRICE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.PRICE_SECOND_PART).then(price => {
          if (WIDGET_TYPE == CENTRAL || WIDGET_TYPE == MAKER) {
            expect(price.text(), "Validate 'PRICE'").to.equal(parseFloat(FIXTURE.price).toFixed(TWO_DECIMAL_PLACES))
          }
          else {
            expect(price.text().replace('(', '').replace(')', ''), "Validate 'PRICE'").to.equal(parseFloat(FIXTURE.price).toFixed(TWO_DECIMAL_PLACES))
          }
        })
      })

      cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

      /* QTY2 */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.QTY2_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.QTY2_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.QTY2_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.QTY2_SECOND_PART).then(qty2 => {
          if (WIDGET_TYPE == CENTRAL || WIDGET_TYPE == MAKER) {
            expect((qty2.text().split('('))[SECOND_PART].replace(')', ''), "Validate 'QTY2'").to.equal(parseFloat(FIXTURE.qty2).toFixed(TWO_DECIMAL_PLACES))
          }
          else {
            expect(qty2.text().replace('(', '').replace(')', ''), "Validate 'QTY2'").to.equal(parseFloat(FIXTURE.qty2).toFixed(TWO_DECIMAL_PLACES))
          }
        })
      })

      cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

      /* DEAL CODE */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.DEAL_CODE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.DEAL_CODE_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.DEAL_CODE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.DEAL_CODE_SECOND_PART).then(deal_code => {
          expect(deal_code.text(), "Validate 'DEAL CODE'").to.equal(DEAL_CODE_USER_APP)
        })
      })

      cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

      /* TRADER ID */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.TRADER_ID_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.TRADER_ID_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.TRADER_ID_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.TRADER_ID_SECOND_PART).then(trader_id => {
          expect(trader_id.text(), "Validate 'TRADER ID'").to.equal(TRADER_ID)
        })
      })

      cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

      /* CPTY DEAL CODE */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.CPTY_DEAL_CODE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.CPTY_DEAL_CODE_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.CPTY_DEAL_CODE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.CPTY_DEAL_CODE_SECOND_PART).then(cpty_deal_code => {
          expect(cpty_deal_code.text(), "Validate 'CPTY DEAL CODE'").to.equal(CPTY_DEAL_CODE)
        })
      })

      cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

      /* CPTY TRADER ID */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.CPTY_TRADER_ID_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.CPTY_TRADER_ID_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.CPTY_TRADER_ID_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.CPTY_TRADER_ID_SECOND_PART).then(cpty_trader_id => {
          expect(cpty_trader_id.text(), "Validate 'CPTY TRADER ID'").to.equal(CPTY_TRADER_ID)
        })
      })

      cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

      /* CUSTODIAN */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.CUSTODIAN_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.CUSTODIAN_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.CUSTODIAN_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.CUSTODIAN_SECOND_PART).then(custodian => {
          expect(custodian.text(), "Validate 'CUSTODIAN'").to.equal(FIXTURE.custodian)
        })
      })

      /* TRADER REPORT ID */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.TRADE_REPORT_ID_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.TRADE_REPORT_ID_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.TRADE_REPORT_ID_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.TRADE_REPORT_ID_SECOND_PART).then(report_id => {
          if (POSTTRADE_TYPE == REST) {
            expect(report_id.text(), "Validate 'TRADER REPORT ID'").to.equal(FIXTURE.tradeReportId + FILE_ID)
          } else if (POSTTRADE_TYPE == EXCEL) {
            expect(report_id.text(), "Validate 'TRADER REPORT ID'").to.equal('')
          } else if (POSTTRADE_TYPE == JENKINS_JOB) {
            expect(report_id.text().length, "Validate 'TRADER REPORT ID'").to.equal(ID_LENGTH)
          }
        })
      })

      /* EXEC ID */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.EXEC_ID_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.EXEC_ID_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.EXEC_ID_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.EXEC_ID_SECOND_PART).then(exec_id => {
          if (POSTTRADE_TYPE == REST) {
            expect(exec_id.text(), "Validate 'EXEC ID'").to.equal(FIXTURE.execId + FILE_ID)
          } else if (POSTTRADE_TYPE == EXCEL) {
            expect(exec_id.text(), "Validate 'EXEC ID'").to.equal('')
          } else if (POSTTRADE_TYPE == JENKINS_JOB) {
            expect(exec_id.text().length, "Validate 'EXEC ID'").to.equal(ID_LENGTH)
          }
        })
      })

      /* SOURCE */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.SOURCE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.SOURCE_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.SOURCE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.SOURCE_SECOND_PART).then(source => {
          expect(source.text(), "Validate 'SOURCE'").to.equal(USER_MAKER.APP.toUpperCase())
        })
      })

      /* ERROR */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.ERROR_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.ERROR_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.ERROR_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.ERROR_SECOND_PART).then(error => {
          expect(error.text(), "Validate 'ERROR'").to.equal('')
        })
      })

      /* FIX MESSAGE */
      cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.FIX_MESSAGE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.FIX_MESSAGE_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
        cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.FIX_MESSAGE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.FIX_MESSAGE_SECOND_PART).then(fix_message => {
          if (POSTTRADE_TYPE == REST) {
            expect(fix_message.text(), "Validate 'FIX MESSAGE'").to.equal('')
          }
          else if (POSTTRADE_TYPE == EXCEL || POSTTRADE_TYPE == JENKINS_JOB) {
            expect(fix_message.text(), "Validate 'FIX MESSAGE'").contains(rowid + FILE_ID.toString())
          }
        })
      })

      cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)
    })
  })
})

Cypress.Commands.add('validateSeveralPostTradeWidget', (WIDGET_URL, WIDGET_USER, WIDGET_TYPE, FIXTURE, POSTTRADE_TYPE, FILE_ID) => {

  /* Widget */
  let POST_TRADES

  /* Characters to split */
  let ROW_SPLIT_FIRST_PART
  let ROW_SPLIT_SECOND_PART = 'row'

  /* Create the needed variables */
  if (WIDGET_USER.APP.toUpperCase() == 'CENTRAL') {
    if (WIDGET_TYPE == 'CENTRAL_BROKER') {
      POST_TRADES = ConstBosonic.BROKER.WIDGETS.POST_TRADES
    } else {
      POST_TRADES = ConstBosonic.CENTRAL.WIDGETS.POST_TRADES
    }
    ROW_SPLIT_FIRST_PART = 'CentralPostTradesBlotter'
  } else {
    POST_TRADES = ConstBosonic.TRADER.WIDGETS.POST_TRADES
    ROW_SPLIT_FIRST_PART = 'PostTradesBlotter'
  }

  cy.loginAndDescription(WIDGET_URL, WIDGET_USER)

  cy.addWidget(POST_TRADES.NAME, 250, 250)

  /* Maximize Widget */
  cy.xpath(POST_TRADES.MAXIMIZE_BTN).click()

  /* Select the row according to the type of post-trade */

  let rowid
  let columnToFind
  let currentOperationRowFirstPart
  let currentOperationRowSecondPart

  if (POSTTRADE_TYPE == REST) {
    rowid = FIXTURE[0].tradeReportId
    columnToFind = POST_TRADES.COLUMNS.FIX_MESSAGE
    currentOperationRowFirstPart = POST_TRADES.REST_CURRENT_OPERATION_ROW_FIRST_PART
    currentOperationRowSecondPart = POST_TRADES.REST_CURRENT_OPERATION_ROW_SECOND_PART
  } else if (POSTTRADE_TYPE == EXCEL || POSTTRADE_TYPE == JENKINS_JOB) {
    rowid = FIXTURE[0].fixMessage
    columnToFind = POST_TRADES.COLUMNS.FIX_MESSAGE
    currentOperationRowFirstPart = POST_TRADES.UPLOAD_CURRENT_OPERATION_ROW_FIRST_PART
    currentOperationRowSecondPart = POST_TRADES.UPLOAD_CURRENT_OPERATION_ROW_SECOND_PART
  }

  FIXTURE.forEach(fixture => {

    let DEAL_CODE_USER_APP = WIDGET_USER.APP.toUpperCase() == 'CENTRAL' ? fixture.source : WIDGET_USER.APP.toUpperCase()
    let CPTY_DEAL_CODE
    let CPTY_TRADER_ID
    let TRADER_ID = WIDGET_USER.APP.toUpperCase() == 'CENTRAL' ? fixture.party : WIDGET_USER.USER

    if (WIDGET_USER.APP.toUpperCase() == 'CENTRAL') {
      CPTY_DEAL_CODE = fixture.counterPartyAPP
    } else {
      if (WIDGET_USER.APP.toUpperCase() == fixture.source) {
        CPTY_DEAL_CODE = fixture.counterPartyAPP
      }
      else {
        CPTY_DEAL_CODE = fixture.source
      }
    }

    if (WIDGET_USER.APP.toUpperCase() == 'CENTRAL') {
      CPTY_TRADER_ID = fixture.counterParty
    } else {
      if (WIDGET_USER.APP.toUpperCase() == fixture.source) {
        CPTY_TRADER_ID = fixture.counterPartyAlias
      }
      else {
        CPTY_TRADER_ID = fixture.partyAlias
      }
    }

    cy.findColumn(columnToFind, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {

      cy.xpath('(' + currentOperationRowFirstPart + rowid + FILE_ID.toString() + currentOperationRowSecondPart + ')[' + fixture.index + ']').invoke('attr', 'id').then(elementId => {
        let id = elementId.split(ROW_SPLIT_FIRST_PART)[0]
        id = id.split(ROW_SPLIT_SECOND_PART)[1]
        cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)
        /* Validate the fields of the Post trades widget */

        /* DATE */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.DATE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.DATE_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.DATE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.DATE_SECOND_PART).then(date => {
            let transactTimeTaskName
            if (POSTTRADE_TYPE == REST) {
              transactTimeTaskName = 'getTransactTime'
            } else if (POSTTRADE_TYPE == EXCEL || POSTTRADE_TYPE == JENKINS_JOB) {
              transactTimeTaskName = 'getAtMostTransactTime'
            }
            cy.task(transactTimeTaskName).then(transactTime => {
              let dateFormat = new Date(transactTime)
              let day = (dateFormat.getDate() <= ONE_DIGIT_DAY) ? '0' + dateFormat.getDate() : dateFormat.getDate()
              let month = (dateFormat.getMonth() <= ONE_DIGIT_MONTH) ? '0' + (dateFormat.getMonth() + 1) : dateFormat.getMonth() + 1
              let year = dateFormat.getFullYear()
              let completeDate = month + "/" + day + "/" + year
              expect(date.text(), "Validate 'DATE'").to.equal(completeDate)
            })
          })
        })

        /* TIME */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.TIME_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.TIME_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.DATE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.DATE_SECOND_PART).then(date => {
            cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.TIME_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.TIME_SECOND_PART).then(time => {
              if (POSTTRADE_TYPE == REST) {
                cy.task('getTransactTime').then(transactTime => {
                  let timeFormat = new Date(transactTime)
                  let localTimeString = timeFormat.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })
                  let hours = (localTimeString.split(' ')[FIRST_PART].split(':')[FIRST_PART] <= ONE_DIGIT_HOUR) ? '0' + localTimeString.split(' ')[FIRST_PART].split(':')[FIRST_PART] : localTimeString.split(' ')[FIRST_PART].split(':')[FIRST_PART]
                  let minutes = localTimeString.split(' ')[FIRST_PART].split(':')[SECOND_PART]
                  let seconds = localTimeString.split(' ')[FIRST_PART].split(':')[THIRD_PART]
                  let meridian = localTimeString.split(' ')[SECOND_PART]
                  let completeHour = hours + ":" + minutes + ":" + seconds + ' ' + meridian
                  expect(time.text(), "Validate 'TIME'").to.equal(completeHour)
                })
              } else if (POSTTRADE_TYPE == EXCEL || POSTTRADE_TYPE == JENKINS_JOB) {
                cy.task('getAtLeastTransactTime').then(atLeastTransactTime => {
                  let timeFormat = new Date(atLeastTransactTime)
                  expect(Date.parse(date.text() + " " + time.text()), "Validate 'TIME'").at.least(Date.parse(timeFormat))
                })
                cy.task('getAtMostTransactTime').then(atMostTransactTime => {
                  let timeFormat = new Date(atMostTransactTime)
                  expect(Date.parse(date.text() + " " + time.text()), "Validate 'TIME'").at.most(Date.parse(timeFormat))
                })
              }
            })
          })
        })

        /* STATUS */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.STATUS_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.STATUS_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.STATUS_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.STATUS_SECOND_PART).then(status => {
            expect(status.text(), "Validate 'STATUS'").to.equal(SUCCESS)
          })
        })

        cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

        /* SYMBOL */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.SYMBOL_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.SYMBOL_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.SYMBOL_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.SYMBOL_SECOND_PART).then(symbol => {
            expect(symbol.text(), "Validate 'SYMBOL'").to.equal(fixture.symbol)
          })
        })

        cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

        /* SIDE */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.SIDE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.SIDE_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.SIDE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.SIDE_SECOND_PART).then(side => {
            if (fixture.source == WIDGET_USER.APP.toUpperCase() || WIDGET_TYPE == 'CENTRAL' || WIDGET_TYPE == 'CENTRAL_BROKER') {
              expect(side.text(), "Validate 'SIDE'").to.equal(fixture.side)
            } else {
              expect(side.text(), "Validate 'SIDE'").to.equal(fixture.otherSide)
            }
          })
        })

        cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

        /* CURRENCY */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.CURRENCY_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.CURRENCY_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.CURRENCY_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.CURRENCY_SECOND_PART).then(currency => {
            expect(currency.text(), "Validate 'CURRENCY'").to.equal(fixture.currency)
          })
        })

        cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

        /* QTY */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.QTY_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.QTY_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.QTY_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.QTY_SECOND_PART).then(qty => {
            if (WIDGET_USER.APP.toUpperCase() == 'CENTRAL' || (WIDGET_USER.APP.toUpperCase() == fixture.source)) {
              if (fixture.side == 'BUY') {
                expect(qty.text(), "Validate 'QTY'").to.equal(parseFloat(fixture.quantity).toFixed(TWO_DECIMAL_PLACES))
              }
              else {
                expect((qty.text().split(')'))[FIRST_PART].replace('(', ''), "Validate 'QTY'").to.equal(parseFloat(fixture.quantity).toFixed(TWO_DECIMAL_PLACES))
              }
            }
            else {
              if (fixture.side == 'BUY') {
                expect((qty.text().split(')'))[FIRST_PART].replace('(', ''), "Validate 'QTY'").to.equal(parseFloat(fixture.quantity).toFixed(TWO_DECIMAL_PLACES))
              }
              else {
                expect(qty.text(), "Validate 'QTY'").to.equal(parseFloat(fixture.quantity).toFixed(TWO_DECIMAL_PLACES))
              }
            }
          })
        })

        cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

        /* PRICE */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.PRICE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.PRICE_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.PRICE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.PRICE_SECOND_PART).then(price => {
            if (WIDGET_USER.APP.toUpperCase() == 'CENTRAL' || (WIDGET_USER.APP.toUpperCase() == fixture.source)) {
              if (fixture.side == 'BUY') {
                expect(price.text(), "Validate 'PRICE'").to.equal(parseFloat(fixture.price).toFixed(TWO_DECIMAL_PLACES))
              }
              else {
                expect(price.text().replace('(', '').replace(')', ''), "Validate 'PRICE'").to.equal(parseFloat(fixture.price).toFixed(TWO_DECIMAL_PLACES))
              }
            }
            else {
              if (fixture.side == 'BUY') {
                expect(price.text().replace('(', '').replace(')', ''), "Validate 'PRICE'").to.equal(parseFloat(fixture.price).toFixed(TWO_DECIMAL_PLACES))
              }
              else {
                expect(price.text(), "Validate 'PRICE'").to.equal(parseFloat(fixture.price).toFixed(TWO_DECIMAL_PLACES))
              }
            }
          })
        })

        cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

        /* QTY2 */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.QTY2_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.QTY2_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.QTY2_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.QTY2_SECOND_PART).then(qty2 => {
            if (WIDGET_USER.APP.toUpperCase() == 'CENTRAL' || (WIDGET_USER.APP.toUpperCase() == fixture.source)) {
              if (fixture.side == 'BUY') {
                expect(qty2.text().replace('(', '').replace(')', ''), "Validate 'QTY2'").to.equal(parseFloat(fixture.qty2).toFixed(TWO_DECIMAL_PLACES))
              }
              else {
                expect(qty2.text(), "Validate 'QTY2'").to.equal(parseFloat(fixture.qty2).toFixed(TWO_DECIMAL_PLACES))
              }
            } else {
              if (fixture.side == 'BUY') {
                expect(qty2.text(), "Validate 'QTY2'").to.equal(parseFloat(fixture.qty2).toFixed(TWO_DECIMAL_PLACES))
              }
              else {
                expect(qty2.text().replace('(', '').replace(')', ''), "Validate 'QTY2'").to.equal(parseFloat(fixture.qty2).toFixed(TWO_DECIMAL_PLACES))
              }
            }
          })
        })

        cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

        /* DEAL CODE */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.DEAL_CODE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.DEAL_CODE_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.DEAL_CODE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.DEAL_CODE_SECOND_PART).then(deal_code => {
            expect(deal_code.text(), "Validate 'DEAL CODE'").to.equal(DEAL_CODE_USER_APP)
          })
        })

        cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

        /* TRADER ID */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.TRADER_ID_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.TRADER_ID_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.TRADER_ID_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.TRADER_ID_SECOND_PART).then(trader_id => {
            expect(trader_id.text(), "Validate 'TRADER ID'").to.equal(TRADER_ID)
          })
        })

        cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

        /* CPTY DEAL CODE */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.CPTY_DEAL_CODE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.CPTY_DEAL_CODE_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.CPTY_DEAL_CODE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.CPTY_DEAL_CODE_SECOND_PART).then(cpty_deal_code => {
            expect(cpty_deal_code.text(), "Validate 'CPTY DEAL CODE'").to.equal(CPTY_DEAL_CODE)
          })
        })

        cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

        /* CPTY TRADER ID */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.CPTY_TRADER_ID_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.CPTY_TRADER_ID_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.CPTY_TRADER_ID_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.CPTY_TRADER_ID_SECOND_PART).then(cpty_trader_id => {
            expect(cpty_trader_id.text(), "Validate 'CPTY TRADER ID'").to.equal(CPTY_TRADER_ID)
          })
        })

        cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)

        /* CUSTODIAN */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.CUSTODIAN_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.CUSTODIAN_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.CUSTODIAN_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.CUSTODIAN_SECOND_PART).then(custodian => {
            expect(custodian.text(), "Validate 'CUSTODIAN'").to.equal(fixture.custodian)
          })
        })

        /* TRADER REPORT ID */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.TRADE_REPORT_ID_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.TRADE_REPORT_ID_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.TRADE_REPORT_ID_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.TRADE_REPORT_ID_SECOND_PART).then(report_id => {
            if (POSTTRADE_TYPE == REST) {
              expect(report_id.text(), "Validate 'TRADER REPORT ID'").to.equal(fixture.tradeReportId + FILE_ID)
            } else if (POSTTRADE_TYPE == EXCEL) {
              expect(report_id.text(), "Validate 'TRADER REPORT ID'").to.equal('')
            } else if (POSTTRADE_TYPE == JENKINS_JOB) {
              expect(report_id.text().length, "Validate 'TRADER REPORT ID'").to.equal(ID_LENGTH)
            }
          })
        })

        /* EXEC ID */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.EXEC_ID_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.EXEC_ID_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.EXEC_ID_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.EXEC_ID_SECOND_PART).then(exec_id => {
            if (POSTTRADE_TYPE == REST) {
              expect(exec_id.text(), "Validate 'EXEC ID'").to.equal(fixture.execId + FILE_ID)
            } else if (POSTTRADE_TYPE == EXCEL) {
              expect(exec_id.text(), "Validate 'EXEC ID'").to.equal('')
            } else if (POSTTRADE_TYPE == JENKINS_JOB) {
              expect(exec_id.text().length, "Validate 'EXEC ID'").to.equal(ID_LENGTH)
            }
          })
        })

        /* SOURCE */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.SOURCE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.SOURCE_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.SOURCE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.SOURCE_SECOND_PART).then(source => {
            expect(source.text(), "Validate 'SOURCE'").to.equal(fixture.source)
          })
        })

        /* ERROR */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.ERROR_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.ERROR_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.ERROR_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.ERROR_SECOND_PART).then(error => {
            expect(error.text(), "Validate 'ERROR'").to.equal('')
          })
        })

        /* FIX MESSAGE */
        cy.findColumn(POST_TRADES.COLUMNS.CURRENT_OPERATION.FIX_MESSAGE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.FIX_MESSAGE_SECOND_PART, POST_TRADES.HORIZONTAL_SCROLLBAR).then(() => {
          cy.xpath(POST_TRADES.COLUMNS.CURRENT_OPERATION.FIX_MESSAGE_FIRST_PART + id + POST_TRADES.COLUMNS.CURRENT_OPERATION.FIX_MESSAGE_SECOND_PART).then(fix_message => {
            if (POSTTRADE_TYPE == REST) {
              expect(fix_message.text(), "Validate 'FIX MESSAGE'").to.equal('')
            }
            else if (POSTTRADE_TYPE == EXCEL || POSTTRADE_TYPE == JENKINS_JOB) {
              expect(fix_message.text(), "Validate 'FIX MESSAGE'").contains(rowid + FILE_ID.toString())
            }
          })
        })

        cy.dragAndDrop(POST_TRADES.HORIZONTAL_SCROLLBAR, 0, 0)
      })
    })
  })
})