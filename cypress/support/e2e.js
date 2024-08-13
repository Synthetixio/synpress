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
 * Date: 09/22/2023
 * Author(s): Victor Fattor
 * -----
 * Last Modified: 1/10/2024
 * Modified By: Victor Fattor
 * -----
 * 
 */
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './lm_tests/commands'
import './2FA/commands'
import './spread/commands'
import './posttrades/commands'
import './several_payments/commands'
import './repo/commands'
import './negative_cases/commands'
import 'cypress-promise/register'
import 'mochawesome/addContext'
import '@cypress/code-coverage/support'
import './ccns/commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
require('cypress-xpath')
require('cypress-plugin-tab');

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})


// Hide fetch/XHR requests

if (Cypress.config('hideXHR')) {
  const app = window.top;

  if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
    const style = app.document.createElement('style');
    style.innerHTML =
      '.command-name-request, .command-name-xhr { display: none }';
    style.setAttribute('data-hide-command-log-request', '');

    app.document.head.appendChild(style);
  }
}

Cypress.on("test:after:run", (test, runnable) => {
  if (test.state === "failed") {
    const screenshot = `assets/${Cypress.spec.name}/${runnable.parent.title} --       ${test.title} (failed).png`;
    addContext({
      test
    }, screenshot);
  }
});