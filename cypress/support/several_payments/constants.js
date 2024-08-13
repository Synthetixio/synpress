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
 * Date: 03/27/24 
 * Author(s): Diego Graf
 * 
 */

module.exports = Object.freeze({

  TASK: {
    SET_TM1A_BEARER: 'setTM1ABearer',
    SET_TM1B_BEARER: 'setTM1BBearer',
    SET_TM1C_BEARER: 'setTM1CBearer',
    SET_TM3A_BEARER: 'setTM3ABearer',
    SET_TM3B_BEARER: 'setTM3BBearer',
    SET_TM3C_BEARER: 'setTM3CBearer',
    SET_PIVOT_BEARER: 'setPivotBearer',
    SET_TM1A_BALANCE: 'setTm1ABalance',
    GET_TM1A_BALANCE: 'getTm1ABalance',
    GET_TM1A_BEARER: 'getTM1ABearer',
    SET_TM1B_BALANCE: 'setTm1BBalance',
    GET_TM1B_BALANCE: 'getTm1BBalance',
    GET_TM1B_BEARER: 'getTM1BBearer',
    SET_TM1C_BALANCE: 'setTm1CBalance',
    GET_TM1C_BALANCE: 'getTm1CBalance',
    GET_TM1C_BEARER: 'getTM1CBearer',
    SET_TM3A_BALANCE: 'setTm3ABalance',
    GET_TM3A_BALANCE: 'getTm3ABalance',
    GET_TM3A_BEARER: 'getTM3ABearer',
    SET_TM3B_BALANCE: 'setTm3BBalance',
    GET_TM3B_BALANCE: 'getTm3BBalance',
    GET_TM3B_BEARER: 'getTM3BBearer',
    SET_TM3C_BALANCE: 'setTm3CBalance',
    GET_TM3C_BALANCE: 'getTm3CBalance',
    GET_TM3C_BEARER: 'getTM3CBearer',
    GET_PIVOT_BEARER: 'getPivotBearer',
    SET_INITIAL_PAYMENTS_QUANTITY_TM1A: 'setInitialPaymentsQuantityTM1A',
    GET_INITIAL_PAYMENTS_QUANTITY_TM1A: 'getInitialPaymentsQuantityTM1A',
    SET_INITIAL_PAYMENTS_QUANTITY_TM1B: 'setInitialPaymentsQuantityTM1B',
    GET_INITIAL_PAYMENTS_QUANTITY_TM1B: 'getInitialPaymentsQuantityTM1B',
    SET_INITIAL_PAYMENTS_QUANTITY_TM1C: 'setInitialPaymentsQuantityTM1C',
    GET_INITIAL_PAYMENTS_QUANTITY_TM1C: 'getInitialPaymentsQuantityTM1C',
    SET_INITIAL_PAYMENTS_QUANTITY_TM3A: 'setInitialPaymentsQuantityTM3A',
    GET_INITIAL_PAYMENTS_QUANTITY_TM3A: 'getInitialPaymentsQuantityTM3A',
    SET_INITIAL_PAYMENTS_QUANTITY_TM3B: 'setInitialPaymentsQuantityTM3B',
    GET_INITIAL_PAYMENTS_QUANTITY_TM3B: 'getInitialPaymentsQuantityTM3B',
    SET_INITIAL_PAYMENTS_QUANTITY_TM3C: 'setInitialPaymentsQuantityTM3C',
    GET_INITIAL_PAYMENTS_QUANTITY_TM3C: 'getInitialPaymentsQuantityTM3C',
    SET_FIXTURE: 'setFixture',
    GET_FIXTURE: 'getFixture',
    GET_URL: 'getUrl',
    SET_URL: 'setUrl',
    GET_USER: 'getUser',
    SET_USER: 'setUser',
    GET_BEARER_TM_TASK: 'getBearerTmTask',
    SET_BEARER_TM_TASK: 'setBearerTmTask',
    GET_INITIAL_PAYMENTS_QUANTITY_TASK: 'getInitialPaymentsQuantityTask',
    SET_INITIAL_PAYMENTS_QUANTITY_TASK: 'setInitialPaymentsQuantityTask',
    GET_TOTAL_PAYMENTS_QUANTITY_MADE: 'getTotalPaymentsQuantityMade',
    SET_TOTAL_PAYMENTS_QUANTITY_MADE: 'setTotalPaymentsQuantityMade'
  },
  INITIAL_BALANCES: {
    BTC: 1000000,
    ETH: 1000000,
    LTC: 1000000,
    BCH: 1000000,
    USD: 1000000
  },
  MISC: {
    HASH_LARGE: 64
  },
  PATH: {
    PAYMENTS: 'rest/payment?page=0&pageSize=20&sortBy=actionTimestamp&sortDirection=DESC&eventId=bosonic-e2e-testing'
  },
  CUSTODIAN: {
    CUST1: 'CUST1'
  },
  INDEX: {
    ASSET: 0,
    CUSTODIAN: 1
  }
})