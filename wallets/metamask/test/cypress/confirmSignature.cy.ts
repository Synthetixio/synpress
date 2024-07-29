before(() => {
  cy.get('#connectButton').click()
  cy.connectToDapp()
})

it('should confirm `personal_sign`', () => {
  cy.get('#personalSign').click()

  cy.confirmSignature()

  cy.get('#personalSignResult').should(
    'have.text',
    '0xf95b3efc808585303e20573e960993cde30c7f5a0f1c25cfab0379d5a14311d17898199814c8ebe66ec80b2b11690f840bde539f862ff4f04468d2a40f15178a1b'
  )

  cy.get('#personalSignVerify').click()

  cy.get('#personalSignVerifySigUtilResult').should('have.text', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
  cy.get('#personalSignVerifyECRecoverResult').should('have.text', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
})

it('should confirm `eth_signTypedData`', () => {
  cy.get('#signTypedData').click()

  cy.confirmSignature()

  cy.get('#signTypedDataResult').should(
    'have.text',
    '0xd75eece0d337f4e425f87bd112c849561956afe4f154cdd07d1d4cba7a979b481ba6ceede5c0eb9daa66bec4eea6e7ecfee5496274ef2a93b69abd97531519b21c'
  )

  cy.get('#signTypedDataVerify').click()

  cy.get('#signTypedDataVerifyResult').should('have.text', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
})

it('should confirm `eth_signTypedData_v3`', () => {
  cy.get('#signTypedDataV3').click()

  cy.confirmSignature()

  cy.get('#signTypedDataV3Result').should(
    'have.text',
    '0x6ea8bb309a3401225701f3565e32519f94a0ea91a5910ce9229fe488e773584c0390416a2190d9560219dab757ecca2029e63fa9d1c2aebf676cc25b9f03126a1b'
  )

  cy.get('#signTypedDataV3Verify').click()

  cy.get('#signTypedDataV3VerifyResult').should('have.text', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
})

it('should confirm `eth_signTypedData_v4`', () => {
  cy.get('#signTypedDataV4').click()

  cy.confirmSignature()

  cy.get('#signTypedDataV4Result').should(
    'have.text',
    '0x1cf422c4a319c19ecb89c960e7c296810278fa2bef256c7e9419b285c8216c547b3371fa1ec3987ce08561d3ed779845393d8d3e4311376d0bc0846f37d1b2821c'
  )

  cy.get('#signTypedDataV4Verify').click()

  cy.get('#signTypedDataV4VerifyResult').should('have.text', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
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
