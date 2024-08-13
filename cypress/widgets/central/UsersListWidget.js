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
 * Date: 7/15/2024
 * Author(s): Diego Graf
 * 
 */
export default class UsersListWidget {

  getWidgetName(userType) {
    if (userType == 'ADMIN'){
      return 'Users List'
    } else {
      return 'Trader Users List'
    }    
  }

  getFilterIconInColumn(column, userType) {    
    if(userType == 'ADMIN'){
      return cy.xpath(`//div[contains(@id, "columntableUsersList")]//div[contains(@role, "columnheader")]//span[contains(text(), "${column}")]/parent::div/following-sibling::div[@class="iconscontainer"]//div[contains(@class, "filtericon")]`)
    } else {
      return cy.xpath(`//div[contains(@id, "columntableTraderUsersList")]//div[contains(@role, "columnheader")]//span[contains(text(), "${column}")]/parent::div/following-sibling::div[@class="iconscontainer"]//div[contains(@class, "filtericon")]`)
    }    
  }

  getFirstRow(userType) {
    if (userType == 'ADMIN') {
      return cy.xpath('//div[contains(@id, "contenttableUsersList")]//div[contains(@id, "row0UsersList")]')
    } else {
      return cy.xpath('//div[contains(@id, "contenttableTraderUsersList")]//div[contains(@id, "row0TraderUsersList")]')
    }    
  }

  getUpdateUserButton() {
    return cy.xpath('//div[@class = "add_user_container"]//button[text() = "UPDATE USER"]')
  } 

  getFilterButtonInFilterWindow(userType) {
    if (userType == 'BROKER'){
      return cy.xpath('//span[contains(@id, "filterbuttonTraderUsersList")]')
    } else {
      return cy.xpath('//span[contains(@id, "filterbuttonUsersList")]')
    }    
  }

  getContainsLabelInFilterWindow(userType) {
    if (userType == 'BROKER') {
      return cy.xpath('//div[@class ="filter"]//input[contains(@class, "filtertext1TraderUsersList")]')
    } else {
      return cy.xpath('//div[@class ="filter"]//input[contains(@class, "filtertext1UsersList")]')
    }
  } 
}