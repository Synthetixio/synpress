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
 * Date: 7/17/2024
 * Author(s): Diego Graf
 * -----
 * Last Modified: 7/24/2024
 * Modified By: Diego Graf
 * -----
 * 
 */
export default class TwoFactorAuthenticationWidget {

  getWidgetName() {
    return 'Two-Factor Authentication (2FA)'
  }

  getEnable2FAButton() {
    return cy.get('button[title="Set Up 2FA"]')
  }

  getSecretCodeInput() {
    return cy.get('input[class="mfa-input form-control"]')
  }

  getContinueButton() {
    return cy.get('button[type="button"]').contains('Continue')
  }

  getCodeInput() {
    return cy.get('input[class*="form-control"]')
  }

  getInvalidCodeErrorMessageText() {
    return "The code entered is invalid"
  }

  getSecondFactorAuthenticationEnableMessageText() {
    return "Second factor authentication enabled successfully"
  }

  getCancelButton() {
    return cy.get('button[type="button"]').contains('Cancel')
  }

  getFinishButton() {
    return cy.get('button[type="button"]').contains('Finish')
  }

  getReset2FAButton() {
    return cy.get('button[type="button"]').contains('Reset')
  }

  getConfirmReset2FAButton() {
    return cy.xpath("//button[contains(@class, 'btn-positive') and contains(text(), 'CONFIRM')]")
  }

  getGenerateNewButton() {
    return cy.get('button[type="button"]').contains('GENERATE NEW')
  }

  getValidateCodeButton() {
    return cy.get('button[type="button"]').contains('Validate Code')
  }

  getSecondFactorAuthenticationDisabledMessageText() {
    return "Second factor authentication disabled"
  }

  getInvalidRecoveryCodeErrorMessageText() {
    return 'Invalid recovery code'
  }

  getCancelButtonInRecoveryCodeInput() {
    return cy.get('button[class*="btn-negative"]')
  }

  getCopyRecoveryCodesButton() {
    return cy.xpath("//button[contains(@id, 'copy-codes')]")
  }
}