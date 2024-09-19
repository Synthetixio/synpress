import { SettingsSidebarMenus } from '../../src/selectors/pages/HomePage/settings'

describe('reset the account', () => {
  it('should reset the account', () => {
    cy.openSettings().then(() => {
      cy.openSidebarMenu(SettingsSidebarMenus.Advanced).then(() => {
        cy.resetAccount().then(() => {
          cy.goBackToHomePage()
        })
      })
    })
  })
})
