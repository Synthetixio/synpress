it('should confirm `personal_sign`', () => {
  cy.get('#personalSign').click()

  cy.confirmSignature()

  cy.get('#personalSignResult').should(
    'have.text',
    '0x9979ca3126a989995ac4a824bb91a2b624c4fb8d55934a76a269be56227c1d725379cd37ae83d8955bc3bf1d6dd5887cc036fcb4ca7ebac6d78cb7441bb1e9ad1c'
  )

  cy.get('#personalSignVerify').click()

  cy.get('#personalSignVerifySigUtilResult').should('have.text', '0x976ea74026e726554db657fa54763abd0c3a0aa9')
  cy.get('#personalSignVerifyECRecoverResult').should('have.text', '0x976ea74026e726554db657fa54763abd0c3a0aa9')
})

it('should confirm `eth_signTypedData`', () => {
  cy.get('#signTypedData').click()

  cy.confirmSignature()

  cy.get('#signTypedDataResult').should(
    'have.text',
    '0xb1658385404c1f7730369ea91bd0272e7fb4ea6450257887e8a287ac7e412ec14cf4938d5422d29dab3bc1b1cdef21d27f95a12ff823e8efc27af8d788c347a91c'
  )

  cy.get('#signTypedDataVerify').click()

  cy.get('#signTypedDataVerifyResult').should('have.text', '0x976ea74026e726554db657fa54763abd0c3a0aa9')
})

it('should confirm `eth_signTypedData_v3`', () => {
  cy.get('#signTypedDataV3').click()

  cy.confirmSignature()

  cy.get('#signTypedDataV3Result').should(
    'have.text',
    '0x9f74431e66c2c63fdb1fe32c0fa20d02b903ec9e1f6e25cf9cc45b2f8fcd00057b01758611e07fc70d41f1347f9f5b307e25951c39ba8a0b226c280cea9a84751b'
  )

  cy.get('#signTypedDataV3Verify').click()

  cy.get('#signTypedDataV3VerifyResult').should('have.text', '0x976ea74026e726554db657fa54763abd0c3a0aa9')
})

it('should confirm `eth_signTypedData_v4`', () => {
  cy.get('#signTypedDataV4').click()

  cy.confirmSignature()

  cy.get('#signTypedDataV4Result').should(
    'have.text',
    '0x3145a267aa3e6ba1b5f6374ea2ff62bb8de433096e4c4bed23bf9532a208690e3580fb9076ad40814a8e3ba23e0db2444dfc0baf7dddc5c72a440f1e65b85a331c'
  )

  cy.get('#signTypedDataV4Verify').click()

  cy.get('#signTypedDataV4VerifyResult').should('have.text', '0x976ea74026e726554db657fa54763abd0c3a0aa9')
})

// TODO: `unsafe_enableEthSign` needs to be implemented
// it('should confirm `eth_sign`', () => {
//   await metamask.unsafe_enableEthSign()
//
//   cy.get('#ethSign').click()
//
//   await metamask.confirmSignatureWithRisk()
//
//   await expect(page.locator('#ethSignResult')).toContainText(
//     '0xbfefd81020331aa2869403ba11711f082506b9c9313c29a212975067123ca222536ba40b17d8847356cc4ee448fb088231db98632e745e469f7e3d142e4256541b'
//   )
// })
//
// it('should not be permitted to confirm `eth_sign`', () => {
//   await metamask.unsafe_enableEthSign()
//   await metamask.disableEthSign()
//
//   cy.get('#ethSign').click()
//
//   await expect(page.locator('#ethSign')).toContainText(
//     'Error: eth_sign has been disabled. You must enable it in the advanced settings'
//   )
// })
