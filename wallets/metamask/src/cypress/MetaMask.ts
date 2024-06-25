import { MetaMaskAbstract } from '../type/MetaMaskAbstract'
import Selectors from '../playwright/pages/LockPage/selectors'

export class MetaMask extends MetaMaskAbstract {
  async unlock() {
    cy.get(Selectors.passwordInput).type(this.password)
    cy.get(Selectors.submitButton).click()
  }
}
