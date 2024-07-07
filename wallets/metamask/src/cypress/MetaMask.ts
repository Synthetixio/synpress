import { MetaMaskAbstract } from '../type/MetaMaskAbstract'
import Selectors from '../playwright/pages/LockPage/selectors'
import { onboardingPage } from '../selectors';

export class MetaMask extends MetaMaskAbstract {
  importWallet() {
    cy.get(onboardingPage.GetStartedPageSelectors.termsOfServiceCheckbox).click()
    cy.get(onboardingPage.GetStartedPageSelectors.importWallet).click()

    cy.get(onboardingPage.AnalyticsPageSelectors.optOut).click()

    cy.get(onboardingPage.WalletCreationSuccessPageSelectors.confirmButton).click()

    cy.get(onboardingPage.PinExtensionPageSelectors.nextButton).click()
    cy.get(onboardingPage.PinExtensionPageSelectors.confirmButton).click()

  }

  unlock() {
    cy.get(Selectors.passwordInput).type(this.password)
    cy.get(Selectors.submitButton).click()
  }
}
