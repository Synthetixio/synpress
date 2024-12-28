import * as selectors from '../../src/selectors/'

it('should open settings and go back to homepage', () => {
  cy.openSettings()

  cy.shouldHavePhantomPageElement(selectors.homePage.settings.lockWallet, true)

  cy.goBackToHomePage()

  cy.shouldHavePhantomPageElement(selectors.homePage.settings.lockWallet, false)
})
