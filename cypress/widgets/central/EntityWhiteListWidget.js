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
 * Date: 7/24/2024
 * Author(s): Diego Graf
 * 
 */
export default class EntityWhiteListWidget {

  getWidgetName() {
    return 'Entity Whitelist'
  }

  getCloseWidgetButton() {
    return cy.xpath('//div[contains(@class, "flexlayout__tab_button_content") and contains(text(), "Entity Whitelist")]//following-sibling::div')
  }
}