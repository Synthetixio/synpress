import { lockPage } from '../selectors'
import { MetaMaskAbstract } from '../type/MetaMaskAbstract'

// @ts-ignore
// TODO: To be implemented
export class MetaMask extends MetaMaskAbstract {
  unlock() {
    cy.get(lockPage.passwordInput).type(this.password)
    cy.get(lockPage.submitButton).click()
  }
}
