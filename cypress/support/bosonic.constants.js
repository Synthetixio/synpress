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
 * Date: 05/01/23 12:5
 * Author(s): Diego Graf
 * -----
 * Last Modified: 6/12/2024
 * Modified By: Diego Graf
 * -----
 * 
 */

module.exports = Object.freeze({

  COMMON: {
    LOGIN: '/login?noredir=1',
    LOGIN_FORM: {
      USERNAME_INPUT: '#username',
      PASSWORD_INPUT: '#password',
      LOGIN_BTN_XPATH: '//button'
    },
    ADD_WIDGET_BTN: ' ADD WIDGET',
    WIDGET_DRAG_ELEMENT: '.flexlayout__drag_rect',
    ROOT: '#root',
    MENU_ITEM: '//ul[contains(@class, "navbar-right")]//*[contains(@id,"menuItem")]',
    USER_NAME: '//ul[@id="profile-dropdown" and @class = "jqx-menu-ul"]//li[@role = "menuitem"]',
    LOGIN_LOGO: "//img[@alt='BOSONIC']",
    BOSONIC_EVENT_ID: "bosonic-e2e-testing",
    END_OF_LINE: '\n',
    SPACE_REGEX: / /g,
    UNDERSCORE: "_",
    TAB_WIDGET: '[class*="tab_button_content"]',
    BUTTON_TEXT_SUBMIT: 'SUBMIT',
    BUTTON_TEXT_CONFIRM: 'CONFIRM'
  },
  WAIT: {
    LOW: 1000,
    LOW_HIGH: 2000,
    STANDARD: 3000,
    MEDIUM: 5000,
    LONG: 10000,
    HIGH: 15000,
    EXTRA: 50000,
    TIME_TO_OPENED_PT_USER: 350000
  },
  REQUEST_RESPONSE: {
    OK: 200,
    BAD_REQUEST: 400
  },
  REQUEST_GET: "GET",
  REQUEST_POST: "POST",
  REQUEST_PUT: "PUT",
  TRADER: {
    MAIN_MENU_BAR: {
      COLLATERAL: 'a[href*="collateral"]',
      REPO: 'a[href="/repo"]',
    },
    WIDGETS: {
      RFQ_OUT: {
        FRAME: '.ticket',
        CREATE_ORDER_BTN: 'CREATE ORDER',
        NEW_ORDER_BTN: '#create-order-action',
        CREATE_ORDER_BTN_ID: '#create-order',
        ARROW_BTN: '.Select-arrow-zone',
        AMOUNT_INPUT: '#outbound-amount',
        RATE_INPUT: '#rate-by',
        COUNTERPARTY_SELECT: '[id^=counterparty-dropdown]',
        COUNTERPARTY_FILTER: "//input[@placeholder = 'Filter counterparty']",
        SEND_BTN: 'SEND',
        ASSET1_LIST: "//div[contains(@class, 'ReactVirtualized__Grid ReactVirtualized__List VirtualSelectGrid')]//div[contains(@class, 'ReactVirtualized__Grid__innerScrollContainer')]//div[contains(@class, 'VirtualizedSelectOption')]",
        ASSET2_LIST: "//div[contains(@class, 'ReactVirtualized__Grid ReactVirtualized__List VirtualSelectGrid')]//div[contains(@class, 'ReactVirtualized__Grid__innerScrollContainer')]//div[contains(@class, 'VirtualizedSelectOption')]",
        CUSTODIAN_SELECT: "//div[contains(@class,'Select-menu-outer')]//div[contains(@id,'react-select')]//div[contains(@role,'menuitem')]"
      },
      RFQ_IN: {
        ACCEPT_BTN: 'Accept',
        CANCEL_BTN: 'CANCEL',
        CUSTODIAN_SELECT: "//div[contains(@class,'Select-menu-outer')]//div[contains(@id,'react-select')]//div[contains(@role,'menuitem')]",
        CUSTODIAN_DROP_DOWN: "(//div[contains(@class, 'is-searchable Select--single')])[6]"
      },
      REDEEM_COLLATERAL: {
        NAME: 'Redeem Collateral',
        CONTAINER_XPATH: '//div[@class="collateral_container"]',
        SELECT_ASSET: "(//div[@class='collateral_container']//p[contains(., 'Asset')]/following-sibling::div)[1]",
        SELECT_CUSTODIAN: "//div[@class='collateral_container']//p[contains(., 'Issuer')]/following-sibling::div/div",
        QUANTITY_INPUT: "//div[@class='collateral_container']//p[contains(text(), 'Quantity')][1]//following-sibling::div",
        ACCEPT_BTN: '.btn-positive',
        CONFIRM_BTN_XPATH: '//*[text() = "CONFIRM"]',
      },
      ISSUANCE_HISTORY: {
        NAME: 'Issuance History',
        TAB_HEADER_NAME: "//div[contains(@class,'tab_button')]//div[contains(text(), 'Issuance History')]",
        BTN_MAXIMIZE_WIDGET: "//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., 'Issuance History')]/following-sibling::div/button",
      },
      REDEMPTION_HISTORY: {
        TAB_HEADER_NAME: "//div[contains(@class,'tab_button')]//div[contains(text(), 'Redemption History')]",
        CLOSE_WIDGET: "//div[contains(@class,'tab_button')]//div[contains(text(), 'Redemption History')]/following-sibling::div",
        NAME: 'Redemption History',
        BTN_MAXIMIZE_WIDGET: "//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., 'Redemption History')]/following-sibling::div/button",
        SCROLL_BAR_HORIZONTAL: "//div[contains(@id, 'jqxScrollWraphorizontalScrollBarRedeemExplorer')]//div[contains(@id, 'jqxScrollThumbhorizontalScrollBarRedeemExplorer')]"
      },
      ISSUE_COLLATERAL: {
        NAME: 'Issue Collateral',
        CONTAINER_XPATH: '//div[@class="collateral_container"]',
        ASSET_ISSUER_INPUT: 'Select...',
        SELECT_ASSET: '(//div[@class = "collateral_container"]//p[contains(text(),"Asset")])[1]//following-sibling::div',
        SELECT_ISSUER: '(//div[@class = "collateral_container"]//p[contains(text(),"Issuer")])[1]//following-sibling::div',
        QUANTITY_INPUT: ':nth-child(6) > .form-control',
        QUANTITY_INPUT_XPATH: '(//div[@class = "collateral_container"]//p[contains(text(),"Quantity")])[1]//following-sibling::div',
        ACCEPT_BTN: '.btn-positive',
        CONFIRM_BTN_XPATH: '//*[text() = "CONFIRM"]'
      },
      PAYMENTS: {
        TYPE: {
          OUTGOING: "OUTGOING",
          INCOMING: "INCOMING",
        },
        NAME: 'Payments',
        PAYEE_INPUT: '#payee',
        AMOUNT_INPUT: '#amount',
        FORM_SELECT: '.one-way-payment .Select',
        MAXIMIZE_BTN: "(//button[contains(@class, 'flexlayout__tab_toolbar_button-min')])[2]",
        BTN_MAXIMIZE_WIDGET: "//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., 'Payments')]/following-sibling::div/button",
        SEND_BTN: "//div[contains(@class,'one-way-payment')]//button[contains(@class, 'positive')]",
        MODAL_CONFIRM_BTN: "//div[contains(@role,'document')]//div[contains(@class, 'footer')]//button[contains(@class, 'positive')]",
        SCROLL_BAR_HORIZONTAL: '#jqxScrollThumbhorizontalScrollBarOneWayPaymentWidget-23',
        FIRST_ROW: '#row0OneWayPaymentWidget-23',
        FIRST_ROW_COLUMNS: {
          ASSET: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row0OneWayPaymentWidget')]//div[contains(@class, 'col-asset')]",
          BLOCKHASH: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row0OneWayPaymentWidget')]//div[contains(@class, 'col-blockHash')]",
          PAYEE: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row0OneWayPaymentWidget')]//div[(contains(@class, 'col-payee')) and not(contains(@class,'Account'))]",
          PAYOR: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row0OneWayPaymentWidget')]//div[contains(@class, 'col-payor')]",
          AMOUNT: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row0OneWayPaymentWidget')]//div[contains(@class, 'col-amount')]",
          TRANSACTION_HASH: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row0OneWayPaymentWidget')]//div[contains(@class, 'col-tx')]",
          DATE: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row0OneWayPaymentWidget')]//div[contains(@class, 'col-date')]",
          STATUS: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row0OneWayPaymentWidget')]//div[contains(@class, 'col-status')]",
          SENDER_ADDRESS: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row0OneWayPaymentWidget')]//div[contains(@class, 'col-account')]",
          RECEIVER_ADDRESS: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row0OneWayPaymentWidget')]//div[contains(@class, 'col-payeeAccount')]",
          TYPE: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row0OneWayPaymentWidget')]//div[contains(@class, 'col-type')]",
        },
        COLUMNS: {
          ASSET_FIRST_PART: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row",
          ASSET_SECOND_PART: "OneWayPaymentWidget')]//div[contains(@class, 'col-asset')]",
          BLOCKHASH_FIRST_PART: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row",
          BLOCKHASH_SECOND_PART: "OneWayPaymentWidget')]//div[contains(@class, 'col-blockHash')]",
          PAYEE_FIRST_PART: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row",
          PAYEE_SECOND_PART: "OneWayPaymentWidget')]//div[(contains(@class, 'col-payee')) and not(contains(@class,'Account'))]",
          PAYOR_FIRST_PART: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row",
          PAYOR_SECOND_PART: "OneWayPaymentWidget')]//div[contains(@class, 'col-payor')]",
          AMOUNT_FIRST_PART: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row",
          AMOUNT_SECOND_PART: "OneWayPaymentWidget')]//div[contains(@class, 'col-amount')]",
          TRANSACTION_HASH_FIRST_PART: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row",
          TRANSACTION_HASH_SECOND_PART: "OneWayPaymentWidget')]//div[contains(@class, 'col-tx')]",
          DATE_FIRST_PART: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row",
          DATE_SECOND_PART: "OneWayPaymentWidget')]//div[contains(@class, 'col-date')]",
          STATUS_FIRST_PART: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row",
          STATUS_SECOND_PART: "OneWayPaymentWidget')]//div[contains(@class, 'col-status')]",
          SENDER_ADDRESS_FIRST_PART: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row",
          SENDER_ADDRESS_SECOND_PART: "OneWayPaymentWidget')]//div[contains(@class, 'col-account')]",
          RECEIVER_ADDRESS_FIRST_PART: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row",
          RECEIVER_ADDRESS_SECOND_PART: "OneWayPaymentWidget')]//div[contains(@class, 'col-payeeAccount')]",
          TYPE_FIRST_PART: "//div[contains(@id, 'contenttableOneWayPaymentWidget')]//div[contains(@id, 'row",
          TYPE_SECOND_PART: "OneWayPaymentWidget')]//div[contains(@class, 'col-type')]",
        },
        COLUMN_CLASS: {
          COL_ASSET: 'col-asset',
          COL_EVENT_ID: 'col-eventId',
          COL_DATE: 'col-date',
          COL_STATUS: 'col-status',
          COL_TYPE: 'col-type',
          COL_PAYEE: 'col-payee',
          COL_PAYOR: 'col-payor',
          COL_AMOUNT: 'col-amount',
          COL_ACCOUNT: 'col-account',
          COL_PAYEEACCOUNT: 'col-payeeAccount',
          COL_TX: 'col-tx',
          COL_BLOCKHASH: 'col-blockHash',
        },
        FOOTER: {
          ELEMENTS_QUANTITY: "//div[contains(@id, 'pagerOneWayPaymentWidget')]//div[contains(@style, 'line-height: 20px; width: 100%; height: 100%; position: relative; top: 2px;')]//div[contains(@style, 'margin-right: 7px; float: right;') and contains(text(), 'of')]",
          PAGE_SELECT: "//div[contains(@id, 'dropdownlistWrappergridpagerlistOneWayPaymentWidget')]",
          PAGE_SELECT_OPTION_20: "//div[contains(@id, 'listBoxContentinnerListBoxgridpagerlistOneWayPaymentWidget')]//div//div[@role = 'option']//span[contains(text(), '20')]"
        },
        MSG_PAYMENT_CREATED: "Payment creation process started.",
        MSG_EMAIL_MUST_BE_DIFFERENT: "Invalid user. User can't pay to itself",
        MSG_EMAIL_NON_EXISTENT_USER: "* User does not exist or is in invalid state:",
        MSG_NOT_ENOUGH_FUNDS: "NOT ENOUGH FUNDS",
        ERROR_MESSAGE: '[class="inline-block error-message"]'
      },
      RATES_PANEL: {
        NAME: 'Rates Panel',
        ASSET_LIST: '.rates-table',
        FILES_CONFIG: "//span[@class = 'toggleBook']"
      },
      RATE_PANEL: {
        NAME: 'Rate Panel',
        ASSET_TITLE: '.rate-panel',
        CONTAINER_XPATH: "//div[@class='inline-block rate-panel' and div[@class='row header']/div/div/input[@value=",
        AMOUNT: '.amount',
        AMOUNT_XPATH: "//div[@class='amount']//input[@type = 'text']",
        PRICE: '.price',
        PRICE_XPATH: "//div[@class='price']//input[@type = 'text']",
        CUSTODIAN_SELECT: '.Select-placeholder',
        CUSTODIAN_SELECT_2: "//div[contains(@class, 'Select custodian-select')]//span[@class = 'Select-arrow']",
        CUSTODIAN_OPTION_FIRST_PART: "//div[@role = 'option' and @aria-label = '",
        CUSTODIAN_OPTION_SECOND_PART: "']",
        OFFER_BTN: 'OFFER',
        BID_BTN: 'BID',
        SEND_BTN: 'SEND',
        MATCH_ASSET_ROW_XPATH: "//td[@class='buy' and @title='You Buy ",
        MATCH_ASSET_ROW_XPATH_SELL_SIDE: "//td[@class='sell' and @title='You Sell ",
        IOC_BUY_FIRST_PART: "//div[contains(@class, 'col-xs-6 text-left clickable') and contains(@title, 'You Buy ",
        IOC_SELL_FIRST_PART: "//div[contains(@class, 'col-xs-6 text-left clickable') and contains(@title, 'You Sell ",
        IOC_BUY_SECOND_PART: "')]//div[contains(@class, 'ticker side-buy border-glow ')]//div[contains(@class, 'side-price')]",
        IOC_SELL_SECOND_PART: "')]//div[contains(@class, 'ticker side-sell border-glow ')]//div[contains(@class, 'side-price')]",
        CLOSE_BUTTON: "//button[contains(@class, 'btn-top btn btn-xs btn-default')]",
        ALL_SELL_BOOK_ROWS: "//div[contains(@class, 'raw-market')]//table//tbody//tr//td[contains(@class, 'sell')]//div[contains(@class, 'quote-size') and string-length(text()) > 0]",
        ALL_BUY_BOOK_ROWS: "//div[contains(@class, 'raw-market')]//table//tbody//tr//td[contains(@class, 'buy')]//div[contains(@class, 'quote-size') and string-length(text()) > 0]",
        BUY_BOOK_ROWS: "//div[contains(@class, 'raw-market')]//table//tbody//tr//td[contains(@class, 'buy')]",
        SELL_BOOK_ROWS: "//div[contains(@class, 'raw-market')]//table//tbody//tr//td[contains(@class, 'sell')]",
        ORDER_BOOK_RATE_BY_PROVIDER_FIRST_PART_BID: "//div[@class = 'account-name' and text() = '",
        ORDER_BOOK_RATE_BY_PROVIDER_SECOND_PART_BID: "']/following-sibling::div/following-sibling::div",
        ORDER_BOOK_RATE_BY_PROVIDER_FIRST_PART_OFFER_ENTIRE_PART: "//div[@class = 'account-name' and text() = '",
        ORDER_BOOK_RATE_BY_PROVIDER_SECOND_PART_OFFER_ENTIRE_PART: "']/preceding-sibling::div/span",
        ORDER_BOOK_RATE_BY_PROVIDER_FIRST_PART_OFFER_DECIMAL_PART: "//div[@class = 'account-name' and text() = '",
        ORDER_BOOK_RATE_BY_PROVIDER_SECOND_PART_OFFER_DECIMAL_PART: "']/preceding-sibling::div/span/span",
        CANCEL_BTN: "(//button[@type = 'button']//span[contains(text(), 'CANCEL')])[1]"
      },
      TRADE_BLOTTER: {
        NAME: 'Trade Blotter',
        CONTAINER: '#contenttableTradeBlotter-14',
        ROW_FIRST_PART: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row",
        ROW_SECOND_PART: "TradeBlotter')]//div[contains(@class, '",
        ROW_THIRD_PART: "')]/div",
        FIRST_ROW: '#row0TradeBlotter-14',
        FIRST_ROW_DETAIL_BUTTON: "//div[contains(@id, 'contenttableTradeBlotter')]//*[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'icon-arrow-right')]",
        FIRST_ROW_COLUMNS: {
          STATUS: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-status')]/div/span",
          ASSET_PAIR: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-currencyPair')]/div/span",
          SIDE: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-side')]/div/span",
          ASSET1: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-asset1')]/div/span",
          AVG_RATE: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-avgRate')]/div/span",
          RATE: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-rate')]/div/span",
          QTY_1: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-quantity')]/div/span",
          ASSET2: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-asset2')]/div/span",
          QTY_2: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-total')]/div/span",
          DATE: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-lastResponseDate')]/div",
          TIME: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[@class='jqx-grid-cell jqx-grid-cell-metrodark jqx-item jqx-item-metrodark row-neutral col-time']",
          TYPE: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-type')]/div",
          PLATFORM: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-platform')]/div",
          ORDER_ID: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-id')]/div",
          R_REF: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-refId')]/div",
          QUOTE_TYPE: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-quoteType')]/div",
          FEE_ASSET: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-feeAssetSymbol')]/div",
          FEE_QTY: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-fees')]/div",
        },
        SECOND_ROW_COLUMNS: {
          AVG_RATE: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row1TradeBlotter')]//div[contains(@class, 'col-avgRate')]/div/span",
          ASSET_PAIR: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row1TradeBlotter')]//div[contains(@class, 'col-currencyPair')]/div/span",
          ASSET1: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row1TradeBlotter')]//div[contains(@class, 'col-asset1')]/div/span",
          ASSET2: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row1TradeBlotter')]//div[contains(@class, 'col-asset2')]/div/span",
        },
        THIRD_ROW_COLUMNS: {
          QTY_1: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row2TradeBlotter')]//div[contains(@class, 'col-quantity')]/div/span",
          QTY_1_U15_RPO: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row1TradeBlotter')]//div[contains(@class, 'col-quantity')]/div/span",
          AVG_RATE: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row2TradeBlotter')]//div[contains(@class, 'col-avgRate')]/div/span",
          AVG_RATE_U15_RPO: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row1TradeBlotter')]//div[contains(@class, 'col-avgRate')]/div/span",
        },
        DETAIL_CONTAINER_ROWS: "//div[contains(@id, 'contenttablelm_details0')]//div[contains(@role, 'row')]",
        DETAIL_FIRST_ROW_COLUMNS: {
          TRADE_MATCH_ID: "//div[contains(@id, 'row0lm_details0')]//div[contains(@class, 'col-trade-id')][2]/div",
          QTY1: "//div[contains(@id, 'row0lm_details0')]//div[contains(@class, 'col-quantity')]/div",
          QTY2: "//div[contains(@id, 'row0lm_details0')]//div[contains(@class, 'col-total')]/div"
        },
        DETAIL_ROWS_COLUMNS: {
          FIRST_PART: "//div[contains(@id, 'row",
          SECOND_PART: "lm_details0')]"
        },
        DETAIL_ROW_COLUMNS: {
          QTY1_FIRST_PART: "//div[contains(@id, 'row",
          QTY1_SECOND_PART: "lm_details0')]//div[contains(@class, 'col-quantity')]/div",
          QTY2_FIRST_PART: "//div[contains(@id, 'row",
          QTY2_SECOND_PART: "lm_details0')]//div[contains(@class, 'col-total')]/div"
        },
        SCROLL_BAR_HORIZONTAL: "#jqxScrollThumbhorizontalScrollBarTradeBlotter-14",
        SCROLL_BAR_HORIZONTAL_XPATH: "//div[contains(@id, 'jqxScrollThumbhorizontalScrollBarTradeBlotter')]",
        SCROLL_BAR_HORIZONTAL_REPO: "//div[contains(@id, 'jqxScrollWraphorizontalScrollBarTradeBlotter')]//div[contains(@id, 'jqxScrollThumbhorizontalScrollBarTradeBlotter')]",
        SCROLL_BAR_VERTICAL: "#jqxScrollThumbverticalScrollBarTradeBlotter-14",
        MAXIMIZE_BUTTON: "(//button[contains(@class, 'flexlayout__tab_toolbar_button-min')])[4]",
        MAXIMIZE_BUTTON_REPO: "(//button[contains(@class, 'flexlayout__tab_toolbar_button-min')])[1]",
        BTN_MAXIMIZE_WIDGET: "//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., 'Trade Blotter')]/following-sibling::div/button",
        CLOSE_WIDGET: "//div[contains(@class,'tab_button')]//div[contains(text(), 'Trade Blotter')]/following-sibling::div",
        COLUMN: {
          DATE: "col-lastResponseDate",
          TIME: "col-time",
          STATUS: "col-status",
          FILLED: "col-filled",
          MESSAGE: "col-message",
          SIDE: "col-side",
          ASSET_PAIR: 'col-currencyPair',
          ASSET1: 'col-asset1',
          ASSET2: 'col-asset2',
          TIF: 'col-timeInForce',
          QTY_1: 'col-quantity',
          QTY_2: 'col-total',
          ORDER_ID: 'col-id',
          CURRENCY_PAIR: "col-currencyPair",
          RATE: 'col-rate',
          PLATFORM: 'col-platform',
          TOTAL: 'col-total',
          TYPE: 'col-type',
          FEE_ASSET_SYMBOL: 'col-feeAssetSymbol',
          FEES: 'col-fees',
          REF_ID: 'col-refId',
          TRADE_MATCH_ID: 'col-trade-id',
          QUOTE_TYPE: 'col-quoteType'
        },
        COLUMNS_PARTS: {
          QTY_1_FIRST_PART: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row",
          QTY_1_SECOND_PART: "TradeBlotter')]//div[contains(@class, 'col-quantity')]/div/span",
          AVG_RATE_FIRST_PART: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row",
          AVG_RATE_SECOND_PART: "TradeBlotter')]//div[contains(@class, 'col-avgRate')]/div/span",
          SIDE_FIRST_PART: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row",
          SIDE_SECOND_PART: "TradeBlotter')]//div[contains(@class, 'col-side')]/div/span",
          ASSET1_FIRST_PART: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row",
          ASSET1_SECOND_PART: "TradeBlotter')]//div[contains(@class, 'col-asset1')]/div/span"
        },
        ROWS_QUANTITY: "count(//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row')]//div[contains(@class, 'col-quantity')]/div/span)",
        FOOTER: {
          ELEMENTS_QUANTITY_SELECT: "//div[contains(@id, 'pagerTradeBlotter')]//div//div//div//div[contains(@id, 'dropdownlistArrowgridpagerlistTradeBlotter')]",
          ELEMENTS_QUANTITY_OPTION_20: "//div[contains(@id, 'listBoxContentinnerListBoxgridpagerlistTradeBlotter')]//div//div[@role = 'option']//span[contains(text(), '20')]"
        },
      },
      TRADE_BLOTTER_RFQ: {
        SCROLL_BAR_HORIZONTAL: '#jqxScrollThumbhorizontalScrollBarTradeBlotter-15',
        MAXIMIZE_BUTTON: "(//button[contains(@class, 'flexlayout__tab_toolbar_button-min')])[5]",
        FIRST_ROW_COLUMNS: {
          ORDER_ID: "//div[contains(@id,'contenttableTradeBlotter')]//div[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'col-id')]/div"
        }
      },
      OPEN_ORDERS: {
        NAME: 'Open Orders',
        TAB_HEADER_NAME: "//div[contains(@class,'tab_button')]//div[contains(text(), 'Open Orders')]",
        CLOSE_WIDGET: "//div[contains(@class,'tab_button')]//div[contains(text(), 'Open Orders')]/following-sibling::div",
        CONTAINER: "//div[contains(@id, 'contentOpenOrdersBlotter')]",
        FIRST_ROW: "//div[contains(@id, 'row0OpenOrdersBlotter')]",
        FIRST_ROW_COLUMNS: {
          DATE: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-createdDate')]/div",
          TIME: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-time')]/div",
          STATUS: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-status')]/div",
          SIDE: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-side')]/div",
          ASSET_PAIR: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-currencyPair')]/div",
          ASSET_1: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-asset1')]/div",
          FILLED: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-cumQty')]/div",
          QTY_1: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-quantity')]/div",
          RATE: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-rate')]/div",
          ASSET_2: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-asset2')]/div",
          QTY_2: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-total')]/div",
          DIRECTION: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-ticketType')]/div",
          TIF: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-tif')]/div",
          ORDER_TYPE: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-orderType')]/div",
          FEE_ASSET: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-feeAssetSymbol')]/div",
          FEE_QTY: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-fees')]/div",
          COUNTERPARTIES: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-cpty')]/div",
          ACCOUNT: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-accountId')]/div",
          CUSTODIAN: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-custodian')]/div",
          PLATFORM: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-platform')]/div",
          USER_ID: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-senderId')]/div",
          VENUE: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-venue')]/div",
          ORDER_ID: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-id')]/div",
          R_REF: "//div[contains(@id, 'contentOpenOrdersBlotter')]//div[contains(@id, 'row0OpenOrdersBlotter')]//div[contains(@class, 'col-refId')]/div",
        },
        BTN_CANCEL_ALL: "//div[contains(@id, 'OpenOrdersBlotter')]//button[contains(@class, 'cancel-all')]",
        BTN_CONFIRM_CANCEL_ALL: "//div[contains(@class, 'modal-content')]//button[contains(@class, 'btn-positive')]"
      },
      BALANCES: {
        NAME: 'Balances',
        BTN_MAXIMIZE_WIDGET: "//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., 'Balances')]/following-sibling::div/button",
        COLUMNS: {
          ASSET_FILTER: "//div[contains(@id,'columntableBalances')]//div[@role='columnheader' and contains( . ,  'ASSET')]//div[contains(@class, 'filtericon')]",
          BALANCES_FIRST_ROW_AMOUNT: "//div[@role = 'row' and contains(@id, 'Balances')]//div[contains(@class, 'col-amount')]",
        },
        FILTER_SELECT_ALL: "//div[@role = 'option' and contains(., '(Select All)')]",
        FILTER_BUTTON_FILTER: "//div[@class = 'filter']//span[contains(@id, 'filterbuttonBalances')]",
        ROWS_QUANTITY: "count(//div[contains(@id, 'contenttableBalances-')]//div[contains(@role, 'row') and contains(@id, 'Balances-')]//div[contains(@class, 'col-iso')]//div)",
        ROW_FIRST_PART: "//div[contains(@id, 'contenttableBalances-')]//div[contains(@id, 'row",
        ROW_SECOND_PART: "Balances')]",
        COL_ASSET: "//div[contains(@class, 'col-iso')]//div"
      },
      POSITIONS_BY_ASSET: {
        NAME: "Positions by Asset",
        COLUMNS: {
          ASSET_FILTER: "//div[contains(@id,'contentPositionsBalances')]//div[@role='columnheader' and contains( . ,  'ASSET')]//div[contains(@class, 'filtericon')]",
          TOTAL_ISSUANCE_FIRST_ROW: "//div[contains(@id, 'row0PositionsBalances')]//div[contains(@class, 'col-issuance')]",
          TOTAL_REDEMPTION_FIRST_ROW: "//div[contains(@id, 'row0PositionsBalances')]//div[contains(@class, 'col-redemption')]",
          CURRENT_BALANCE_FIRS_ROW: "//div[contains(@id, 'row0PositionsBalances')]//div[contains(@class, 'col-amount')]",
          POSTITION_CHANGE_FIRST_ROW: "//div[contains(@id, 'row0PositionsBalances')]//div[contains(@class, 'col-profitAndLoss')]",
        },
        FILTER_SELECT_ALL: "//div[@role = 'option' and contains(., '(Select All)')]",
        FILTER_BUTTON_FILTER: "//div[@class = 'filter']//span[contains(@id, 'filterbuttonPositionsBalances')]",
        BTN_MAXIMIZE_WIDGET: "(//div[@class = 'loadedContent']//button[contains(@class, '_button-min')])[1]",
      },
      VOLUME_POSITIONS_BY_SYMBOL: {
        FILTER_CALENDAR: {
          FROM: {
            CONTAINER: "(//div[contains(@id, 'jqxWidget')]//div[contains(@class, 'jqx-max-size jqx-position-relative')]//div[contains(@class, 'jqx-position-absolute jqx-action-button jqx-action-button-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark jqx-default jqx-default-metrodark')])[1]",
            CALENDAR_TITLE: "(//div[contains(@class, 'jqx-calendar-title-content jqx-calendar-title-content-metrodark')])[1]",
            BACK_BUTTON: "(//div[contains(@class, 'jqx-calendar-title-navigation jqx-calendar-title-navigation-metrodark jqx-icon-arrow-left jqx-icon-arrow-left-metrodark')])[1]",
            JANUARY: "//td[contains(text(), 'Jan')]",
            DAY_ONE: "(//td[contains(text(), '1') and contains(@class, 'jqx-rc-all jqx-rc-all-metrodark jqx-item jqx-item-metrodark jqx-calendar-cell jqx-calendar-cell-metrodark jqx-calendar-cell-selected jqx-calendar-cell-selected-metrodark jqx-fill-state-pressed jqx-fill-state-pressed-metrodark jqx-calendar-cell-month jqx-calendar-cell-month-metrodark')])[1]"
          },
          TO: {
            CONTAINER: "(//div[contains(@id, 'jqxWidget')]//div[contains(@class, 'jqx-max-size jqx-position-relative')]//div[contains(@class, 'jqx-position-absolute jqx-action-button jqx-action-button-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark jqx-default jqx-default-metrodark')])[2]",
            CALENDAR_TITLE: "(//div[contains(@class, 'jqx-calendar-title-content jqx-calendar-title-content-metrodark')])[2]",
            CURRENT_DAY: "(//table[contains(@id, 'cellTableViewinnerCalendarjqxWidget')]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[contains(@class, 'jqx-calendar-cell-today')])[2]"
          }
        },
        SYMBOL: "//div[contains(@class, 'jqx-widget jqx-widget-metrodark jqx-dropdownlist-state-normal jqx-dropdownlist-state-normal-metrodark jqx-rc-all jqx-rc-all-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark jqx-default jqx-default-metrodark jqx-dropdownlist-state-selected jqx-dropdownlist-state-selected-metrodark jqx-fill-state-pressed jqx-fill-state-pressed-metrodark jqx-rc-b-expanded jqx-rc-b-expanded-metrodark')]",
        SEARCH: "//div[contains(@class, 'positive blotterActionButtons search-positionBlotter jqx-rc-all jqx-rc-all-metrodark jqx-button jqx-button-metrodark jqx-widget jqx-widget-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark')]",
        NAME: 'Volume Positions by Symbol'
      },
      TWO_FACTOR_AUTHENTICATION: {
        BTN: 'button[type="button"]',
        NAME: "Two-Factor Authentication (2FA)",
        ENABLE_2FA_BTN: 'button[title="Set Up 2FA"]',
        ENABLE_2FA_BUTTON: "//button[contains(@title, 'Set Up 2FA')]",
        RESET_2FA_BUTTON: "//button[@title='Reset 2FA']",
        CONFIRM_RESET: "//button[contains(@class, 'btn-positive') and contains(text(), 'CONFIRM')]",
        USE_EMERGENCY_RECOVERY_CODE_LINK: "//a[@class = 'portal-label security-code' and text() = 'emergency recovery code']",
        EMERGENCY_RECOVERY_CODE_LINK_LOGIN: "//a[@class = 'recovery-code-link' and text() = 'emergency recovery code']",
        RECOVERY_CODE_INPUT_LOGIN: "//input[@placeholder='Recovery Code']",
        RECOVERY_CODE_INPUT_RESET_2FA: "//input[@class='security-code-text form-control']",
        SECRET_CODE: 'input[class="mfa-input form-control"]',
        SECRET: "//input[contains(@class, 'mfa-input form-control')]",
        CONTINUE_BUTTON: "//div[contains(@class, 'mfa-container')]//div[contains(@class, 'mfa-buttons')]//button//span[contains(text(), 'Continue')]",
        CODE_INPUT: 'input[class*="form-control"]',
        SIX_DIGITS_CODE: "//div[contains(@class, 'mfa-form')]//input",
        SIX_DIGITS_CODE_LOGIN: "//input[@placeholder = 'Code']",
        SIX_DIGITS_CODE_CREATE_WALLET: "//label[text() = 'Enter the six digits code provided by your 2FA app']/following-sibling::input",
        SIX_DIGITS_CODE_REDEEM: "//label[text() = 'Enter the six digits code provided by your 2FA app']/following-sibling::input",
        SIX_DIGITS_CODE_WITHDRAWAL: "//label[text() = 'Enter the six digits code provided by your 2FA app']/following-sibling::input",
        COPY_RECOVERY_CODES: "//button[contains(@id, 'copy-codes')]",
        LOGIN_BUTTON: "//button[text()='Login']",
        VALIDATE_CODE_BUTTON: "//button[@title='Validate code']",
        FINISH: "//button[contains(@title, 'Continue with the setup')]"
      },
      AUDIT_BLOTTER: {
        NAME: "Audit Blotter",
        MAXIMIZE: "(//button[contains(@class, 'flexlayout__tab_toolbar_button-min')])[4]",
        SCROLL_BAR_HORIZONTAL: '#jqxScrollThumbhorizontalScrollBarAuditBlotter-13',
        FILTER_CALENDAR: {
          FROM: {
            CONTAINER: "(//div[contains(@class, 'jqx-icon jqx-icon-metrodark jqx-icon-calendar jqx-icon-calendar-metrodark')])[1]",
            CURRENT_DAY: "(//table[contains(@id, 'cellTableViewinnerCalendarjqxWidget')]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[contains(@class, 'jqx-calendar-cell-today')])[1]",
          },
          TO: {
            CONTAINER: "(//div[contains(@class, 'jqx-icon jqx-icon-metrodark jqx-icon-calendar jqx-icon-calendar-metrodark')])[2]",
            CURRENT_DAY: "(//table[contains(@id, 'cellTableViewinnerCalendarjqxWidget')]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[contains(@class, 'jqx-calendar-cell-today')])[2]"
          },
          SEARCH_BUTTON: "//div[@class = 'positive blotterActionButtons search-auditBlotter jqx-rc-all jqx-rc-all-metrodark jqx-button jqx-button-metrodark jqx-widget jqx-widget-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark']"
        },
        COLUMNS: {
          ORDER_ID: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='ORDER ID'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          }
        },
        FIRST_ROW: {
          COLUMNS: {
            ORDER_ID: "//div[contains(@id, 'row0AuditBlotter')]//div[contains(@class, 'col-id')]//div",
            SIDE: "//div[contains(@id, 'row0AuditBlotter')]//div[contains(@class, 'col-side')]//div",
            AVG_RATE: "//div[contains(@id, 'row0AuditBlotter')]//div[contains(@class, 'col-avgRate')]//div//span"
          }
        },
        SECOND_ROW: {
          COLUMNS: {
            ORDER_ID: "//div[contains(@id, 'row1AuditBlotter')]//div[contains(@class, 'col-id')]//div",
            AVG_RATE: "//div[contains(@id, 'row1AuditBlotter')]//div[contains(@class, 'col-avgRate')]//div//span"
          }
        }
      },
      POST_TRADES: {
        NAME: 'Post Trades',
        HORIZONTAL_SCROLLBAR: "#jqxScrollThumbhorizontalScrollBarPostTradesBlotter-23",
        REST_CURRENT_OPERATION_ROW_FIRST_PART: "//div[@class = 'jqx-grid-cell-left-align' and contains(text(), '",
        UPLOAD_CURRENT_OPERATION_ROW_FIRST_PART: "//div[@style = 'overflow:hidden; text-overflow: ellipsis;' and contains(text(), '",
        REST_CURRENT_OPERATION_ROW_SECOND_PART: "')]/parent::div/parent::div",
        UPLOAD_CURRENT_OPERATION_ROW_SECOND_PART: "')]/parent::div/parent::div/parent::div",
        MAXIMIZE_BTN: "(//button[contains(@class, 'flexlayout__tab_toolbar_button-min')])[1]",
        UPLOAD_FILE_BTN: "//button[text() = 'UPLOAD FILE']",
        COLUMNS: {
          TRADER_REPORT_ID: "//span[text() = 'TRADER REPORT ID']",
          FIX_MESSAGE: "//span[text() = 'FIX MESSAGE']",
          CURRENT_OPERATION: {
            STATUS_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            STATUS_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-status')]//div//span",
            SYMBOL_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            SYMBOL_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-symbol')]//div//span",
            QTY_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            QTY_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-quantity') and not(contains(@class, 'col-quantity2'))]//div//span",
            PRICE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            PRICE_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-price')]//div//span",
            SIDE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            SIDE_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-side')]//div//span",
            CURRENCY_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            CURRENCY_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-currency')]//div//span",
            DEAL_CODE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            DEAL_CODE_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-partyDealcode')]//div",
            TRADER_ID_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            TRADER_ID_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-partyTraderId')]//div",
            CPTY_DEAL_CODE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            CPTY_DEAL_CODE_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-counterPartyDealcode')]//div",
            CPTY_TRADER_ID_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            CPTY_TRADER_ID_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-counterPartyTraderId')]//div",
            CUSTODIAN_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            CUSTODIAN_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-custodian')]//div",
            TRADE_REPORT_ID_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            TRADE_REPORT_ID_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-tradeReportId')]//div",
            EXEC_ID_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            EXEC_ID_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-execId')]//div",
            SOURCE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            SOURCE_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-source')]//div",
            ERROR_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            ERROR_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-error')]//div",
            FIX_MESSAGE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            FIX_MESSAGE_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-fixMessage')]//div//div",
            DATE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            DATE_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-txDate')]//div",
            TIME_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            TIME_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-txTime')]//div",
            QTY2_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            QTY2_SECOND_PART: "PostTradesBlotter')]//div[contains(@class, 'col-quantity2')]//div//span"
          }
        }
      },
      REPO_RATES: {
        NAME: 'Repo Rates',
        ASSET_LIST: '.rates-table'
      },
      REPO_PANEL: {
        NAME: 'Repo Panel',
        ASSET_TITLE: '.rate-panel',
        CONTAINER_XPATH: "//div[@class='inline-block rate-panel' and div[@class='row header']/div/div/input[@value=",
        LEND_BTN: 'LEND',
        BORROW_BTN: 'BORROW',
        CUSTODIAN_SELECT: '.Select-placeholder',
        CUSTODIAN_OPTION_FIRST_PART: "//div[@role = 'option' and @aria-label = '",
        CUSTODIAN_OPTION_SECOND_PART: "']",
        PRICE: '.price',
        AMOUNT: '.amount',
        SEND_BTN: 'SEND',
        CLOSE_BUTTON: "//button[contains(@class, 'btn-top btn btn-xs btn-default')]",
        MATCH_ASSET_ROW_TO_LEND: "//td[@class='sell' and contains(@title, 'You Lend ",
        MATCH_ASSET_ROW_TO_BORROW: "//td[@class='buy' and contains(@title, 'You Borrow ",
      },
      REPO_POSITIONS: {
        NAME: 'Repo Positions',
        MAXIMIZE: "(//button[@class='flexlayout__tab_toolbar_button-min'])[2]",
        RESTORE: "(//button[@class='flexlayout__tab_toolbar_button-max'])[2]",
        BORROWER: {
          NAME: 'Repo Positions - Borrows',
          BTN_MAXIMIZE_WIDGET: "//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., 'Repo Positions - Borrows')]/following-sibling::div/button",
          FIRST_ROW: {
            CLOSE_REPO_BTN: "//div[contains(@id, 'contenttableRepoPositionsBorrows')]//div[contains(@id, 'row0RepoPositionsBorrows')]//div//div//div//button[@class='btn-positive action action-close']",
            CONFIRM_BTN: "//div[contains(@id, 'contenttableRepoPositionsBorrows')]//div[contains(@id, 'row0RepoPositionsBorrows')]//div//div//div//span//a[@class='option confirm-yes']",
            FIELDS: {
              EARLY_CLOSE_DT: "//div[contains(@id, 'contenttableRepoPositionsBorrows')]//div[contains(@id, 'row0RepoPositionsBorrows')]//div[contains(@class, 'col-earlyCloseTimestamp')]//div",
              CLOSE_DT: "//div[contains(@id, 'contenttableRepoPositionsBorrows')]//div[contains(@id, 'row0RepoPositionsBorrows')]//div[contains(@class, 'col-closeTimestamp')]//div",
              OPEN_DT: "//div[contains(@id, 'contenttableRepoPositionsBorrows')]//div[contains(@id, 'row0RepoPositionsBorrows')]//div[contains(@class, 'col-openTimestamp')]//div",
              ELAPSED_TIME: "//div[contains(@id, 'contenttableRepoPositionsBorrows')]//div[contains(@id, 'row0RepoPositionsBorrows')]//div[contains(@class, 'col-elapsedTimeId')]//div//div//span[contains(@id, 'elapsed-time-span')]",
              ID: "//div[contains(@id, 'contenttableRepoPositionsBorrows')]//div[contains(@id, 'row0RepoPositionsBorrows')]//div[contains(@class, 'col-id')]//div",
              STATUS: "//div[contains(@id, 'contenttableRepoPositionsBorrows')]//div[contains(@id, 'row0RepoPositionsBorrows')]//div[contains(@class, 'col-status')]//div",
              BORROWER_PRICE: "//div[contains(@id, 'contenttableRepoPositionsBorrows')]//div[contains(@id, 'row0RepoPositionsBorrows')]//div[contains(@class, 'col-lentRefPrice')]//div",
            }
          }
        },
        LENDER: {
          BTN_MAXIMIZE_WIDGET: "//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., 'Repo Positions - Lends')]/following-sibling::div/button",
          FIRST_ROW: {
            FIELDS: {
              EARLY_CLOSE_DT: "//div[contains(@id, 'contenttableRepoPositionsLends')]//div[contains(@id, 'row0RepoPositionsLends')]//div[contains(@class, 'col-earlyCloseTimestamp')]//div",
              CLOSE_DT: "//div[contains(@id, 'contenttableRepoPositionsLends')]//div[contains(@id, 'row0RepoPositionsLends')]//div[contains(@class, 'col-closeTimestamp')]//div",
              OPEN_DT: "//div[contains(@id, 'contenttableRepoPositionsLends')]//div[contains(@id, 'row0RepoPositionsLends')]//div[contains(@class, 'col-openTimestamp')]//div",
              ELAPSED_TIME: "//div[contains(@id, 'contenttableRepoPositionsLends')]//div[contains(@id, 'row0RepoPositionsLends')]//div[contains(@class, 'col-elapsedTime')]",
              ID: "//div[contains(@id, 'contenttableRepoPositionsLends')]//div[contains(@id, 'row0RepoPositionsLends')]//div[contains(@class, 'col-id')]//div",
              LEND_PRICE: "//div[contains(@id, 'contenttableRepoPositionsLends')]//div[contains(@id, 'row0RepoPositionsLends')]//div[contains(@class, 'col-lendPrice')]//div//span",
              FEES: "//div[contains(@id, 'contenttableRepoPositionsLends')]//div[contains(@id, 'row0RepoPositionsLends')]//div[contains(@class, 'feeInterest')]//div//span",
              INTEREST_RECEIVED: "//div[contains(@id, 'contenttableRepoPositionsLends')]//div[contains(@id, 'row0RepoPositionsLends')]//div[contains(@class, 'col-accruedInterest')]//div",
              STATUS: "//div[contains(@id, 'contenttableRepoPositionsLends')]//div[contains(@id, 'row0RepoPositionsLends')]//div[contains(@class, 'col-status')]//div",
            }
          },
          SCROLL_BAR_HORIZONTAL: "//div[contains(@id, 'jqxScrollThumbhorizontalScrollBarRepoPositionsLends')]"
        },
      }
    },
    HEADER_RATES_CONTAINER: {
      BTC_PRICE: "//div[contains(@class, 'HeaderRate')]//span[text() = 'BTC']/parent::div",
      ETH_PRICE: "//div[contains(@class, 'HeaderRate')]//span[text() = 'ETH']/parent::div"
    },
    DESK_LABEL: 'Trade Desk',
    RFQ_BTN: 'RFQ',
    REPO_BTN: 'Repo',
    OPEN_NEW_CUSTODY_ACCOUNT: "//div[contains(@class, 'clickable')]//a[contains(text(), 'Open New Custody Account')]",
    INPUT_EMAIL_ACCOUNT: "//input[@placeholder='Email Address' and @id='email']",
    BTN_REQUEST_ACCOUNT: "//button[@type='button' and text() = 'Request Account']"
  },
  CENTRAL: {
    DESK_LABEL: 'Central Command',
    WIDGETS: {
      USERS_LIST: {
        NAME: 'Users List',
        COLUMNS: {
          EMAIL: {
            FILTER_ICON: "//div[contains(@id, 'columntableUsersList')]//div[contains(@role, 'columnheader')]//div[contains(@style, 'height: 100%; width: 100%;')]//div[contains(@style, 'padding-bottom: 2px; overflow: hidden; text-overflow: ellipsis; text-align: left; margin-left: 4px; margin-right: 2px; margin-bottom: 7px; margin-top: 7px;')]//span[contains(@style, 'text-overflow: ellipsis; cursor: default;') and contains(text(), 'Email')]/parent::div/following-sibling::div[@class='iconscontainer']//div[contains(@class, 'filtericon')]",
            FILTER_WINDOW: {
              CONTAINS_LABEL: "//div[contains(@class, 'jqx-menu-wrapper')]//div[contains(@id, 'gridmenuUsersList')]//ul[contains(@class, 'jqx-menu-ul')]//li[contains(@class, 'filter  jqx-rc-all jqx-rc-all-metrodark')]//div[contains(@class, 'filter')]//div[contains(@class, 'filter')]//div[contains(@class, 'filter')][3]//input[contains(@class, 'filtertext1UsersList')]",
              FILTER_BUTON: "//span[contains(@id, 'filterbuttonUsersList')]",
              SORT_ASCENDING: "//div[contains(@id, 'gridmenuUsersList')]//li[@role = 'menuitem' and contains(text(), 'Sort Ascending')]",
              SORT_DESCENDING: "//div[contains(@id, 'gridmenuUsersList')]//li[@role = 'menuitem' and contains(text(), 'Sort Descending')]",
            },
            FIRST_ROW_VALUE: "//div[contains(@id, 'row0UsersList')]//div[contains(@class, 'col-email')]/div"
          },
          FIRST_NAME: {
            FILTER_ICON: "//div[contains(@id, 'columntableUsersList')]//div[contains(@role, 'columnheader')]//div[contains(@style, 'height: 100%; width: 100%;')]//div[contains(@style, 'padding-bottom: 2px; overflow: hidden; text-overflow: ellipsis; text-align: left; margin-left: 4px; margin-right: 2px; margin-bottom: 7px; margin-top: 7px;')]//span[contains(@style, 'text-overflow: ellipsis; cursor: default;') and contains(text(), 'First Name')]/parent::div/following-sibling::div[@class='iconscontainer']//div[contains(@class, 'filtericon')]",
            FILTER_WINDOW: {
              CONTAINS_LABEL: "//div[contains(@class, 'jqx-menu-wrapper')]//div[contains(@id, 'gridmenuUsersList')]//ul[contains(@class, 'jqx-menu-ul')]//li[contains(@class, 'filter  jqx-rc-all jqx-rc-all-metrodark')]//div[contains(@class, 'filter')]//div[contains(@class, 'filter')]//div[contains(@class, 'filter')][3]//input[contains(@class, 'filtertext1UsersList')]",
              FILTER_BUTON: "//span[contains(@id, 'filterbuttonUsersList')]"
            },
            FIRST_ROW_VALUE: "//div[contains(@id, 'row0UsersList')]//div[contains(@class, 'col-firstName')]/div"
          },
          USER_GROUP: {
            FILTER_ICON: "//div[contains(@id, 'columntableUsersList')]//div[contains(@role, 'columnheader')]//div[contains(@style, 'height: 100%; width: 100%;')]//div[contains(@style, 'padding-bottom: 2px; overflow: hidden; text-overflow: ellipsis; text-align: left; margin-left: 4px; margin-right: 2px; margin-bottom: 7px; margin-top: 7px;')]//span[contains(@style, 'text-overflow: ellipsis; cursor: default;') and contains(text(), 'Group')]/parent::div/following-sibling::div[@class='iconscontainer']//div[contains(@class, 'filtericon')]",
            FILTER_WINDOW: {
              CONTAINS_LABEL: "//div[contains(@class, 'jqx-menu-wrapper')]//div[contains(@id, 'gridmenuUsersList')]//ul[contains(@class, 'jqx-menu-ul')]//li[contains(@class, 'filter  jqx-rc-all jqx-rc-all-metrodark')]//div[contains(@class, 'filter')]//div[contains(@class, 'filter')]//div[contains(@class, 'filter')][3]//input[contains(@class, 'filtertext1UsersList')]",
              FILTER_BUTON: "//span[contains(@id, 'filterbuttonUsersList')]"
            },
            FIRST_ROW_VALUE: "//div[contains(@id, 'row0UsersList')]//div[contains(@class, 'col-groups')]/div"
          },
          LAST_NAME: {
            FIRST_ROW_VALUE: "//div[contains(@id, 'row0UsersList')]//div[contains(@class, 'col-lastName')]/div"
          },
          APPLICATIONS: {
            FIRST_ROW_VALUE: "//div[contains(@id, 'row0UsersList')]//div[contains(@class, 'col-applications')]/div"
          },
          STATUS: {
            FIRST_ROW_VALUE: "//div[contains(@id, 'row0UsersList')]//div[contains(@class, 'col-status')]/div"
          }
        },
        FOOTER: {
          ELEMENTS_QUANTITY: "//div[contains(@id, 'pagerUsersList')]//div//div[3]"
        },
        FIRST_ROW: "//div[contains(@id, 'contenttableUsersList')]//div[contains(@id, 'row0UsersList')]",
        BTN_MAXIMIZE_WIDGET: "(//div[@class = 'loadedContent']//button[contains(@class, '_button-min')])[2]",
        QTY_ROWS_SELECTOR: "//div[contains(@id, 'UsersList')]//div[contains(@id, 'dropdownlistContentgridpagerlistUsersList')]",
        QTY_ROWS_SELECTOR_VALUES: "//div[contains(@id, 'listitem2innerListBoxgridpagerlistUsersList')]",
        CONTAINER: "//div[contains(@id, 'contentUsersList')]"
      },
      USERS_LIST_BY_BROKER: {
        NAME: 'Trader Users List',
        COLUMNS: {
          EMAIL: {

            FILTER_ICON: "//div[contains(@id, 'columntableUsersList')]//div[contains(@role, 'columnheader')]//div[contains(@style, 'height: 100%; width: 100%;')]//div[contains(@style, 'padding-bottom: 2px; overflow: hidden; text-overflow: ellipsis; text-align: left; margin-left: 4px; margin-right: 2px; margin-bottom: 7px; margin-top: 7px;')]//span[contains(@style, 'text-overflow: ellipsis; cursor: default;') and contains(text(), 'Email')]/parent::div/following-sibling::div[@class='iconscontainer']//div[contains(@class, 'filtericon')]",
            FILTER_WINDOW: {
              CONTAINS_LABEL: "//div[contains(@class, 'jqx-menu-wrapper')]//div[contains(@id, 'gridmenuUsersList')]//ul[contains(@class, 'jqx-menu-ul')]//li[contains(@class, 'filter  jqx-rc-all jqx-rc-all-metrodark')]//div[contains(@class, 'filter')]//div[contains(@class, 'filter')]//div[contains(@class, 'filter')][3]//input[contains(@class, 'filtertext1UsersList')]",
              FILTER_BUTON: "//span[contains(@id, 'filterbuttonUsersList')]",
              SORT_ASCENDING: "//div[contains(@id, 'gridmenuUsersList')]//li[@role = 'menuitem' and contains(text(), 'Sort Ascending')]",
              SORT_DESCENDING: "//div[contains(@id, 'gridmenuUsersList')]//li[@role = 'menuitem' and contains(text(), 'Sort Descending')]",
            },
            FIRST_ROW_VALUE: "//div[contains(@id, 'row0UsersList')]//div[contains(@class, 'col-email')]/div"
          },
          FIRST_NAME: {
            FILTER_ICON: "//div[contains(@id, 'columntableTraderUsersList')]//div[@role = 'columnheader']//span[contains(text(), 'First Name')]/parent::div/following-sibling::div[@class='iconscontainer']//div[contains(@class, 'filtericon')]",
            FILTER_WINDOW: {
              CONTAINS_LABEL: "//div[@class ='filter']//input[contains(@class, 'filtertext1TraderUsersList')]",
              FILTER_BUTTON: "//span[contains(@id, 'filterbuttonTraderUsersList')]"
            },
            FIRST_ROW_VALUE: "//div[contains(@id, 'row0UsersList')]//div[contains(@class, 'col-firstName')]/div"
          },
          USER_GROUP: {
            FILTER_ICON: "//div[contains(@id, 'columntableTraderUsersList')]//div[contains(@role, 'columnheader')]//div[contains(@style, 'height: 100%; width: 100%;')]//div[contains(@style, 'padding-bottom: 2px; overflow: hidden; text-overflow: ellipsis; text-align: left; margin-left: 4px; margin-right: 2px; margin-bottom: 7px; margin-top: 7px;')]//span[contains(@style, 'text-overflow: ellipsis; cursor: default;') and contains(text(), 'Group')]/parent::div/following-sibling::div[@class='iconscontainer']//div[contains(@class, 'filtericon')]",
            FILTER_WINDOW: {
              CONTAINS_LABEL: "//div[@class ='filter']//input[contains(@class, 'filtertext1TraderUsersList')]",
              FILTER_BUTON: "//span[contains(@id, 'filterbuttonTraderUsersList')]"
            },
            FIRST_ROW_VALUE: "//div[contains(@id, 'row0UsersList')]//div[contains(@class, 'col-groups')]/div"
          },
          LAST_NAME: {
            FIRST_ROW_VALUE: "//div[contains(@id, 'row0UsersList')]//div[contains(@class, 'col-lastName')]/div"
          },
          APPLICATIONS: {
            FIRST_ROW_VALUE: "//div[contains(@id, 'row0UsersList')]//div[contains(@class, 'col-applications')]/div"
          },
          STATUS: {
            FIRST_ROW_VALUE: "//div[contains(@id, 'row0UsersList')]//div[contains(@class, 'col-status')]/div"
          }
        },
        FIRST_ROW: "//div[contains(@id, 'contenttableTraderUsersList')]//div[contains(@id, 'row0TraderUsersList')]",
      },
      USER_CREATION: {
        NAME: 'User Creation',
        CONTAINER: "//div[contains(@class, 'add_user_container')]",
        ADD_USER_BTN: "//div[contains(@class, 'add_user_container')]//div//div[1]//button[contains(@class, 'float-right btn-grey btn-big')]",
        FIRST_NAME: "(//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-form')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'small form-group')]//input[contains(@class, 'form-control')])[1]",
        LAST_NAME: "(//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-form')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'small form-group')]//input[contains(@class, 'form-control')])[2]",
        EMAIL: "(//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-form')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'small form-group')]//input[contains(@class, 'form-control')])[3]",
        STATUS: "//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-form')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'Select is-searchable Select--single')]//div[contains(@class, 'Select-control')]//div[contains(@id, 'react-select')]//div[contains(@class, 'Select-placeholder')]",
        USER_STATUS: "//div[contains(@class, 'user_container')]//p[contains(text(), 'Status')]/following::span[1]",
        PASSWORD: "(//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-form')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'small form-group')]//input[contains(@class, 'form-control')])[4]",
        PASSWORD_INVALID_ERROR: "//p[text() = 'Password *']/following-sibling::p",
        CONFIRM_PASSWORD: "(//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-form')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'small form-group')]//input[contains(@class, 'form-control')])[5]",
        GROUPS: "//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-form')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'Select userGroups is-searchable Select--multi')]//div[contains(@class, 'Select-control')]//div[contains(@id, 'react-select')]//div[contains(@class, 'Select-placeholder')]",
        USER_GROUPS: "//div[contains(@class, 'userGroups')]//div[@class='Select-value']",
        GROUPS_MSG_ERROR: "//p[text() = 'Groups']/following-sibling::p",
        CLOSE_FIRST_GROUP: '//div[@class = "add_user_container"]//div[contains(@class, "multiple")]/p[text() =  "Groups"]/following-sibling::div//span[@class="Select-value-icon"]',
        APPLICATIONS: "//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-form')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'Select userApplications')]//div[contains(@class, 'Select-control')]//div[contains(@id, 'react-select')]",
        USER_APPLICATIONS: "//div[contains(@class, 'userApplications')]//div[@class='Select-value']",
        APPLICATIONS_MSG_ERROR: "//p[text() = 'Applications']/following-sibling::p",
        CLOSE_FIRST_APPLICATION: '//div[@class = "add_user_container"]//div[contains(@class, "multiple")]/p[text() =  "Applications"]/following-sibling::div//span[@class="Select-value-icon"]',
        SUBMIT_BTN: "//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-actions')]//button[contains(@class, 'inline-block float-right btn-positive btn-big')]",
        CONFIRM_MODAL: {
          CONFIRM_BTN: "//div[contains(@class, 'small modal-dialog')]//div[contains(@class, 'modal-content')]//div[contains(@class, 'modal-footer')]//button[contains(@class, 'btn-positive')]"
        },
        BTN_UPDATE_USER: "//div[@class = 'add_user_container']//button[text() = 'UPDATE USER']",
        BTN_MAXIMIZE_WIDGET: "//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., 'User Creation')]/following-sibling::div/button",
      },
      USER_CREATION_BY_BROKER: {
        NAME: 'Trader User Creation',
        CONTAINER: "//div[contains(@class, 'add_user_container')]",
        ADD_USER_BTN: "//div[contains(@class, 'add_user_container')]//div//div[1]//button[contains(@class, 'float-right btn-grey btn-big')]",
        FIRST_NAME: "(//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-form')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'small form-group')]//input[contains(@class, 'form-control')])[1]",
        LAST_NAME: "(//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-form')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'small form-group')]//input[contains(@class, 'form-control')])[2]",
        EMAIL: "(//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-form')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'small form-group')]//input[contains(@class, 'form-control')])[3]",
        STATUS: "(//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-form')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'Select is-searchable Select--single')]//div[contains(@class, 'Select-control')]//div[contains(@id, 'react-select')]//div[contains(@class, 'Select-placeholder')])[1]",
        PASSWORD: "(//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-form')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'small form-group')]//input[contains(@class, 'form-control')])[4]",
        PASSWORD_INVALID_ERROR: "//p[text() = 'Password *']/following-sibling::p",
        CONFIRM_PASSWORD: "(//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-form')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'small form-group')]//input[contains(@class, 'form-control')])[5]",
        USER_GROUPS: "//div[contains(@class, 'userGroups')]//div[@class='Select-value']",
        GROUPS: "//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-form')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'Select userGroups is-searchable Select--multi')]//div[contains(@class, 'Select-control')]//div[contains(@id, 'react-select')]//div[contains(@class, 'Select-placeholder')]",
        GROUPS_MSG_ERROR: "//p[text() = 'Groups']/following-sibling::p",
        CLOSE_FIRST_GROUP: '//div[@class = "add_user_container"]//div[contains(@class, "multiple")]/p[text() =  "Groups"]/following-sibling::div//span[@class="Select-value-icon"]',
        APPLICATIONS: "(//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-form')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'Select')]//div[contains(@class, 'Select-control')]//div[contains(@id, 'react-select')])[3]",
        APPLICATIONS_MSG_ERROR: "//p[text() = 'Application']/following-sibling::p",
        APPLICATION_SELECTED: '//div[@class = "add_user_container"]//p[text() =  "Application"]/following-sibling::div//input[@name="applications"]',
        SUBMIT_BTN: "//div[contains(@class, 'add_user_container')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-actions')]//button[contains(@class, 'inline-block float-right btn-positive btn-big')]",
        CONFIRM_MODAL: {
          CONFIRM_BTN: "//div[contains(@class, 'small modal-dialog')]//div[contains(@class, 'modal-content')]//div[contains(@class, 'modal-footer')]//button[contains(@class, 'btn-positive')]",
        },
        BTN_UPDATE_USER: "//div[@class = 'add_user_container']//button[text() = 'UPDATE USER']",
      },
      COMPLETED_TRADES: {
        NAME: 'Completed Trades',
        CONTAINER: "//div[contains(@id, 'AuditSuccessfulTrades')]",
        CONTENT: "//div[contains(@id, 'contenttableAuditSuccessfulTrades')]",
        SCROLL_BAR_HORIZONTAL: '#jqxScrollThumbhorizontalScrollBarAuditSuccessfulTrades-13',
        MAXIMIZE: "(//button[contains(@class, 'flexlayout__tab_toolbar_button-min')])[2]",
        FILTER_CALENDAR: {
          FROM: {
            CONTAINER: "(//div[contains(@class, 'jqx-icon jqx-icon-metrodark jqx-icon-calendar jqx-icon-calendar-metrodark')])[1]",
            CURRENT_DAY: "(//table[contains(@id, 'cellTableViewinnerCalendarjqxWidget')]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[contains(@class, 'jqx-calendar-cell-today')])[1]",
            BACK_BUTTON: "(//div[contains(@class, 'jqx-calendar-title-navigation jqx-calendar-title-navigation-metrodark jqx-icon-arrow-left jqx-icon-arrow-left-metrodark')])[1]",
            DAY_ONE: "(//table[contains(@id, 'cellTableViewinnerCalendarjqxWidget')]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[contains(@class, 'jqx-calendar-cell-selected')])[1]",
            DATE_INPUT: "(//div[contains(@id, 'toolbarAuditSuccessfulTrades')]//div[contains(@style, 'overflow: hidden; position: relative; margin: 5px')]//div[contains(@id, 'jqxWidget')]//div//input)[1]",
            MONTH_TITLE: "(//td[contains(@id, 'calendarTitleHeaderViewinnerCalendarjqxWidget')]//div)[1]",
            CALENDAR_DAY: {
              FIRST_PART: "(//table[contains(@id, cellTableViewinnerCalendarjqxWidget)]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[(contains(@id, 'innerCalendarjqxWidget') and (text() = '",
              SECOND_PART: "'))])[1]"
            },
            CALENDAR_DAY_ACTUAL_MONTH: {
              FIRST_PART: "(//table[contains(@id, cellTableViewinnerCalendarjqxWidget)]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[(contains(@id, 'innerCalendarjqxWidget') and not(contains(@class, 'jqx-calendar-cell-othermonth')) and (text() = '",
              SECOND_PART: "'))])[1]"
            }
          },
          TO: {
            CONTAINER: "(//div[contains(@class, 'jqx-icon jqx-icon-metrodark jqx-icon-calendar jqx-icon-calendar-metrodark')])[2]",
            CURRENT_DAY: "(//table[contains(@id, 'cellTableViewinnerCalendarjqxWidget')]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[contains(@class, 'jqx-calendar-cell-today')])[2]",
            DATE_INPUT: "//div[contains(@id, 'toolbarAuditSuccessfulTrades')]//div[contains(@style, 'overflow: hidden; position: relative; margin: 5px')]//div[contains(@id, 'jqxWidget')][2]",
            CALENDAR_DAY_ACTUAL_MONTH: {
              FIRST_PART: "(//table[contains(@id, cellTableViewinnerCalendarjqxWidget)]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[(contains(@id, 'innerCalendarjqxWidget') and not(contains(@class, 'jqx-calendar-cell-othermonth')) and (text() = '",
              SECOND_PART: "'))])[2]"
            }
          },
          CURRENT_DAY_LAST_MONTH: "//table[contains(@id, 'cellTableViewinnerCalendarjqxWidget')]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[contains(@class, 'jqx-calendar-cell-selected') and not(contains(@class, 'jqx-calendar-cell-today'))]",
          SEARCH_BUTTON: "//div[contains(@id, 'toolbarAuditSuccessfulTrades')]//div[contains(@style, 'overflow: hidden; position: relative; margin: 5px')]//div[contains(@class, 'positive blotterActionButtons search-completedBlotter jqx-rc-all jqx-rc-all-metrodark jqx-button jqx-button-metrodark jqx-widget jqx-widget-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark')]"
        },
        FILTER_HOURS: {
          FROM: {
            CONTAINER: "(//div[contains(@class, 'jqx-position-absolute jqx-action-button jqx-action-button-metrodark jqx-default jqx-default-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark jqx-rc-r jqx-rc-r-metrodark')])[1]",
            HOURS: {
              UP_HOUR_ARROW: "(//div[contains(@id, 'innerTimejqxWidget')]//div[contains(@class, 'jqx-widget-content jqx-widget-content-metrodark jqx-widget jqx-widget-metrodark jqx-date-time-input-popup jqx-date-time-input-popup-metrodark')]//table//tbody//tr//td//a[contains(@class, 'increment-hour-column')]//div)[1]",
              UP_MINUTE_ARROW: "(//div[contains(@id, 'innerTimejqxWidget')]//div[contains(@class, 'jqx-widget-content jqx-widget-content-metrodark jqx-widget jqx-widget-metrodark jqx-date-time-input-popup jqx-date-time-input-popup-metrodark')]//table//tbody//tr//td//a[contains(@class, 'increment-minute-column')]//div)[1]",
              UP_SECOND_ARROW: "(//div[contains(@id, 'innerTimejqxWidget')]//div[contains(@class, 'jqx-widget-content jqx-widget-content-metrodark jqx-widget jqx-widget-metrodark jqx-date-time-input-popup jqx-date-time-input-popup-metrodark')]//table//tbody//tr//td//a[contains(@class, 'increment-second-column')]//div)[1]",
              UP_MERIDIAN_ARROW: "(//div[contains(@id, 'innerTimejqxWidget')]//div[contains(@class, 'jqx-widget-content jqx-widget-content-metrodark jqx-widget jqx-widget-metrodark jqx-date-time-input-popup jqx-date-time-input-popup-metrodark')]//table//tbody//tr//td[contains(@class, 'increment-meridian-column')]//a//div)[1]",
            }
          },
          TO: {
            CONTAINER: "(//div[contains(@class, 'jqx-position-absolute jqx-action-button jqx-action-button-metrodark jqx-default jqx-default-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark jqx-rc-r jqx-rc-r-metrodark')])[2]",
            HOURS: {
              UP_HOUR_ARROW: "(//div[contains(@id, 'innerTimejqxWidget')]//div[contains(@class, 'jqx-widget-content jqx-widget-content-metrodark jqx-widget jqx-widget-metrodark jqx-date-time-input-popup jqx-date-time-input-popup-metrodark')]/table/tbody/tr/td/a[contains(@class, 'increment-hour-column')])[2]",
              UP_MINUTE_ARROW: "(//div[contains(@id, 'innerTimejqxWidget')]//div[contains(@class, 'jqx-widget-content jqx-widget-content-metrodark jqx-widget jqx-widget-metrodark jqx-date-time-input-popup jqx-date-time-input-popup-metrodark')]//table//tbody//tr//td//a[contains(@class, 'increment-minute-column')]//div)[2]",
              UP_SECOND_ARROW: "(//div[contains(@id, 'innerTimejqxWidget')]//div[contains(@class, 'jqx-widget-content jqx-widget-content-metrodark jqx-widget jqx-widget-metrodark jqx-date-time-input-popup jqx-date-time-input-popup-metrodark')]//table//tbody//tr//td//a[contains(@class, 'increment-second-column')]//div)[2]",
              UP_MERIDIAN_ARROW: "(//div[contains(@id, 'innerTimejqxWidget')]//div[contains(@class, 'jqx-widget-content jqx-widget-content-metrodark jqx-widget jqx-widget-metrodark jqx-date-time-input-popup jqx-date-time-input-popup-metrodark')]//table//tbody//tr//td[contains(@class, 'increment-meridian-column')]//a//div)[2]",
            }
          }
        },
        FOOTER: {
          ELEMENTS_QUANTITY: "//div[contains(@id, 'pagerAuditSuccessfulTrades')]//div[contains(@style, 'line-height: 20px; width: 100%; height: 100%; position: relative; top: 2px;')]//div[contains(@style, 'margin-right: 7px; float: right;')][1]",
          GO_BACK_BUTTON: "//div[contains(@id, 'pagerAuditSuccessfulTrades')]//div[contains(@style, 'line-height: 20px; width: 100%; height: 100%; position: relative; top: 2px;')]//div[contains(@id, 'jqxWidget') and contains(@title, 'previous')]",
          GO_NEXT_BUTTON: "//div[contains(@id, 'pagerAuditSuccessfulTrades')]//div[contains(@style, 'line-height: 20px; width: 100%; height: 100%; position: relative; top: 2px;')]//div[contains(@id, 'jqxWidget') and contains(@title, 'next')]",
        },
        GROUP_WINDOW: {
          GROUP_BUTTON: "//div[contains(@id, 'gridmenuAuditSuccessfulTrades')]//ul[contains(@class, 'jqx-menu-ul')]//li[contains(text(), 'Group By this column')]",
          REMOVE_BUTTON: "//div[contains(@id, 'gridmenuAuditSuccessfulTrades')]//ul[contains(@class, 'jqx-menu-ul')]//li[contains(text(), 'Remove from groups')]"
        },
        COLUMNS: {
          DATE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='DATE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          TIME: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='TIME'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          ASSET_PAIR: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='ASSET PAIR'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          SIDE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='SIDE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          ASSET1: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='ASSET-1'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          RATE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='RATE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          QTY1: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='QTY-1'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          ASSET2: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='ASSET-2'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          QTY2: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='QTY-2'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          QUOTE_TYPE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='QUOTE TYPE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          ASSET1_POSITION: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='ASSET-1 POSITION'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          ASSET2_POSITION: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='ASSET-2 POSITION'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          COUNTERPARTY1: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='COUNTERPARTY 1'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          COUNTERPARTY2: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='COUNTERPARTY 2'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          PLATFORM: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='PLATFORM'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          CUSTODIAN: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='CUSTODIAN'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          ORDER_ID: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='ORDER ID'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          R_REF: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='R-REF'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          TRADE_MATCH_ID: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='TRADE MATCH ID'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          FEE_ASSET: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='FEE ASSET'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          FEE_QTY: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='FEE QTY'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          SPREAD_QTY: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='SPREAD QTY'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          NOTIFICATION_STATUS: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditSuccessfulTrades')]//div[contains(@role, 'columnheader') ]//span[text()='NOTIFICATION STATUS'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          }
        },
        GROUPS_FIELDS: {
          FIRST_ROW: {
            FIELD_NAME: "(//div[contains(@id, 'row0AuditSuccessfulTrades')]//div[contains(@class, ' jqx-grid-group-cell jqx-grid-group-cell-metrodark col-lastResponseDate')]//div[contains(@class, 'jqx-grid-groups-row jqx-grid-groups-row-metrodark')]//span)[1]",
            FIELD_CONTENT: "(//div[contains(@id, 'row0AuditSuccessfulTrades')]//div[contains(@class, ' jqx-grid-group-cell jqx-grid-group-cell-metrodark col-lastResponseDate')]//div//span)[2]"
          },
          DYNAMIC_ROW: {
            ROW: {
              FIRST_PART: "//div[contains(@id, 'row",
              SECOND_PART: "AuditSuccessfulTrades')]",
              FIELD_CONTAINER: '.col-lastResponseDate'
            },
            FIELD_CONTENT: {
              FIRST_PART: "//div[contains(@id, 'row",
              SECOND_PART: "AuditSuccessfulTrades')]//div[contains(@class, ' jqx-grid-group-cell jqx-grid-group-cell-metrodark col-lastResponseDate')]"
            }
          }
        },
      },
      DAILY_TRADES: {
        NAME: 'Daily Trades (5pm - 5pm EST)',
        CONTENT: "//div[contains(@id, 'contenttableDailyTrades')]",
        SCROLL_BAR_HORIZONTAL: '#jqxScrollThumbhorizontalScrollBarDailyTrades-13',
        MAXIMIZE: "(//button[contains(@class, 'flexlayout__tab_toolbar_button-min')])[2]",
        FOOTER: {
          ELEMENTS_QUANTITY: "//div[contains(@id, 'pagerDailyTrades')]//div[contains(@style, 'line-height: 20px; width: 100%; height: 100%; position: relative; top: 2px;')]//div[contains(@style, 'margin-right: 7px; float: right;')][1]",
          GO_BACK_BUTTON: "//div[contains(@id, 'pagerDailyTrades')]//div[contains(@style, 'line-height: 20px; width: 100%; height: 100%; position: relative; top: 2px;')]//div[contains(@id, 'jqxWidget') and contains(@title, 'previous')]",
        },
        GROUP_WINDOW: {
          GROUP_BUTTON: "//div[contains(@id, 'gridmenuDailyTrades')]//ul[contains(@class, 'jqx-menu-ul')]//li[contains(text(), 'Group By this column')]",
          REMOVE_BUTTON: "//div[contains(@id, 'gridmenuDailyTrades')]//ul[contains(@class, 'jqx-menu-ul')]//li[contains(text(), 'Remove from groups')]"
        },
        COLUMNS: {
          DATE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='DATE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          TIME: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='TIME'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          STATUS: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='STATUS'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          ASSET_PAIR: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='ASSET PAIR'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          SIDE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='SIDE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          ASSET1: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='ASSET-1'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          FILLED: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='FILLED'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          AVG_RATE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='AVG RATE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          RATE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='RATE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          QTY_1: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='QTY-1'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          ASSET2: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='ASSET-2'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          QTY_2: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='QTY-2'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          TYPE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='TYPE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          QUOTE_TYPE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='QUOTE TYPE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          COUNTERPARTY_1: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='COUNTERPARTY 1'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          COUNTERPARTY_2: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='COUNTERPARTY 2'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          PLATFORM: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='PLATFORM'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          TIF: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='TIF'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          ORDER_ID: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='ORDER ID'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          R_REF: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='R-REF'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          FEE_ASSET: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='FEE ASSET'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          FEE_QTY: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='FEE QTY'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          SPREAD_QTY: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='SPREAD QTY'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          MESSAGE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='MESSAGE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          CUSTODIAN: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='CUSTODIAN'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          EVENT_ID: {
            GROUP_ICON: "((//div[contains(@id, 'columntableDailyTrades')]//div[contains(@role, 'columnheader') ]//span[text()='EVENT ID'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          }
        },
        FIELDS: {
          FIRST_ROW: {
            DATE: "//div[contains(@id, 'contenttableDailyTrades')]//div[contains(@id, 'row0DailyTrades')]//div[contains(@class, 'col-lastResponseDate')]//div",
            TIME: "//div[contains(@id, 'contenttableDailyTrades')]//div[contains(@id, 'row0DailyTrades')]//div[contains(@class, 'col-time')]//div",
          },
          DYNAMIC_ROW: {
            DATE: {
              ROW_FIRST_PART: "//div[contains(@id, 'contenttableDailyTrades')]//div[contains(@id, 'row",
              ROW_SECOND_PART: "DailyTrades')]",
              ROW_THIRD_PART: "//div[contains(@class, 'col-lastResponseDate')]//div",
              ROW_DATE_CONTAINER: '.col-lastResponseDate'
            },
            TIME: {
              ROW_FIRST_PART: "//div[contains(@id, 'contenttableDailyTrades')]//div[contains(@id, 'row",
              ROW_SECOND_PART: "DailyTrades')]",
              ROW_THIRD_PART: "//div[contains(@class, 'col-time')]//div",
            }
          }
        },
        GROUPS_FIELDS: {
          FIRST_ROW: {
            FIELD_NAME: "(//div[contains(@id, 'row0DailyTrades')]//div[contains(@class, 'jqx-grid-group-cell jqx-grid-group-cell-metrodark jqx-grid-group-details-cell jqx-grid-group-details-cell-metrodark')]//div[contains(@class, 'jqx-grid-groups-row jqx-grid-groups-row-metrodark')]//span)[1]",
            FIELD_CONTENT: "(//div[contains(@id, 'row0DailyTrades')]//div[contains(@class, 'jqx-grid-group-cell jqx-grid-group-cell-metrodark jqx-grid-group-details-cell jqx-grid-group-details-cell-metrodark')]//div[contains(@class, 'jqx-grid-groups-row jqx-grid-groups-row-metrodark')]//span)[2]"
          },
        },
      },
      AUDIT_BLOTTER: {
        NAME: 'Audit Blotter',
        CONTENT: "//div[contains(@id, 'contenttableAuditTrades')]",
        SCROLL_BAR_HORIZONTAL: '#jqxScrollThumbhorizontalScrollBarAuditTrades-13',
        MAXIMIZE: "(//button[contains(@class, 'flexlayout__tab_toolbar_button-min')])[2]",
        CLOSE: "(//div[contains(@class, 'flexlayout__tab_button_trailing')])[2]",
        FILTER_CALENDAR: {
          FROM: {
            CONTAINER: "(//div[contains(@class, 'jqx-icon jqx-icon-metrodark jqx-icon-calendar jqx-icon-calendar-metrodark')])[1]",
            CURRENT_DAY: "(//table[contains(@id, 'cellTableViewinnerCalendarjqxWidget')]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[contains(@class, 'jqx-calendar-cell-today')])[1]",
            BACK_BUTTON: "(//div[contains(@class, 'jqx-calendar-title-navigation jqx-calendar-title-navigation-metrodark jqx-icon-arrow-left jqx-icon-arrow-left-metrodark')])[1]",
            DAY_ONE: "(//table[contains(@id, 'cellTableViewinnerCalendarjqxWidget')]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[contains(@class, 'jqx-calendar-cell-selected')])[1]",
            LAST_DAY: "(//table[contains(@id, 'cellTableViewinnerCalendarjqxWidget')]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[contains(@class, 'jqx-calendar-cell-today')]/preceding-sibling::td)[1]",
            DATE_INPUT: "(//div[contains(@id, 'toolbarAuditTrades')]//div[contains(@style, 'overflow: hidden; position: relative; margin: 5px')]//div[contains(@id, 'jqxWidget')]//div//input)[1]",
            MONTH_TITLE: "(//td[contains(@id, 'calendarTitleHeaderViewinnerCalendarjqxWidget')]//div)[1]",
            CALENDAR_DAY: {
              FIRST_PART: "(//table[contains(@id, cellTableViewinnerCalendarjqxWidget)]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[(contains(@id, 'innerCalendarjqxWidget') and (text() = '",
              SECOND_PART: "'))])[1]"
            },
            CALENDAR_DAY_ACTUAL_MONTH: {
              FIRST_PART: "(//table[contains(@id, cellTableViewinnerCalendarjqxWidget)]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[(contains(@id, 'innerCalendarjqxWidget') and not(contains(@class, 'jqx-calendar-cell-othermonth')) and (text() = '",
              SECOND_PART: "'))])[1]"
            }
          },
          TO: {
            CONTAINER: "(//div[contains(@class, 'jqx-icon jqx-icon-metrodark jqx-icon-calendar jqx-icon-calendar-metrodark')])[2]",
            CURRENT_DAY: "(//table[contains(@id, 'cellTableViewinnerCalendarjqxWidget')]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[contains(@class, 'jqx-calendar-cell-today')])[2]",
            BACK_BUTTON: "(//div[contains(@class, 'jqx-calendar-title-navigation jqx-calendar-title-navigation-metrodark jqx-icon-arrow-left jqx-icon-arrow-left-metrodark')])[2]",
            DATE_INPUT: "//div[contains(@id, 'toolbarAuditTrades')]//div[contains(@style, 'overflow: hidden; position: relative; margin: 5px')]//div[contains(@id, 'jqxWidget')][2]",
            MONTH_TITLE: "(//td[contains(@id, 'calendarTitleHeaderViewinnerCalendarjqxWidget')]//div)[2]",
            CALENDAR_DAY_ACTUAL_MONTH: {
              FIRST_PART: "(//table[contains(@id, cellTableViewinnerCalendarjqxWidget)]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[(contains(@id, 'innerCalendarjqxWidget') and not(contains(@class, 'jqx-calendar-cell-othermonth')) and (text() = '",
              SECOND_PART: "'))])[2]"
            },
          },
          CURRENT_DAY_LAST_MONTH: "//table[contains(@id, 'cellTableViewinnerCalendarjqxWidget')]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[contains(@class, 'jqx-calendar-cell-selected') and not(contains(@class, 'jqx-calendar-cell-today'))]",
          SEARCH_BUTTON: "//div[contains(@id, 'toolbarAuditTrades')]//div[contains(@style, 'overflow: hidden; position: relative; margin: 5px')]//div[contains(@class, 'positive blotterActionButtons search-auditBlotter jqx-rc-all jqx-rc-all-metrodark jqx-button jqx-button-metrodark jqx-widget jqx-widget-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark')]"
        },
        FILTER_HOURS: {
          FROM: {
            CONTAINER: "(//div[contains(@class, 'jqx-position-absolute jqx-action-button jqx-action-button-metrodark jqx-default jqx-default-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark jqx-rc-r jqx-rc-r-metrodark')])[1]",
            HOURS: {
              UP_HOUR_ARROW: "(//div[contains(@id, 'innerTimejqxWidget')]//div[contains(@class, 'jqx-widget-content jqx-widget-content-metrodark jqx-widget jqx-widget-metrodark jqx-date-time-input-popup jqx-date-time-input-popup-metrodark')]//table//tbody//tr//td//a[contains(@class, 'increment-hour-column')]//div)[1]",
              UP_MINUTE_ARROW: "(//div[contains(@id, 'innerTimejqxWidget')]//div[contains(@class, 'jqx-widget-content jqx-widget-content-metrodark jqx-widget jqx-widget-metrodark jqx-date-time-input-popup jqx-date-time-input-popup-metrodark')]//table//tbody//tr//td//a[contains(@class, 'increment-minute-column')]//div)[1]",
              UP_SECOND_ARROW: "(//div[contains(@id, 'innerTimejqxWidget')]//div[contains(@class, 'jqx-widget-content jqx-widget-content-metrodark jqx-widget jqx-widget-metrodark jqx-date-time-input-popup jqx-date-time-input-popup-metrodark')]//table//tbody//tr//td//a[contains(@class, 'increment-second-column')]//div)[1]",
              UP_MERIDIAN_ARROW: "(//div[contains(@id, 'innerTimejqxWidget')]//div[contains(@class, 'jqx-widget-content jqx-widget-content-metrodark jqx-widget jqx-widget-metrodark jqx-date-time-input-popup jqx-date-time-input-popup-metrodark')]//table//tbody//tr//td[contains(@class, 'increment-meridian-column')]//a//div)[1]",
            }
          },
          TO: {
            CONTAINER: "(//div[contains(@class, 'jqx-position-absolute jqx-action-button jqx-action-button-metrodark jqx-default jqx-default-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark jqx-rc-r jqx-rc-r-metrodark')])[2]",
            HOURS: {
              UP_HOUR_ARROW: "(//div[contains(@id, 'innerTimejqxWidget')]//div[contains(@class, 'jqx-widget-content jqx-widget-content-metrodark jqx-widget jqx-widget-metrodark jqx-date-time-input-popup jqx-date-time-input-popup-metrodark')]/table/tbody/tr/td/a[contains(@class, 'increment-hour-column')])[2]",
              UP_MINUTE_ARROW: "(//div[contains(@id, 'innerTimejqxWidget')]//div[contains(@class, 'jqx-widget-content jqx-widget-content-metrodark jqx-widget jqx-widget-metrodark jqx-date-time-input-popup jqx-date-time-input-popup-metrodark')]//table//tbody//tr//td//a[contains(@class, 'increment-minute-column')]//div)[2]",
              UP_SECOND_ARROW: "(//div[contains(@id, 'innerTimejqxWidget')]//div[contains(@class, 'jqx-widget-content jqx-widget-content-metrodark jqx-widget jqx-widget-metrodark jqx-date-time-input-popup jqx-date-time-input-popup-metrodark')]//table//tbody//tr//td//a[contains(@class, 'increment-second-column')]//div)[2]",
              UP_MERIDIAN_ARROW: "(//div[contains(@id, 'innerTimejqxWidget')]//div[contains(@class, 'jqx-widget-content jqx-widget-content-metrodark jqx-widget jqx-widget-metrodark jqx-date-time-input-popup jqx-date-time-input-popup-metrodark')]//table//tbody//tr//td[contains(@class, 'increment-meridian-column')]//a//div)[2]",
            }
          }
        },
        FOOTER: {
          ELEMENTS_QUANTITY: "//div[contains(@id, 'pagerAuditTrades')]//div[contains(@style, 'line-height: 20px; width: 100%; height: 100%; position: relative; top: 2px;')]//div[contains(@style, 'margin-right: 7px; float: right;')][1]",
          GO_BACK_BUTTON: "//div[contains(@id, 'pagerAuditTrades')]//div[contains(@style, 'line-height: 20px; width: 100%; height: 100%; position: relative; top: 2px;')]//div[contains(@id, 'jqxWidget') and contains(@title, 'previous')]",
          GO_NEXT_BUTTON: "//div[contains(@id, 'pagerAuditTrades')]//div[contains(@style, 'line-height: 20px; width: 100%; height: 100%; position: relative; top: 2px;')]//div[contains(@id, 'jqxWidget') and contains(@title, 'next')]",
        },
        GROUP_WINDOW: {
          GROUP_BUTTON: "//div[contains(@id, 'gridmenuAuditTrades')]//ul[contains(@class, 'jqx-menu-ul')]//li[contains(text(), 'Group By this column')]",
          REMOVE_BUTTON: "//div[contains(@id, 'gridmenuAuditTrades')]//ul[contains(@class, 'jqx-menu-ul')]//li[contains(text(), 'Remove from groups')]"
        },
        COLUMNS: {
          DATE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='DATE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          TIME: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='TIME'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          STATUS: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='STATUS'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          ASSET_PAIR: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='ASSET PAIR'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          SIDE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='SIDE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          ASSET1: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='ASSET-1'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          FILLED: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='FILLED'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          AVG_RATE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='AVG RATE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          RATE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='RATE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          QTY_1: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='QTY-1'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          ASSET2: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='ASSET-2'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          QTY_2: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='QTY-2'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          TYPE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='TYPE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          QUOTE_TYPE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='QUOTE TYPE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          COUNTERPARTY_1: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='COUNTERPARTY 1'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          COUNTERPARTY_2: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='COUNTERPARTY 2'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          PLATFORM: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='PLATFORM'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          TIF: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='TIF'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          ORDER_ID: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='ORDER ID'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          R_REF: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='R-REF'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          FEE_ASSET: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='FEE ASSET'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          FEE_QTY: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='FEE QTY'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          SPREAD_QTY: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='SPREAD QTY'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          MESSAGE: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='MESSAGE'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          CUSTODIAN: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='CUSTODIAN'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
          EVENT_ID: {
            GROUP_ICON: "((//div[contains(@id, 'columntableAuditTrades')]//div[contains(@role, 'columnheader') ]//span[text()='EVENT ID'])/following::div[1])//div[contains(@class, 'filtericon jqx-widget-header jqx-widget-header-metrodark')]",
          },
        },
        GROUPS_FIELDS: {
          FIRST_ROW: {
            FIELD_NAME: "(//div[contains(@id, 'row0AuditTrades')]//div[contains(@class, 'jqx-grid-group-cell jqx-grid-group-cell-metrodark jqx-grid-group-details-cell jqx-grid-group-details-cell-metrodark')]//div[contains(@class, 'jqx-grid-groups-row jqx-grid-groups-row-metrodark')]//span)[1]",
            FIELD_CONTENT: "(//div[contains(@id, 'row0AuditTrades')]//div[contains(@class, 'jqx-grid-group-cell jqx-grid-group-cell-metrodark jqx-grid-group-details-cell jqx-grid-group-details-cell-metrodark')]//div[contains(@class, 'jqx-grid-groups-row jqx-grid-groups-row-metrodark')]//span)[2]"
          },
          DYNAMIC_ROW: {
            ROW: {
              FIRST_PART: "//div[contains(@id, 'row",
              SECOND_PART: "AuditTrades')]",
              FIELD_CONTAINER: '.col-lastResponseDate'
            },
            FIELD_CONTENT: {
              FIRST_PART: "//div[contains(@id, 'row",
              SECOND_PART: "AuditTrades')]//div[contains(@class, 'jqx-grid-group-cell jqx-grid-group-cell-metrodark jqx-grid-group-details-cell jqx-grid-group-details-cell-metrodark')]"
            }
          }
        },
      },
      ENTITY_WHITELIST: {
        NAME: "Entity Whitelist",
        ENTITY_TYPE: "//div[contains(@class, 'entity_whitelist')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'Select is-searchable Select--single')]//div[contains(@class, 'Select-control')]//span[contains(@class, 'Select-arrow-zone')]",
        ENTITY_NAME: "//div[contains(@class, 'entity_whitelist')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'Select is-searchable Select--single')]//div[contains(@class, 'Select-control')]//span[contains(@class, 'Select-arrow-zone')]",
        ENTITY_TYPE_ITEM_FIRST_PART: "//div[contains(@class, 'entity_whitelist')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'Select')]//div[contains(@class, 'Select-menu-outer')]//div[contains(@class, 'Select-menu')]//div[contains(@aria-label, '",
        ENTITY_TYPE_ITEM_SECOND_PART: "')]",
        ENTITY_NAME_ITEM_FIRST_PART: "//div[contains(@class, 'entity_whitelist')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12')]//div[contains(@class, 'col-xs-6 col-sm-6 col-lg-6')]//div[contains(@class, 'Select')]//div[contains(@class, 'Select-menu-outer')]//div[contains(@class, 'Select-menu')]//div[contains(@aria-label, '",
        ENTITY_NAME_ITEM_SECOND_PART: "')]",
        ENTITY_LIST: "//div[contains(@class, 'entity_whitelist')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12')]//div[contains(@class, 'col-xs-4 col-sm-4 col-lg-4')]//p[contains(text(), 'Traders')]/following-sibling::ul//li",
        ENTITY_CHECKBOX_FIRST_PART: "//div[contains(@class, 'entity_whitelist')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12')]//div[contains(@class, 'col-xs-4 col-sm-4 col-lg-4')]//ul//li//label[contains(@class, 'switch')]//input[contains(@type, 'checkbox') and contains(@value, '",
        ENTITY_CHECKBOX_SECOND_PART: "')]",
        SUBMIT_BTN: "//div[contains(@class, 'entity_whitelist')]//div[contains(@class, 'row')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12')]//div[contains(@class, 'col-xs-12 col-sm-12 col-lg-12 otc-actions')]//div[contains(@class, 'col-xs-11 col-sm-11 col-lg-11')]//button[contains(@class, 'inline-block float-right btn-positive btn-big')]"
      },
      TAKER_SPREAD_TEMPLATES: {
        NAME: 'Taker Spread Templates',
        CLOSE_BUTTON: "//div[contains(@class, 'flexlayout__tab_button_content') and contains(text(), 'Taker Spread Templates')]//following-sibling::div",
        TEMPLATE_NAME: "//input[@id = 'newTemplate']",
        DEFAULT_SPREAD: "//input[@id = 'defaultSpread']",
        DEFAULT_FILL_TO_SPREAD: "//input[@id = 'defaultFillToSpread']",
        BTN_ADD: "//button[text() = 'Add']",
        BTN_DELETE: "//button[@title = 'Delete Spread Template']",
        BTN_CONFIRM_DELETE: "//button[text() = 'ACCEPT']",
        SELECTED_SPREAD_TEMPLATE_FIRST_PART: "//div[@class = 'Select-value']//span[@class = 'Select-value-label' and @aria-selected = 'true' and text() = '",
        SELECTED_SPREAD_TEMPLATE_SECOND_PART: "']",
        SPREAD_TEMPLATE_SELECT_INPUT: "//div[@class = 'spread-templates']//div[@class = 'rs-header']//div//div[@class = 'col-xs-12 col-sm-12 col-lg-12']//div[@class = 'col-xs-3 col-sm-3 col-lg-3']//div[@class = 'Select is-searchable Select--single']//div[@class = 'Select-control']//div[@class = 'Select-multi-value-wrapper']//div[@class = 'Select-input']/input",
        SPREAD_TEMPLATE_SELECT_ITEM_FIRST_PART: "//div[@aria-label = '",
        SPREAD_TEMPLATE_SELECT_ITEM_SECOND_PART: "']",
        ASSET_FILTER: "//div[contains(@id,'columntableTakerSpreadTemplate')]//div[@role='columnheader']//div//div//span[text() = 'SYMBOL']/parent::div/following-sibling::div/div[contains(@class, 'filtericon')]",
        ASSET_FILTER_INPUT_TEXT: "//input[contains(@class, 'filtertext1TakerSpreadTemplateWidget')]",
        ASSET_FILTER_BUTTON: "//span[contains(@id, 'filterbuttonTakerSpreadTemplateWidget')]",
        ROW_0: {
          BID_SPREAD_PERCENTAGE_ROW: "//div[contains(@class, 'col-bidSpread')]",
          BID_SPREAD_PERCENTAGE_INPUT: "//div[contains(@id, 'bidSpread')]//input",
          OFFER_SPREAD_PERCENTAGE_ROW: "//div[contains(@class, 'col-offerSpread')]",
          OFFER_SPREAD_PERCENTAGE_INPUT: "//div[contains(@id, 'askSpread')]//input",
          FILL_TO_SPREAD_PERCENTAGE_ROW: "//div[contains(@class, 'col-fillToSpread')]",
          FILL_TO_SPREAD_INPUT: "//div[contains(@id, 'fillToSpread')]//input"
        }
      },
      ENTITIES_SPREAD: {
        NAME: 'Entities Spread',
        CLOSE_BUTTON: "//div[contains(@class, 'flexlayout__tab_button_content') and contains(text(), 'Entities Spread')]//following-sibling::div",
        CLIENT_ENTITY: "//div[@class = 'entities-spread']//div[@class = 'rs-header']//div[@class = 'col-xs-12 col-sm-12 col-lg-12']//div[@class = 'col-xs-10 col-sm-10 col-lg-10']//div[@class = 'Select is-searchable Select--single']//div[@class = 'Select-control']//div[@class = 'Select-multi-value-wrapper']//div[text() = 'Client Entity']/following-sibling::div/input",
        SPREAD_BROKER: "//div[@class = 'entities-spread']//div[@class = 'rs-header']//div[@class = 'col-xs-12 col-sm-12 col-lg-12']//div[@class = 'col-xs-10 col-sm-10 col-lg-10']//div[@class = 'Select is-searchable Select--single']//div[@class = 'Select-control']//div[@class = 'Select-multi-value-wrapper']//div[text() = 'Spread Broker']/following-sibling::div/input",
        BROKER_USER: "//div[@class = 'entities-spread']//div[@class = 'rs-header']//div[@class = 'col-xs-12 col-sm-12 col-lg-12']//div[@class = 'col-xs-10 col-sm-10 col-lg-10']//div[@class = 'Select is-searchable Select--single']//div[@class = 'Select-control']//div[@class = 'Select-multi-value-wrapper']//div[text() = 'Broker User']/following-sibling::div/input",
        TEMPLATE: "//div[@class = 'entities-spread']//div[@class = 'rs-header']//div[@class = 'col-xs-12 col-sm-12 col-lg-12']//div[@class = 'col-xs-10 col-sm-10 col-lg-10']//div[@class = 'Select is-searchable Select--single']//div[@class = 'Select-control']//div[@class = 'Select-multi-value-wrapper']//div[text() = 'Select Template']/following-sibling::div/input",
        BTN_SAVE: "//button[text() = 'Save']",
        BTN_DELETE: "//button[@title = 'Delete Entity Spread']",
        SPREAD_TO_DELETE_FIRST_PART: "//div[text() = '",
        SPREAD_TO_DELETE_SECOND_PART: "']",
        SPREAD_TO_ADD_FIRST_PART: "//div[text() = '",
        SPREAD_TO_ADD_SECOND_PART: "']",
        SELECT_ITEM_FIRST_PART: "//div[@aria-label = '",
        SELECT_ITEM_SECOND_PART: "']",
      },
      APPLICATIONS_LIST: {
        NAME: "Applications List",
        ROW: {
          FIELD_NAME_FIRST_PART: "//div[contains(@role, 'row')]//div[contains(@role, 'gridcell') and contains(@class, 'col-name')]//div[contains(text(), '",
          FIELD_NAME_SECOND_PART: "')]/parent::div/parent::div",
          FIELD_STATUS_FIRST_PART: "//div[contains(@role, 'row')]//div[contains(@role, 'gridcell') and contains(@class, 'col-name')]//div[contains(text(), '",
          FIELD_STATUS_SECOND_PART: "')]/parent::div/following-sibling::div/following-sibling::div/following-sibling::div/following-sibling::div//div//span",
        }
      },
      APPLICATIONS_CREATION: {
        NAME: 'Application Creation',
        UPDATE_APPLICATION_BUTTON: "//div[contains(@class, 'add_application_container')]//div//div//button[contains(text(), 'UPDATE APPLICATION')]",
        ENABLE_2FA_SLIDER: "//div[contains(@class, 'add_application_container')]//div//div//div//p[contains(text(), 'Enabled')]//following-sibling::div//label//span[contains(@class, 'slider round')]",
        SUBMIT_BUTTON: "//div[contains(@class, 'add_application_container')]//div//div//button[contains(text(), 'SUBMIT')]",
        CONFIRM_MODAL: {
          CONFIRM_BTN: "//div[contains(@class, 'modal-content')]//div[contains(@class, 'modal-footer')]//button[contains(text(), 'CONFIRM')]"
        }
      },
      POST_TRADES: {
        NAME: 'Post Trades',
        HORIZONTAL_SCROLLBAR: "#jqxScrollThumbhorizontalScrollBarCentralPostTradesBlotter-13",
        REST_CURRENT_OPERATION_ROW_FIRST_PART: "//div[@class = 'jqx-grid-cell-left-align' and contains(text(), '",
        UPLOAD_CURRENT_OPERATION_ROW_FIRST_PART: "//div[@style = 'overflow:hidden; text-overflow: ellipsis;' and contains(text(), '",
        REST_CURRENT_OPERATION_ROW_SECOND_PART: "')]/parent::div/parent::div",
        UPLOAD_CURRENT_OPERATION_ROW_SECOND_PART: "')]/parent::div/parent::div/parent::div",
        MAXIMIZE_BTN: "(//button[contains(@class, 'flexlayout__tab_toolbar_button-min')])[1]",
        BTN_MAX_MIN: "//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., 'Post Trades')]/following-sibling::div/button",
        UPLOAD_FILE_BTN: "//button[text() = 'UPLOAD FILE']",
        FIRST_ROW: {
          COLUMNS: {
            STATUS: "//div[@role = 'row' and contains(@id, 'row0CentralPostTradesBlotter')]//div[contains(@class, 'col-status')]//div//span"
          }
        },
        COLUMNS: {
          TRADER_REPORT_ID: "//span[text() = 'TRADER REPORT ID']",
          FIX_MESSAGE: "//span[text() = 'FIX MESSAGE']",
          CURRENT_OPERATION: {
            STATUS_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            STATUS_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-status')]//div//span",
            SYMBOL_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            SYMBOL_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-symbol')]//div//span",
            QTY_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            QTY_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-quantity') and not(contains(@class, 'col-quantity2'))]//div//span",
            PRICE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            PRICE_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-price')]//div//span",
            SIDE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            SIDE_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-side')]//div//span",
            CURRENCY_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            CURRENCY_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-currency')]//div//span",
            DEAL_CODE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            DEAL_CODE_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-partyDealcode')]//div",
            TRADER_ID_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            TRADER_ID_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-partyTraderId')]//div",
            CPTY_DEAL_CODE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            CPTY_DEAL_CODE_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-counterPartyDealcode')]//div",
            CPTY_TRADER_ID_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            CPTY_TRADER_ID_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-counterPartyTraderId')]//div",
            CUSTODIAN_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            CUSTODIAN_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-custodian')]//div",
            TRADE_REPORT_ID_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            TRADE_REPORT_ID_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-tradeReportId')]//div",
            EXEC_ID_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            EXEC_ID_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-execId')]//div",
            SOURCE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            SOURCE_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-source')]//div",
            ERROR_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            ERROR_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-error')]//div",
            FIX_MESSAGE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            FIX_MESSAGE_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-fixMessage')]//div//div",
            DATE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            DATE_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-txDate')]//div",
            TIME_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            TIME_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-txTime')]//div",
            QTY2_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            QTY2_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-quantity2')]//div//span"
          }
        },
        UPLOAD_FILE_MODAL: {
          SELECT_FILE_BTN: "//input[@id = 'input-file']",
          CONFIRM_BTN: "//button[text() = 'CONFIRM']"
        },
        UPLOAD_ERROR_MESSAGE: "//span[@class = 'status-rejected' and contains(text(), 'ERROR')]"
      },
      TRANSFER_HISTORY: {
        NAME: "Transfer History",
        BTN_MAXIMIZE_WIDGET: "//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., 'Transfer History')]/following-sibling::div/button",
        FILTER_CALENDAR: {
          FROM: {
            CONTAINER: "(//div[contains(@id, 'jqxWidget')]//div[contains(@class, 'jqx-max-size jqx-position-relative')]//div[contains(@class, 'jqx-position-absolute jqx-action-button jqx-action-button-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark jqx-default jqx-default-metrodark')])[1]",
            CALENDAR_TITLE: "(//div[contains(@class, 'jqx-calendar-title-content jqx-calendar-title-content-metrodark')])[1]",
            CURRENT_DAY: "(//table[contains(@id, 'cellTableViewinnerCalendarjqxWidget')]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[contains(@class, 'jqx-calendar-cell-today')])[1]",
            CALENDAR_DAY: {
              FIRST_PART: "(//table[contains(@id, cellTableViewinnerCalendarjqxWidget)]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[(contains(@id, 'innerCalendarjqxWidget') and (text() = '",
              SECOND_PART: "'))])[1]"
            },
          },
          TO: {
            CONTAINER: "(//div[contains(@id, 'jqxWidget')]//div[contains(@class, 'jqx-max-size jqx-position-relative')]//div[contains(@class, 'jqx-position-absolute jqx-action-button jqx-action-button-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark jqx-default jqx-default-metrodark')])[2]",
            CALENDAR_TITLE: "(//div[contains(@class, 'jqx-calendar-title-content jqx-calendar-title-content-metrodark')])[2]",
            CURRENT_DAY: "(//table[contains(@id, 'cellTableViewinnerCalendarjqxWidget')]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[contains(@class, 'jqx-calendar-cell-today')])[2]",
            CALENDAR_DAY: {
              FIRST_PART: "(//table[contains(@id, cellTableViewinnerCalendarjqxWidget)]//tbody[contains(@style, 'border: none; background: transparent;')]//tr[contains(@role, 'row')]//td[(contains(@id, 'innerCalendarjqxWidget') and (text() = '",
              SECOND_PART: "'))])[2]"
            },
          },
          SEARCH_BUTTON: '//div[@role = "button" and contains(@class, "blotterActionButtons") and contains(@class, "positive")]'
        },
        FILTER_STATUS: '(//div[contains(@id, "dropdownlistWrapperjqxWidget")])[3]',
        FILTER_STATUS_SELECT_PRE: '(//div[@role = "option"]//span[contains(text() , "',
        FILTER_STATUS_SELECT_POST: '")])',
        SYMBOL: "//div[contains(@class, 'jqx-widget jqx-widget-metrodark jqx-dropdownlist-state-normal jqx-dropdownlist-state-normal-metrodark jqx-rc-all jqx-rc-all-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark jqx-default jqx-default-metrodark jqx-dropdownlist-state-selected jqx-dropdownlist-state-selected-metrodark jqx-fill-state-pressed jqx-fill-state-pressed-metrodark jqx-rc-b-expanded jqx-rc-b-expanded-metrodark')]",
        SEARCH: "//div[contains(@class, 'positive blotterActionButtons search-positionBlotter jqx-rc-all jqx-rc-all-metrodark jqx-button jqx-button-metrodark jqx-widget jqx-widget-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark')]",
        ROWS_RESULTS: "(//div[contains(@id, 'pagerTransferHistory')]//div[@type =  'button']/following-sibling::div[1])[2]"
      },
      POST_TRADES_SETTLEMENT: {
        NAME: "Post Trade Settlement",
        FIRST_ROW_COLUMNS: {
          USER: "//div[contains(@id, 'contenttablePostTradesSummaryBlotter')]//div[contains(@id, 'row0PostTradesSummaryBlotter')]//div[contains(@class, 'col-user')]//div",
          CUSTODIAN: "//div[contains(@id, 'contenttablePostTradesSummaryBlotter')]//div[contains(@id, 'row0PostTradesSummaryBlotter')]//div[contains(@class, 'col-custodian')]//div",
          ASSET: "//div[contains(@id, 'contenttablePostTradesSummaryBlotter')]//div[contains(@id, 'row0PostTradesSummaryBlotter')]//div[contains(@class, 'col-asset')]//div",
          REQUIRED: "//div[contains(@id, 'contenttablePostTradesSummaryBlotter')]//div[contains(@id, 'row0PostTradesSummaryBlotter')]//div[contains(@class, 'col-required')]//div"
        },
        HORIZONTAL_SCROLLBAR: "#jqxScrollThumbhorizontalScrollBarPostTradesSummaryBlotter-22"
      },
      ENTITY_CREATION: {
        NAME: "Entity Creation",
        BTN_MAXIMIZE_WIDGET: "//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., 'Entity Creation')]/following-sibling::div/button",
        INPUT_NAME: "//p[text()='Name *']/following-sibling::div/input",
        INPUT_IDENTIFIER: "//p[text()='Identifier *']/following-sibling::div/input",
        INPUT_ALIAS: "//p[text()='Alias *']/following-sibling::div/input",
        COMBO_TYPE: "//p[text()='Type *']/following-sibling::div/div",
        SELECT_OPTION: '[class*="Select-option"]',
        COMBO_STATUS: "//p[text()='Status *']/following-sibling::div/div",
        COMBO_ACCOUNT_INFORMATION_REQUIRED: "//p[text()='Account Information Required *']/following-sibling::div/div",
        COMBO_MARKET_MODEL: "//p[text()='Market Model *']/following-sibling::div/div",
        INPUT_DNS: "//p[text()='DNS *']/following-sibling::div/input",
        INPUT_FXGO_DEALCODE: "//p[text()='FXGO DealCode']/following-sibling::div/input",
        COMBO_DEALCODE_TYPE: "//p[text()='DealCode Type']/following-sibling::div/div",
        COMBO_DEALCODE_FIRM: "//p[text()='Firm']/following-sibling::div/div",
        COMBO_PLATFORM_FEE_USER: '(((//p[text() = "Platform Fee"]/parent::div/parent::div)/following-sibling::div/p)/following-sibling::div/div/div)[1]',
        COMBO_CUSTODIAN_FEE_USER: '(((//p[text() = "Platform Fee"]/parent::div/parent::div)/following-sibling::div/p)/following-sibling::div/div/div)[2]',
        UPDATE_ENTITY_BUTTON_TEXT: 'UPDATE ENTITY',
        ADD_ENTITY_BUTTON_TEXT: "ADD ENTITY",
      },
      ENTITIES_LIST: {
        NAME: "Entities List",
        COLUMNS: {
          ALIAS: {
            FILTER_ICON: "//div[contains(@id, 'columntableEntitiesList')]//div[contains(@role, 'columnheader')]//span[contains(@style, 'text-overflow: ellipsis; cursor: default;') and contains(text(), 'ALIAS')]/parent::div/following-sibling::div[@class='iconscontainer']//div[contains(@class, 'filtericon')]",
            FILTER_WINDOW: {
              CONTAINS_INPUT: '//input[contains(@class, "filtertext1EntitiesList")]',
              FILTER_BUTTON: "//span[contains(@id, 'filterbuttonEntitiesList')]",
            },
          },
          NAME: {
            FILTER_ICON: "//div[contains(@id, 'columntableEntitiesList')]//div[contains(@role, 'columnheader')]//span[contains(@style, 'text-overflow: ellipsis; cursor: default;') and contains(text(), 'NAME')]/parent::div/following-sibling::div[@class='iconscontainer']//div[contains(@class, 'filtericon')]",
            FILTER_WINDOW: {
              CONTAINS_INPUT: '//input[contains(@class, "filtertext1EntitiesList")]',
              FILTER_BUTTON: "//span[contains(@id, 'filterbuttonEntitiesList')]",
            },
          }
        }
      }
    }
  },
  CUSTODIAN: {
    DESK_LABEL: 'Custodian Desk',
    WIDGETS: {
      PENDING_REDEMPTION: {
        NAME: 'Pending Redemption',
        CONTAINER: '#contentSettlements-10',
        FIRST_ROW: '#row0Settlements-10',
        APPROVE_BTN: '.btn-positive.accept',
        CONFIRM_BTN: '.confirm-yes',
        TAB_HEADER_NAME: "//div[contains(@class,'tab_button')]//div[contains(text(), 'Pending Redemption')]",
        CLOSE_WIDGET: "//div[contains(@class,'tab_button')]//div[contains(text(), 'Pending Redemption')]/following-sibling::div",
      },
      PENDING_ISSUANCE: {
        NAME: 'Pending Issuance',
        CONTAINER: '#contenttableDeposits-6',
        FIRST_ROW: '#row0Deposits-6',
        ACCEPT_BTN: '.btn-positive.accept',
        CONFIRM_BTN: '.confirm-yes'
      },
      NETSETTLEMENT_MOVEMENTS: {
        NAME: 'Net Settlement Movements',
        BTN_MAX_MIN: "//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., 'Net Settlement Movements') and not contains(., 'History')]/following-sibling::div/button",
        CONTAINER: '#contenttableReconciliationBlotter-16',
        ACCEPT_BTN: '.btn-positive.accept',
        CONFIRM_BTN: '.confirm-yes',
        EXPORT_BTN: '//*[@id="row0ReconciliationBlotter-16"]/div[13]/div/div',
        RUN_REPORT_BTN: "//div[contains(@class, 'reconciliation')]//button[contains(@class, 'btn-positive') and contains(text(), 'RUN REPORT')]",
        ACCEPT_ALL_BTN: "//div[contains(@class, 'reconciliation')]//button[contains(@class, 'btn-positive') and contains(text(), 'ACCEPT ALL')]",
        FIRST_ROW: '#row0ReconciliationBlotter-16',
        HORIZONTAL_SCROLLBAR_DETAIL_TABLE: "//div[contains(@id, 'contentReconciliationBlotter')]//div[contains(@id, 'jqxScrollThumbhorizontalScrollBar')]",
        VERTICAL_SCROLLBAR_DETAIL_TABLE: "//div[contains(@id, 'contentReconciliationBlotter')]//div[contains(@id, 'jqxScrollThumbverticalScrollBar')]",
        COLUMN_BLOCKHASH_DETAIL_TABLE: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@class, 'col-blockHash')]",
        FIRST_ROW_XPATH: '//*[contains(@id,"row0ReconciliationBlotter")]',
        FIRST_ROW_COLUMNS: {
          DEBIT_ACCOUNT: '//*[contains(@id,"row0ReconciliationBlotter")]//div[contains(@class,"col-debitAccount")]/div',
          CREDIT_ACCOUNT: '//*[contains(@id,"row0ReconciliationBlotter")]//div[contains(@class,"col-creditAccount")]/div',
          ASSET: '//*[contains(@id,"row0ReconciliationBlotter")]//div[contains(@class,"col-asset")]/div',
          QUANTITY: '//*[contains(@id,"row0ReconciliationBlotter")]//div[contains(@class,"col-quantity")]/div',
          SNAPSHOT_DATE: '//*[contains(@id,"row0ReconciliationBlotter")]//div[contains(@class,"col-snapshotDate")]/div',
          SNAPSHOT_TIME: '//*[contains(@id,"row0ReconciliationBlotter")]//div[contains(@class,"col-snapshotTime")]/div',
          USER_ID: '//*[contains(@id,"row0ReconciliationBlotter")]//div[contains(@class,"col-userId")]/div',
        },
        SECOND_ROW_COLUMNS: {
          DEBIT_ACCOUNT: '//*[contains(@id,"row1ReconciliationBlotter")]//div[contains(@class,"col-debitAccount")]/div',
          CREDIT_ACCOUNT: '//*[contains(@id,"row1ReconciliationBlotter")]//div[contains(@class,"col-creditAccount")]/div',
          ASSET: '//*[contains(@id,"row1ReconciliationBlotter")]//div[contains(@class,"col-asset")]/div',
          QUANTITY: '//*[contains(@id,"row1ReconciliationBlotter")]//div[contains(@class,"col-quantity")]/div',
          SNAPSHOT_DATE: '//*[contains(@id,"row1ReconciliationBlotter")]//div[contains(@class,"col-snapshotDate")]/div',
          SNAPSHOT_TIME: '//*[contains(@id,"row1ReconciliationBlotter")]//div[contains(@class,"col-snapshotTime")]/div',
          USER_ID: '//*[contains(@id,"row1ReconciliationBlotter")]//div[contains(@class,"col-userId")]/div',
        },
        DETAIL_TABLE: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@role, 'rowgroup')]",
        DETAIL_TABLE_DEBIT: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@role, 'rowgroup')]//div[contains(@id, 'row_details')]//div[contains(@role, 'grid')]//div[contains(@class, 'jqx-clear jqx-border-reset jqx-overflow-hidden jqx-max-size jqx-position-relative')]//div[contains(@class, 'jqx-clear jqx-max-size jqx-position-relative jqx-overflow-hidden jqx-background-reset')]//div[contains(@class, 'jqx-clear jqx-overflow-hidden jqx-position-absolute jqx-border-reset jqx-background-reset jqx-reset jqx-reset-metrodark jqx-disableselect')]//div[contains(@class, 'jqx-grid-content jqx-grid-content-metrodark jqx-widget-content jqx-widget-content-metrodark')]//div[contains(@id, 'contenttable')]//div[contains(@role, 'row')]//div[contains(@role, 'gridcell')][1]//div",
        DETAIL_TABLE_CREDIT: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@role, 'rowgroup')]//div[contains(@id, 'row_details')]//div[contains(@role, 'grid')]//div[contains(@class, 'jqx-clear jqx-border-reset jqx-overflow-hidden jqx-max-size jqx-position-relative')]//div[contains(@class, 'jqx-clear jqx-max-size jqx-position-relative jqx-overflow-hidden jqx-background-reset')]//div[contains(@class, 'jqx-clear jqx-overflow-hidden jqx-position-absolute jqx-border-reset jqx-background-reset jqx-reset jqx-reset-metrodark jqx-disableselect')]//div[contains(@class, 'jqx-grid-content jqx-grid-content-metrodark jqx-widget-content jqx-widget-content-metrodark')]//div[contains(@id, 'contenttable')]//div[contains(@role, 'row')]//div[contains(@role, 'gridcell')][2]//div",
        DETAIL_TABLE_SENDER: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@role, 'rowgroup')]//div[contains(@id, 'row_details')]//div[contains(@role, 'grid')]//div[contains(@class, 'jqx-clear jqx-border-reset jqx-overflow-hidden jqx-max-size jqx-position-relative')]//div[contains(@class, 'jqx-clear jqx-max-size jqx-position-relative jqx-overflow-hidden jqx-background-reset')]//div[contains(@class, 'jqx-clear jqx-overflow-hidden jqx-position-absolute jqx-border-reset jqx-background-reset jqx-reset jqx-reset-metrodark jqx-disableselect')]//div[contains(@class, 'jqx-grid-content jqx-grid-content-metrodark jqx-widget-content jqx-widget-content-metrodark')]//div[contains(@id, 'contenttable')]//div[contains(@role, 'row')]//div[contains(@role, 'gridcell')][3]//div",
        DETAIL_TABLE_RECEIVER: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@role, 'rowgroup')]//div[contains(@id, 'row_details')]//div[contains(@role, 'grid')]//div[contains(@class, 'jqx-clear jqx-border-reset jqx-overflow-hidden jqx-max-size jqx-position-relative')]//div[contains(@class, 'jqx-clear jqx-max-size jqx-position-relative jqx-overflow-hidden jqx-background-reset')]//div[contains(@class, 'jqx-clear jqx-overflow-hidden jqx-position-absolute jqx-border-reset jqx-background-reset jqx-reset jqx-reset-metrodark jqx-disableselect')]//div[contains(@class, 'jqx-grid-content jqx-grid-content-metrodark jqx-widget-content jqx-widget-content-metrodark')]//div[contains(@id, 'contenttable')]//div[contains(@role, 'row')]//div[contains(@role, 'gridcell')][4]//div",
        DETAIL_TABLE_AMOUNT: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@role, 'rowgroup')]//div[contains(@id, 'row_details')]//div[contains(@role, 'grid')]//div[contains(@class, 'jqx-clear jqx-border-reset jqx-overflow-hidden jqx-max-size jqx-position-relative')]//div[contains(@class, 'jqx-clear jqx-max-size jqx-position-relative jqx-overflow-hidden jqx-background-reset')]//div[contains(@class, 'jqx-clear jqx-overflow-hidden jqx-position-absolute jqx-border-reset jqx-background-reset jqx-reset jqx-reset-metrodark jqx-disableselect')]//div[contains(@class, 'jqx-grid-content jqx-grid-content-metrodark jqx-widget-content jqx-widget-content-metrodark')]//div[contains(@id, 'contenttable')]//div[contains(@role, 'row')]//div[contains(@role, 'gridcell')][5]//div",
        DETAIL_TABLE_DATE: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@role, 'rowgroup')]//div[contains(@id, 'row_details')]//div[contains(@role, 'grid')]//div[contains(@class, 'jqx-clear jqx-border-reset jqx-overflow-hidden jqx-max-size jqx-position-relative')]//div[contains(@class, 'jqx-clear jqx-max-size jqx-position-relative jqx-overflow-hidden jqx-background-reset')]//div[contains(@class, 'jqx-clear jqx-overflow-hidden jqx-position-absolute jqx-border-reset jqx-background-reset jqx-reset jqx-reset-metrodark jqx-disableselect')]//div[contains(@class, 'jqx-grid-content jqx-grid-content-metrodark jqx-widget-content jqx-widget-content-metrodark')]//div[contains(@id, 'contenttable')]//div[contains(@role, 'row')]//div[contains(@role, 'gridcell')][6]//div",
        DETAIL_TABLE_TIME: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@role, 'rowgroup')]//div[contains(@id, 'row_details')]//div[contains(@role, 'grid')]//div[contains(@class, 'jqx-clear jqx-border-reset jqx-overflow-hidden jqx-max-size jqx-position-relative')]//div[contains(@class, 'jqx-clear jqx-max-size jqx-position-relative jqx-overflow-hidden jqx-background-reset')]//div[contains(@class, 'jqx-clear jqx-overflow-hidden jqx-position-absolute jqx-border-reset jqx-background-reset jqx-reset jqx-reset-metrodark jqx-disableselect')]//div[contains(@class, 'jqx-grid-content jqx-grid-content-metrodark jqx-widget-content jqx-widget-content-metrodark')]//div[contains(@id, 'contenttable')]//div[contains(@role, 'row')]//div[contains(@role, 'gridcell')][7]//div",
        DETAIL_TABLE_TXHASH: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@id, 'row_details')]//div[contains(@id, 'row0')]//div[contains(@class, 'col-txid')]/div",
        DETAIL_TABLE_BLOCKHASH: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@id, 'row_details')]//div[contains(@id, 'row0')]//div[contains(@class, 'col-blockHash')]/div",
        HORIZONTAL_SCROLLBAR_DETAIL_TABLE: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@role, 'rowgroup')]//div[contains(@id, 'row_details')]//div[contains(@role, 'grid')]//div[contains(@class, 'jqx-clear jqx-border-reset jqx-overflow-hidden jqx-max-size jqx-position-relative')]//div[contains(@class, 'jqx-clear jqx-max-size jqx-position-relative jqx-overflow-hidden jqx-background-reset')]//div[contains(@class, 'jqx-clear jqx-overflow-hidden jqx-position-absolute jqx-border-reset jqx-background-reset jqx-reset jqx-reset-metrodark jqx-disableselect')]//div[contains(@class, 'jqx-grid-content jqx-grid-content-metrodark jqx-widget-content jqx-widget-content-metrodark')]//div[contains(@id, 'contenttable')]//div[contains(@role, 'row')]//div[contains(@role, 'gridcell')][10]//div",
        VERTICAL_SCROLLBAR_DETAIL_TABLE: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@role, 'rowgroup')]//div[contains(@id, 'row_details')]//div[contains(@role, 'grid')]//div[contains(@class, 'jqx-clear jqx-border-reset jqx-overflow-hidden jqx-max-size jqx-position-relative')]//div[contains(@class, 'jqx-clear jqx-max-size jqx-position-relative jqx-overflow-hidden jqx-background-reset')]//div[contains(@class, 'jqx-clear jqx-overflow-hidden jqx-position-absolute jqx-border-reset jqx-background-reset jqx-reset jqx-reset-metrodark jqx-disableselect')]//div[contains(@class, 'jqx-grid-content jqx-grid-content-metrodark jqx-widget-content jqx-widget-content-metrodark')]//div[contains(@id, 'contenttable')]//div[contains(@role, 'row')]//div[contains(@role, 'gridcell')][11]//div",
        COLUMN_BLOCKHASH_DETAIL_TABLE: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@role, 'rowgroup')]//div[contains(@id, 'row_details')]//div[contains(@role, 'grid')]//div[contains(@class, 'jqx-clear jqx-border-reset jqx-overflow-hidden jqx-max-size jqx-position-relative')]//div[contains(@class, 'jqx-clear jqx-max-size jqx-position-relative jqx-overflow-hidden jqx-background-reset')]//div[contains(@class, 'jqx-clear jqx-overflow-hidden jqx-position-absolute jqx-border-reset jqx-background-reset jqx-reset jqx-reset-metrodark jqx-disableselect')]//div[contains(@class, 'jqx-grid-content jqx-grid-content-metrodark jqx-widget-content jqx-widget-content-metrodark')]//div[contains(@id, 'contenttable')]//div[contains(@role, 'row')]//div[contains(@role, 'gridcell')][12]//div",
        NO_DATA_TO_DISPLAY: "//div[contains(@id, 'contentReconciliationBlotter')]//span[contains(text(), 'No data to display')]",
      },
      BACKGROUND_TASK: {
        BTN_WIDGET: '.fa.fa-tasks.greenLinkPulse',
        NAME: 'BACKGROUND TASK',
        CONTAINER: '#notificationMenu'
      },
      NETSETTLEMENT_HISTORY: {
        NAME: 'Net Settlement Movements History',
        TITLE: '//div[contains(text(), "Net Settlement Movements History")]',
        FILTER_CALENDAR: {
          FROM: {
            CONTAINER: "(//div[contains(@class, 'jqx-position-absolute jqx-action-button jqx-action-button-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark jqx-default jqx-default-metrodark')])[1]",
            CURRENT_DAY: "(//td[contains(@class, 'jqx-rc-all jqx-rc-all-metrodark jqx-item jqx-item-metrodark jqx-calendar-cell jqx-calendar-cell-metrodark jqx-calendar-cell-selected jqx-calendar-cell-selected-metrodark jqx-fill-state-pressed jqx-fill-state-pressed-metrodark jqx-calendar-cell-month jqx-calendar-cell-month-metrodark jqx-calendar-cell-today jqx-calendar-cell-today-metrodark')])[1]"
          },
          TO: {
            CONTAINER: "(//div[contains(@class, 'jqx-position-absolute jqx-action-button jqx-action-button-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark jqx-default jqx-default-metrodark')])[2]",
            CURRENT_DAY: "(//td[contains(@class, 'jqx-rc-all jqx-rc-all-metrodark jqx-item jqx-item-metrodark jqx-calendar-cell jqx-calendar-cell-metrodark jqx-calendar-cell-selected jqx-calendar-cell-selected-metrodark jqx-fill-state-pressed jqx-fill-state-pressed-metrodark jqx-calendar-cell-month jqx-calendar-cell-month-metrodark jqx-calendar-cell-today jqx-calendar-cell-today-metrodark')])[2]"
          },
          SEARCH_BUTTON: "(//div[contains(@class, 'positive blotterActionButtons search-reconBlotter jqx-rc-all jqx-rc-all-metrodark jqx-button jqx-button-metrodark jqx-widget jqx-widget-metrodark jqx-fill-state-normal jqx-fill-state-normal-metrodark')])"
        },
        FIRST_ROW: '#row0ReconciliationBlotterHistory-17',
        DETAIL_TABLE_SENDER: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@role, 'rowgroup')]//div[contains(@id, 'row_details')]//div[contains(@role, 'grid')]//div[contains(@class, 'jqx-clear jqx-border-reset jqx-overflow-hidden jqx-max-size jqx-position-relative')]//div[contains(@class, 'jqx-clear jqx-max-size jqx-position-relative jqx-overflow-hidden jqx-background-reset')]//div[contains(@class, 'jqx-clear jqx-overflow-hidden jqx-position-absolute jqx-border-reset jqx-background-reset jqx-reset jqx-reset-metrodark jqx-disableselect')]//div[contains(@class, 'jqx-grid-content jqx-grid-content-metrodark jqx-widget-content jqx-widget-content-metrodark')]//div[contains(@id, 'contenttable')]//div[contains(@role, 'row')]//div[contains(@role, 'gridcell')][3]//div",
        DETAIL_TABLE_RECEIVER: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@role, 'rowgroup')]//div[contains(@id, 'row_details')]//div[contains(@role, 'grid')]//div[contains(@class, 'jqx-clear jqx-border-reset jqx-overflow-hidden jqx-max-size jqx-position-relative')]//div[contains(@class, 'jqx-clear jqx-max-size jqx-position-relative jqx-overflow-hidden jqx-background-reset')]//div[contains(@class, 'jqx-clear jqx-overflow-hidden jqx-position-absolute jqx-border-reset jqx-background-reset jqx-reset jqx-reset-metrodark jqx-disableselect')]//div[contains(@class, 'jqx-grid-content jqx-grid-content-metrodark jqx-widget-content jqx-widget-content-metrodark')]//div[contains(@id, 'contenttable')]//div[contains(@role, 'row')]//div[contains(@role, 'gridcell')][4]//div",
        DETAIL_TABLE_AMOUNT: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@role, 'rowgroup')]//div[contains(@id, 'row_details')]//div[contains(@role, 'grid')]//div[contains(@class, 'jqx-clear jqx-border-reset jqx-overflow-hidden jqx-max-size jqx-position-relative')]//div[contains(@class, 'jqx-clear jqx-max-size jqx-position-relative jqx-overflow-hidden jqx-background-reset')]//div[contains(@class, 'jqx-clear jqx-overflow-hidden jqx-position-absolute jqx-border-reset jqx-background-reset jqx-reset jqx-reset-metrodark jqx-disableselect')]//div[contains(@class, 'jqx-grid-content jqx-grid-content-metrodark jqx-widget-content jqx-widget-content-metrodark')]//div[contains(@id, 'contenttable')]//div[contains(@role, 'row')]//div[contains(@role, 'gridcell')][5]//div",
        DETAIL_TABLE_TXHASH: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@id, 'row_details')]//div[contains(@id, 'row0')]//div[contains(@class, 'col-txid')]/div",
        DETAIL_TABLE_BLOCKHASH: "//div[contains(@id,'contentReconciliationBlotter')]//div[contains(@id, 'row_details')]//div[contains(@id, 'row0')]//div[contains(@class, 'col-blockHash')]/div",
      },
      PAYMENTS: {
        TYPE: {
          OUTGOING: "OUTGOING",
          INCOMING: "INCOMING",
        },
        NAME: 'Payments',
        MAXIMIZE_BTN: "(//button[contains(@class, 'flexlayout__tab_toolbar_button-min')])[2]",
        SCROLL_BAR_HORIZONTAL: '#jqxScrollThumbhorizontalScrollBarCustodianPaymentWidget-21',
        FIRST_ROW: '#row0CustodianPaymentWidget-21',
        FIRST_ROW_COLUMNS: {
          SENDER: "//div[contains(@id,'CustodianPaymentWidget')]//div[contains(@id, 'row0CustodianPaymentWidget')]//div[contains(@class, 'col-sender')]",
          RECEIVER: "//div[contains(@id,'CustodianPaymentWidget')]//div[contains(@id, 'row0CustodianPaymentWidget')]//div[contains(@class, 'col-receiver')]",
          AMOUNT: "//div[contains(@id,'CustodianPaymentWidget')]//div[contains(@id, 'row0CustodianPaymentWidget')]//div[contains(@class, 'col-amount')]",
          TRANSACTION_HASH: "//div[contains(@id,'CustodianPaymentWidget')]//div[contains(@id, 'row0CustodianPaymentWidget')]//div[contains(@class, 'col-tx')]",
          ASSET: "//div[contains(@id,'CustodianPaymentWidget')]//div[contains(@id, 'row0CustodianPaymentWidget')]//div[contains(@class, 'col-asset')]",
          BLOCKHASH: "//div[contains(@id,'CustodianPaymentWidget')]//div[contains(@id, 'row0CustodianPaymentWidget')]//div[contains(@class, 'col-blockHash')]",
          DATE: "//div[contains(@id,'CustodianPaymentWidget')]//div[contains(@id, 'row0CustodianPaymentWidget')]//div[contains(@class, 'col-date')]",
          STATUS: "//div[contains(@id,'CustodianPaymentWidget')]//div[contains(@id, 'row0CustodianPaymentWidget')]//div[contains(@class, 'col-status')]",
          RECEIVER_ADDRESS: "//div[contains(@id,'CustodianPaymentWidget')]//div[contains(@id, 'row0CustodianPaymentWidget')]//div[contains(@class, 'col-payeeAccount')]",
          SENDER_ADDRESS: "//div[contains(@id,'CustodianPaymentWidget')]//div[contains(@id, 'row0CustodianPaymentWidget')]//div[contains(@class, 'col-account')]",
        },
        COLUMN_CLASS: {
          COL_ASSET: 'col-asset',
          COL_EVENT_ID: 'col-eventId',
          COL_DATE: 'col-date',
          COL_STATUS: 'col-status',
          COL_TYPE: 'col-type',
          COL_PAYEE: 'col-payee',
          COL_AMOUNT: 'col-amount',
          COL_ACCOUNT: 'col-account',
          COL_PAYEEACCOUNT: 'col-payeeAccount',
          COL_TX: 'col-tx',
          COL_BLOCKHASH: 'col-blockHash',
          COL_SENDER: 'col-sender',
          COL_RECEIVER: 'col-receiver',
        },
      },
      TRADE_BLOTTER: {
        NAME: 'Trade Blotter',
        CONTAINER: '#contenttableTradeBlotter-14',
        FIRST_ROW: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]",
        FIRST_ROW_DETAIL: "//div[contains(@id, 'contenttableTradeBlotter')]//*[contains(@id, 'row0TradeBlotter')]//div[contains(@class, 'icon-arrow-right')]",
        FIRST_ROW_COLUMNS: {
          DATE: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-lastResponseDate')]/div",
          TIME: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-time')]/div",
          STATUS: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-status')]/div",
          ASSET_PÂIR: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-currencyPair')]/div",
          SIDE: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-side')]/div",
          ASSET_1: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-asset1')]/div",
          ASSET_2: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-asset2')]/div",
          QTY_1: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-quantity')]/div",
          RATE: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-rate')]/div",
          QTY_2: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-total')]/div",
          QUOTE_TYPE: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-quoteType')]/div",
          COUNTERPARTY_1: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-senderId')]/div",
          CPTY_1_ACCOUNT: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-traderAccountNumber')]/div",
          COUNTERPARTY_2: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-col-cpty')]/div",
          CPTY_2_ACCOUNT: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-counterPartyAccountNumber')]/div",
          PLATFORM: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-platform')]/div",
          TM_ENTITY: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-tmEntity')]/div",
          ORDER_ID: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-id')]/div",
          R_REF: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-refId')]/div",
          TRADE_MATCH_ID: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-id')]/div",
          FEE_ASSET: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-feeAssetSymbol')]/div",
          FEE_QTY: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-fees')]/div",
          NOTIFICATION_STATUS: "//div[contains(@id, 'contenttableCustodianTradeBlotter')]//div[contains(@id, 'row0CustodianTradeBlotter')]//div[contains(@class,'col-notification-status')]/div",
        },
        ROW_COLUMNS: {
          DATE: "//div[contains(@class,'col-lastResponseDate')]/div",
          TIME: "//div[contains(@class,'col-time')]/div",
          STATUS: "//div[contains(@class,'col-status')]/div",
          ASSET_PÂIR: "//div[contains(@class,'col-currencyPair')]/div",
          SIDE: "//div[contains(@class,'col-side')]/div",
          ASSET_1: "//div[contains(@class,'col-asset1')]/div",
          ASSET_2: "//div[contains(@class,'col-asset2')]/div",
          QTY_1: "//div[contains(@class,'col-quantity')]/div",
          RATE: "//div[contains(@class,'col-rate')]/div",
          QTY_2: "//div[contains(@class,'col-total')]/div",
          QUOTE_TYPE: "//div[contains(@class,'col-quoteType')]/div",
          COUNTERPARTY_1: "//div[contains(@class,'col-senderId')]/div",
          CPTY_1_ACCOUNT: "//div[contains(@class,'col-traderAccountNumber')]/div",
          COUNTERPARTY_2: "//div[contains(@class,'col-cpty')]/div",
          CPTY_2_ACCOUNT: "//div[contains(@class,'col-counterPartyAccountNumber')]/div",
          PLATFORM: "//div[contains(@class,'col-platform')]/div",
          TM_ENTITY: "//div[contains(@class,'col-tmEntity')]/div",
          ORDER_ID: "//div[contains(@class,'col-id')]/div",
          R_REF: "//div[contains(@class,'col-refId')]/div",
          TRADE_MATCH_ID: "//div[contains(@class,'col-id')]/div",
          FEE_ASSET: "//div[contains(@class,'col-feeAssetSymbol')]/div",
          FEE_QTY: "//div[contains(@class,'col-fees')]/div",
          NOTIFICATION_STATUS: "//div[contains(@class,'col-notification-status')]/div",
        },
        SCROLL_BAR_HORIZONTAL: '#jqxScrollThumbhorizontalScrollBarCustodianTradeBlotter-21',
        MAXIMIZE_BUTTON: "(//button[contains(@class, 'flexlayout__tab_toolbar_button-min')])[2]",
        BTN_MAXIMIZE_WIDGET: "//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., 'Trade Blotter')]/following-sibling::div/button"
      },
      ISSUANCE_HISTORY: {
        NAME: 'Issuance History',
        TAB_HEADER_NAME: "//div[contains(@class,'tab_button')]//div[contains(text(), 'Issuance History')]",
      },
      REDEMPTION_HISTORY: {
        TAB_HEADER_NAME: "//div[contains(@class,'tab_button')]//div[contains(text(), 'Redemption History')]",
        CLOSE_WIDGET: "//div[contains(@class,'tab_button')]//div[contains(text(), 'Redemption History')]/following-sibling::div",
        NAME: 'Redemption History',
        SCROLL_BAR_HORIZONTAL: "//div[contains(@id, 'jqxScrollWraphorizontalScrollBarRedeemExplorer')]//div[contains(@id, 'jqxScrollThumbhorizontalScrollBarRedeemExplorer')]"
      },
      DAILY_ISSUANCE: {
        NAME: 'Daily Issuance (5pm - 5pm EST)',
        TAB_HEADER_NAME: "//div[contains(@class,'tab_button')]//div[contains(text(), 'Daily Issuance (5pm - 5pm EST)')]",
        BTN_MAXIMIZE_WIDGET: "//div[contains(@class, 'flexlayout__tab_header_inner') and contains(., 'Daily Issuance (5pm - 5pm EST)')]/following-sibling::div/button"
      }
    }
  },
  BROKER: {
    DESK_LABEL: 'Broker Desk',
    WIDGETS: {
      POST_TRADES: {
        NAME: 'Post Trades',
        HORIZONTAL_SCROLLBAR: "#jqxScrollThumbhorizontalScrollBarCentralPostTradesBlotter-19",
        REST_CURRENT_OPERATION_ROW_FIRST_PART: "//div[@class = 'jqx-grid-cell-left-align' and contains(text(), '",
        UPLOAD_CURRENT_OPERATION_ROW_FIRST_PART: "//div[@style = 'overflow:hidden; text-overflow: ellipsis;' and contains(text(), '",
        REST_CURRENT_OPERATION_ROW_SECOND_PART: "')]/parent::div/parent::div",
        UPLOAD_CURRENT_OPERATION_ROW_SECOND_PART: "')]/parent::div/parent::div/parent::div",
        MAXIMIZE_BTN: "(//button[contains(@class, 'flexlayout__tab_toolbar_button-min')])[1]",
        UPLOAD_FILE_BTN: "//button[text() = 'UPLOAD FILE']",
        COLUMNS: {
          TRADER_REPORT_ID: "//span[text() = 'TRADER REPORT ID']",
          FIX_MESSAGE: "//span[text() = 'FIX MESSAGE']",
          CURRENT_OPERATION: {
            STATUS_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            STATUS_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-status')]//div//span",
            SYMBOL_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            SYMBOL_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-symbol')]//div//span",
            QTY_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            QTY_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-quantity') and not(contains(@class, 'col-quantity2'))]//div//span",
            PRICE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            PRICE_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-price')]//div//span",
            SIDE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            SIDE_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-side')]//div//span",
            CURRENCY_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            CURRENCY_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-currency')]//div//span",
            DEAL_CODE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            DEAL_CODE_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-partyDealcode')]//div",
            TRADER_ID_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            TRADER_ID_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-partyTraderId')]//div",
            CPTY_DEAL_CODE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            CPTY_DEAL_CODE_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-counterPartyDealcode')]//div",
            CPTY_TRADER_ID_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            CPTY_TRADER_ID_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-counterPartyTraderId')]//div",
            CUSTODIAN_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            CUSTODIAN_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-custodian')]//div",
            TRADE_REPORT_ID_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            TRADE_REPORT_ID_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-tradeReportId')]//div",
            EXEC_ID_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            EXEC_ID_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-execId')]//div",
            SOURCE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            SOURCE_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-source')]//div",
            ERROR_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            ERROR_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-error')]//div",
            FIX_MESSAGE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            FIX_MESSAGE_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-fixMessage')]//div//div",
            DATE_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            DATE_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-txDate')]//div",
            TIME_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            TIME_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-txTime')]//div",
            QTY2_FIRST_PART: "//div[@role = 'row' and contains(@id, 'row",
            QTY2_SECOND_PART: "CentralPostTradesBlotter')]//div[contains(@class, 'col-quantity2')]//div//span"
          }
        },
        UPLOAD_FILE_MODAL: {
          SELECT_FILE_BTN: "//input[@id = 'input-file']",
          CONFIRM_BTN: "//button[text() = 'CONFIRM']"
        },
        UPLOAD_ERROR_MESSAGE: "//span[@class = 'status-rejected' and contains(text(), 'ERROR')]"
      }
    }
  }
})