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
 * Date: 06/12/2024
 * Author(s): Victor Fattor
 * -----
 * Last Modified: 7/24/2024
 * Modified By: Diego Graf
 * -----
 * 
 */
export default class LoginPage {

  getUsernameInput() {
    return cy.xpath('//input[@id="username"]')
  }

  getPasswordInput() {
    return cy.xpath('//input[@id="password"]')
  }

  getLoginButton() {
    return cy.xpath('//button[text() = "Login"]')
  }

  getErrorMessageNotification() {
    return cy.get('[class="notification-message"]')
  }

  getWrongUserExpectedErrorMessageText() {
    return 'You may have entered an unknown user name or an incorrect password.'
  }

  getInvalidEmailAddressErrorMessageText() {
    return 'Username should be a valid E-mail address.'
  }

  getNotEmptyUserOrPasswordErrorMessageText() {
    return 'Username and Password cannot be empty.'
  }

  get2FACodeInput() {
    return cy.get('input[placeholder="Code"]')
  }

  getRecoveryCodeLink() {
    return cy.get('.recovery-code-link')
  }

  getRecoveryCodeInput() {
    return cy.get('input[placeholder="Recovery Code"]')
  }
}
