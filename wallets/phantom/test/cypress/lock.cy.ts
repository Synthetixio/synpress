import * as selectors from '../../src/selectors/'

it('should lock & unlock the wallet without any errors', () => {
  cy.shouldHavePhantomPageElement(selectors.homePage.accountMenu.accountName, true)

  cy.lock()

  cy.shouldHavePhantomPageElement(selectors.unlockPage.submitButton, true)

  cy.unlock()

  cy.shouldHavePhantomPageElement(selectors.homePage.accountMenu.accountName, true)
})
