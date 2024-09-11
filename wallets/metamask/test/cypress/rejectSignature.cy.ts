it('should reject `personal_sign`', () => {
  cy.get('#personalSign').click()

  cy.rejectSignature()

  cy.get('#personalSign').should(
    'have.text',
    'Error: MetaMask Personal Message Signature: User denied message signature.'
  )
  cy.get('#personalSignResult').should('have.text', '')
})

it('should reject `eth_signTypedData`', () => {
  cy.get('#signTypedData').click()

  cy.rejectSignature()

  cy.get('#signTypedDataResult').should(
    'have.text',
    'Error: MetaMask Typed Message Signature: User denied message signature.'
  )
})

it('should reject `eth_signTypedData_v3`', () => {
  cy.get('#signTypedDataV3').click()

  cy.rejectSignature()

  cy.get('#signTypedDataV3Result').should(
    'have.text',
    'Error: MetaMask Typed Message Signature: User denied message signature.'
  )
})

it('should reject `eth_signTypedData_v4`', () => {
  cy.get('#signTypedDataV4').click()

  cy.rejectSignature()

  cy.get('#signTypedDataV4Result').should(
    'have.text',
    'Error: MetaMask Typed Message Signature: User denied message signature.'
  )
})
