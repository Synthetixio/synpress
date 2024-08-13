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
 * Date: 7/11/2024
 * Author(s): Diego Graf
 * -----
 * Last Modified: 7/23/2024
 * Modified By: Diego Graf
 * -----
 * 
 */
export default class UserCreationWidget {

  getWidgetName(userType) {
    if(userType == 'ADMIN'){
      return 'User Creation'
    } else {
      return 'Trader User Creation'
    }    
  }

  getPasswordFormatErrorMessageText() {
    return "Password must be 8 characters or more, contain at least one number, one uppercase, one lowercase, and one special character"
  }

  getPasswordConfirmationErrorMessageText() {
    return "Password and it's confirmation must match"
  }

  getEmptyGroupErrorMessageText() {
    return "You must choose at least one group"
  }

  getEmptyApplicationErrorMessageText() {
    return "You must choose at least one application"
  }

  getEmptyApplicationInBrokerErrorMessageText() {
    return "You must choose an application"
  }

  getInvalidEmailErrorMessage() {
    return "Please verify that the data entered is correct"
  }

  getFirstNameInput() {
    return cy.xpath('//p[text() = "First Name *"]/following-sibling::div//input')
  }

  getLastNameInput() {
    return cy.xpath('//p[text() = "Last Name *"]/following-sibling::div//input')
  }

  getEmailInput() {
    return cy.xpath('//p[text() = "Email *"]/following-sibling::div//input')
  }

  getPasswordInput() {
    return cy.xpath('//p[text() = "Password *"]/following-sibling::div//input')
  }

  getPasswordErrorClass() {
    return cy.xpath('//p[text() = "Password *"]/following-sibling::div//input/parent::div')
  }

  getPasswordErrorMessageLabel() {
    return cy.xpath('//p[text() = "Password *"]/following-sibling::div//input/parent::div/following-sibling::p')
  }

  getConfirmPasswordInput() {
    return cy.xpath('//p[text() = "Confirm Password *"]/following-sibling::div//input')
  }

  getConfirmPasswordErrorClass() {
    return cy.xpath('//p[text() = "Confirm Password *"]/following-sibling::div//input/parent::div')
  }

  getConfirmPasswordErrorMessageLabel() {
    return cy.xpath('//p[text() = "Confirm Password *"]/following-sibling::div//input/parent::div/following-sibling::p')
  }

  getGroupErrorMessageLabel() {
    return cy.xpath('//p[text() = "Groups"]/following-sibling::p')
  }

  getApplicationErrorMessageLabel() {
    return cy.xpath('//p[contains(text(), "Application")]/following-sibling::p')
  }

  getEmailErrorClass() {
    return cy.xpath('//p[text() = "Email *"]/following-sibling::div//input/parent::div')
  }

  getContainerDiv() {
    return cy.xpath('//div[contains(@class, "add_user_container")]')
  }

  getSubmitButton() {
    return cy.xpath('//div[@class = "add_user_container"]//button[text() = "SUBMIT"]')
  }

  getGroupSelect() {
    return cy.xpath('//div[@class = "add_user_container"]//p[text() = "Groups"]/following-sibling::div//span[@class = "Select-arrow-zone"]')
  }

  getAllOptionsInGroupSelect() {
    return cy.xpath('//div[@class = "Select-value"]//span[@role = "option"]')
  }

  getStatusSelect() {
    return cy.xpath('//div[@class = "add_user_container"]//p[text() = "Status *"]/following-sibling::div//div[@class = "Select-control"]//span[@class = "Select-arrow-zone"]')
  }

  getApplicationSelect() {
    return cy.xpath('//div[@class = "add_user_container"]//p[contains(text(), "Application")]/following-sibling::div//div[@class = "Select-control"]//span[@class = "Select-arrow-zone"]')
  }

  getAllOptionsInApplicationSelect() {
    return cy.xpath('//div[@class = "Select-value"]//span[@role = "option"]')
  }

  getMaximizeWidgetButton(userType) {
    if(userType == 'ADMIN'){
      return cy.xpath('//div[text() = "User Creation"]/parent::div/parent::div/following-sibling::div/button')
    } else {
      return cy.xpath('//div[text() = "Trader User Creation"]/parent::div/parent::div/following-sibling::div/button')
    }    
  }

  getAddUserButton() {
    return cy.xpath('//div[contains(@class, "add_user_container")]//div//div[1]//button[contains(@class, "float-right btn-grey btn-big")]')    
  } 

  getCloseFirstGroupButtonInGroupField() {
    return cy.xpath('//div[@class = "add_user_container"]//div[contains(@class, "multiple")]/p[text() =  "Groups"]/following-sibling::div//span[@class="Select-value-icon"]')
  }

  getCloseFirstApplicationButtonInGroupField() {
    return cy.xpath('//div[@class = "add_user_container"]//div[contains(@class, "multiple")]/p[text() =  "Applications"]/following-sibling::div//span[@class="Select-value-icon"]')
  }

  getSelectedOptionInApplicationSelect() {
    return cy.xpath('//div[@class = "add_user_container"]//p[text() =  "Application"]/following-sibling::div//input[@name="applications"]')
  }
}