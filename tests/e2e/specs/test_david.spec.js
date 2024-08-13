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
 * -----
 * Last Modified: 8/13/2024
 * Modified By: David Eberle
 * -----
 * 
 */

const { WAIT } = require('../../../../cypress/support/bosonic.enum.wait')
const ENVIRONMENT = require('../../../../cypress/support/bosonic.environments')

import MainPage from '../../../../cypress/widgets/MainPage'
import TokenWalletWidget from '../../../../cypress/widgets/trader/TokenWalletWidget'

const mainPage = new MainPage()
const tokenWalletWidget = new TokenWalletWidget()

const SV_USER = {
  url: ENVIRONMENT.BASE_URL_TRAD_SV_QA,
  user_info: ENVIRONMENT.USERS.TM_SV_QA
}

let fixtureDeposit = require('../../../../cypress/fixtures/trader/ccns/depositSvCcnsTest.json')

var walletAddress = ""

describe("Connect metamask with a SMART VAULT user.", () => {

  before(() => {
  })

  it("Login to TRADER MODULE with a SMART VAULT user and open Token Wallet widget.", () => {

    cy.loginAndDescription(SV_USER.url, SV_USER.user_info, "Login and make a deposit")

    mainPage.getTraderSvLayoutLink().click().wait(WAIT.EXTRA_LOW)

  })

  it("Display message to connect the Metamaks wallet.", () => {
    cy.get('b:contains("Connect your wallet to transact.")').contains("Connect your wallet to transact.")
  })

  it("Connect to Metamask Wallet.", () => {

    // Select Token Wallet is disabled
    tokenWalletWidget.getSelectTokenSelector().should('have.attr', 'aria-disabled', 'true')
    tokenWalletWidget.getInputDepositAmount().should('be.disabled')
    tokenWalletWidget.getInputRedeemAmount().should('be.disabled')

    cy.importAndSelectMetamaskAccount(SV_USER.user_info)

    cy.wait(WAIT.MEDIUM)

    // Select Token Wallet is enabled
    tokenWalletWidget.getSelectTokenSelector().should('not.have.attr', 'aria-disabled')

    tokenWalletWidget.getWalletAddress().invoke('attr', 'title')
      .then((title) => {
        walletAddress = title.replace("Address: ", "")
        cy.logMessage("WALLET IS: " + walletAddress)
      })

    tokenWalletWidget.getWalletConnectTittle().invoke('text').then((message) => {
      expect(message).to.equal('Connected Wallet')
    })

  })

  it("Select Token, insert the amount and make a deposit", () => {

    tokenWalletWidget.getSelectTokenCombo().click({ force: true })

    tokenWalletWidget.getSelectSpecificToken().contains(fixtureDeposit.asset1).click({ force: true })

    tokenWalletWidget.getDepositButton().should('be.disabled')

    tokenWalletWidget.getInputDepositAmount().type(fixtureDeposit.amount)

    tokenWalletWidget.getDepositButton().should('not.be.disabled')

    tokenWalletWidget.getDepositButton().click({ force: true })

    // REVIEW DEPOSIT INFORMATION validations
    cy.get('div[class="modal-body"]  > div:nth-child(1)').then(walletAddressModal => {
      expect(walletAddressModal.text(), "Wallet Address: ").to.contains(walletAddress)
    })

    cy.get('div[class="modal-body"]  > div:nth-child(3)').then(tokenModal => {
      expect(tokenModal.text(), "Token: ").to.contains(fixtureDeposit.asset1)
    })

    cy.get('div[class="modal-body"]  > div:nth-child(4)').then(amountModal => {
      expect(amountModal.text(), "Amount: ").to.contains(fixtureDeposit.amount)
    })

    tokenWalletWidget.getConfirmButton().click()

  })

  it("confirm Metamask Wallet transaction", () => {

    cy.confirmMetamaskPermissionToSpend({ shouldwaitforpopupclosure: true })

    cy.wait(WAIT.HIGH)

    cy.confirmMetamaskTransaction({ gasConfig: 'market', shouldwaitforpopupclosure: true })

  })
})
