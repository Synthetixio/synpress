import { defaultAccount } from '../../src/cypress/constans'

const newAccountName = 'New Test Account Name'

it('should rename currently connected account with specified name', () => {
  cy.addNewAccount(newAccountName).then(() => {
    cy.renameAccount(newAccountName, 'Renaming test').then(() => {
      cy.getAccount().should('eq', 'Renaming test')
    })
  })
})

after(() => {
  cy.switchAccount(defaultAccount)
})
