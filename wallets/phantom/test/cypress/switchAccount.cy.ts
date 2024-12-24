import { defaultAccount } from '../../src/cypress/constans'

it('should switch back to the `Account 1` account', () => {
  const accountName = 'New Name'

  cy.addNewAccount(accountName).then(() => {
    cy.getAccount().should('eq', accountName)
  })

  cy.switchAccount(defaultAccount).then(() => {
    cy.getAccount().should('eq', defaultAccount)
  })
})
