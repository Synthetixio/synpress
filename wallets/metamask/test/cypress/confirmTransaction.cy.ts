const triggerEIP1559Transaction = () => {
  cy.get('#sendEIP1559Button').click()
}

const connectDeployAndMintNft = () => {
  cy.get('#deployNFTsButton').click()

  return cy.confirmTransaction().then(() => {
    cy.wait(5000)

    cy.get('#mintButton').click()
    cy.confirmTransaction()

    cy.wait(5000)
  })
}

describe('with default gas setting', () => {
  it('should confirm contract deployment', () => {
    cy.get('#tokenAddresses').should('be.empty')

    cy.get('#createToken').click()

    cy.confirmTransaction().then(() => {
      cy.get('#tokenAddresses').should('include', /^0x/)
    })
  })

  it('should confirm legacy transaction', () => {
    cy.get('#sendButton').click()

    cy.confirmTransaction()
  })

  it('should confirm EIP-1559 transaction', () => {
    triggerEIP1559Transaction()

    cy.confirmTransaction()
  })
})

describe('NFTs', () => {
  it('should confirm `watch NFT` request', () => {
    connectDeployAndMintNft().then(() => {
      cy.get('#watchNFTButton').click()

      cy.confirmTransaction()
    })
  })

  it('should confirm `watch all NFTs` request', () => {
    connectDeployAndMintNft().then(() => {
      cy.get('#watchNFTsButton').click()

      cy.confirmTransaction()
    })
  })

  it('should confirm `approve` transaction', () => {
    connectDeployAndMintNft().then(() => {
      cy.get('#approveButton').click()

      cy.confirmTransaction().then(() => {
        cy.get('#nftsStatus').should('have.text', 'Approve initiated')

        cy.wait(5000)

        cy.get('#nftsStatus').should('have.text', 'Approve completed')
      })
    })
  })

  it('should confirm `set approval for all` transaction', () => {
    connectDeployAndMintNft().then(() => {
      cy.get('#setApprovalForAllButton').click()

      cy.confirmTransaction().then(() => {
        cy.get('#nftsStatus').should('have.text', 'Set Approval For All completed')
      })
    })
  })

  it('should confirm `revoke` transaction', () => {
    connectDeployAndMintNft().then(() => {
      cy.get('#revokeButton').click()

      cy.confirmTransaction().then(() => {
        cy.wait(5000)

        cy.get('#nftsStatus').should('have.text', 'Revoke completed')
      })
    })
  })

  it('should confirm `transfer from` transaction', () => {
    connectDeployAndMintNft().then(() => {
      cy.get('#transferFromButton').click()

      cy.confirmTransaction().then(() => {
        cy.wait(5000)

        cy.get('#nftsStatus').should('have.text', 'Transfer From completed')
      })
    })
  })
})

describe('with custom gas setting', () => {
  it('should confirm transaction with "site" gas setting', () => {
    triggerEIP1559Transaction()

    cy.confirmTransaction({ gasSetting: 'site' }).then(() => {
      return true
    })
  })
})

describe('with advanced (manual) gas setting', () => {
  it('should confirm transaction with custom gas limit', () => {
    triggerEIP1559Transaction()

    cy.confirmTransaction({
      gasSetting: {
        maxBaseFee: 250,
        priorityFee: 150,
        gasLimit: 250_000
      }
    })
  })

  it('should confirm transaction with small gas fee', () => {
    triggerEIP1559Transaction()

    cy.confirmTransaction({
      gasSetting: {
        maxBaseFee: 250,
        priorityFee: 150
      }
    })
  })

  // We're testing huge gas fee here, due to a bug in MetaMask. See comment inside the `confirmTransaction` method.
  it('should confirm transaction with huge gas fee', () => {
    triggerEIP1559Transaction()

    cy.confirmTransaction({
      gasSetting: {
        maxBaseFee: 250_000,
        priorityFee: 150_000
      }
    })
  })

  it('should confirm `set approval for all` transaction', () => {
    connectDeployAndMintNft().then(() => {
      cy.get('#setApprovalForAllButton').click()

      cy.confirmTransaction({
        gasSetting: {
          maxBaseFee: 250,
          priorityFee: 150
        }
      }).then(() => {
        cy.get('#nftsStatus').should('have.text', 'Set Approval For All completed')
      })
    })
  })
})

describe('with `from` and `to` specified', () => {
  it('should confirm from/to transfer', () => {
    cy.get('#createToken').click()
    cy.deployToken().then(() => {
      cy.wait(5000) // wait for the blockchain - todo: replace with an event handler

      cy.getAccountAddress().then((accountAddress) => {
        cy.get('#transferFromSenderInput').type(accountAddress)
        cy.get('#transferFromRecipientInput').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')

        cy.get('#transferFromTokens').click()
        cy.confirmTransaction()
      })
    })
  })
})

describe('without gas limit', () => {
  it('should approve tokens', () => {
    cy.get('#createToken').click()
    cy.deployToken().then(() => {
      cy.get('#approveTokensWithoutGas').click()
      cy.approveTokenPermission()
    })
  })

  it('should transfer tokens', () => {
    cy.get('#createToken').click()
    cy.deployToken().then(() => {
      cy.get('#transferTokensWithoutGas').click()
      cy.confirmTransaction()
    })
  })
})

describe('using custom transaction form', () => {
  it('should send defined amount', () => {
    cy.get('#toInput').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    cy.get('#amountInput').type('3')
    cy.get('#gasInput').type('1000000000')

    cy.get('#submitForm').click()
    cy.confirmTransaction()
  })
})
