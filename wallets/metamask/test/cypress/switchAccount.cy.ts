import { defaultAccount } from '../../src/cypress/constans'

it('should switch back to the `Account 1` account', () => {
  const accountName = 'New Account to test switch'

  cy.addNewAccount(accountName).then(() => {
    cy.getAccount().should('eq', accountName)
  })
})

after(() => {
  cy.switchAccount(defaultAccount)
})
