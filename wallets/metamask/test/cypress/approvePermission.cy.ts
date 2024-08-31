before(() => {
  cy.getNetwork().then((network) => {
    if (network !== 'Anvil') {
      cy.switchNetwork('Anvil')
    }
  })
})

it('should approve tokens with the default limit by default', () => {
  cy.get('#createToken').click()

  cy.deployToken().then(() => {
    cy.wait(5000) // wait for the blockchain - todo: replace with an event handler

    cy.get('#approveTokens').click()

    cy.approveTokenPermission()
  })
})

it('should approve tokens with the `max` limit', () => {
  cy.get('#createToken').click()

  cy.deployToken().then(() => {
    cy.wait(5000) // wait for the blockchain - todo: replace with an event handler

    cy.get('#approveTokens').click()

    cy.approveTokenPermission({ spendLimit: 'max' })
  })
})

it('should approve tokens with the custom limit', () => {
  cy.get('#createToken').click()

  cy.deployToken().then(() => {
    cy.wait(5000) // wait for the blockchain - todo: replace with an event handler

    cy.get('#approveTokens').click()

    cy.approveTokenPermission({ spendLimit: 420 })
  })
})

it('should approve tokens with the default spend limit', () => {
  cy.get('#createToken').click()

  cy.deployToken().then(() => {
    cy.wait(5000) // wait for the blockchain - todo: replace with an event handler

    cy.get('#approveTokens').click()

    cy.approveTokenPermission({
      gasSetting: 'site'
    })
  })
})

it('should approve tokens with the `max` spend limit and custom gas setting', () => {
  cy.get('#createToken').click()

  cy.deployToken().then(() => {
    cy.wait(5000) // wait for the blockchain - todo: replace with an event handler

    cy.get('#approveTokens').click()

    cy.approveTokenPermission({
      spendLimit: 'max',
      gasSetting: {
        maxBaseFee: 250,
        priorityFee: 150
      }
    })
  })
})

it('should approve tokens with the custom spend limit and custom gas limit', () => {
  cy.get('#createToken').click()

  cy.deployToken().then(() => {
    cy.wait(5000) // wait for the blockchain - todo: replace with an event handler

    cy.get('#approveTokens').click()

    cy.approveTokenPermission({
      spendLimit: 420,
      gasSetting: {
        maxBaseFee: 250,
        priorityFee: 150,
        gasLimit: 200_000
      }
    })
  })
})

it('should request permissions', () => {
  cy.get('#revokeAccountsPermission').click()
  cy.get('#getPermissions').click()

  cy.get('#permissionsResult').should('have.text', 'No permissions found.')

  cy.wait(1000)

  cy.get('#requestPermissions').click()

  cy.connectToDapp().then(() => {
    cy.get('#permissionsResult').should('have.text', 'eth_accounts')
  })
})
