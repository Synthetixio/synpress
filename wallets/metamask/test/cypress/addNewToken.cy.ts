before(() => {
  cy.getNetwork().then((network) => {
    if (network !== 'Anvil') {
      cy.switchNetwork('Anvil')
    }
  })

  cy.get('#connectButton').click()

  cy.connectToDapp()
})

it('should add new token to MetaMask', () => {
  cy.get('#createToken').click()

  cy.deployToken().then(() => {
    // wait for the blockchain - todo: replace with an event handler
    cy.wait(5000)

    cy.get('#tokenAddresses').should('have.text', '0x7ef8E99980Da5bcEDcF7C10f41E55f759F6A174B')

    cy.get('#watchAssets').click()

    cy.addNewToken()
  })
})

it('should add new token using EIP747', () => {
  cy.get('#eip747ContractAddress').type('0x5FbDB2315678afecb367f032d93F642f64180aa3')
  cy.get('#eip747Symbol').type('TST')
  cy.get('#eip747Decimals').type('4')

  cy.get('#eip747WatchButton').click()

  cy.addNewToken().then(() => {
    cy.get('#eip747Status').should('have.text', 'NFT added successfully')
  })
})
