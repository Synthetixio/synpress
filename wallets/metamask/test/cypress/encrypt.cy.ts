it('should provide public encryption key', () => {
  cy.get('#getEncryptionKeyButton').click()
  cy.providePublicEncryptionKey().then(() => {
    cy.get('#encryptionKeyDisplay').should('have.text', '4Yhh35o6z4dK2m5Hua4GltZ7IU9DdJPjLaspm6VDwHY=')
  })
})

it('should encrypt and decrypt a message', () => {
  cy.get('#getEncryptionKeyButton').click()
  cy.providePublicEncryptionKey().then(() => {
    cy.get('#encryptionKeyDisplay').should('have.text', '4Yhh35o6z4dK2m5Hua4GltZ7IU9DdJPjLaspm6VDwHY=')
  })

  // `fill` does not trigger buttons validation, so we use `type` instead
  cy.get('#encryptMessageInput').type('Hello, world')

  cy.get('#encryptButton').click()

  cy.get('#ciphertextDisplay').contains('0x7b')

  cy.get('#decryptButton').click()

  cy.decrypt().then(() => {
    cy.get('#cleartextDisplay').contains('Hello, world')
  })
})
