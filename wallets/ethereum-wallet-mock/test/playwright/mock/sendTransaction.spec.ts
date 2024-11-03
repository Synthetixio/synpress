import { ACCOUNT_MOCK } from '../../../src/constants'
import test from '../../../src/playwright/synpress'

const { expect } = test

const TO_ADDRESS = '0x5Af489c8786A018EC4814194dC8048be1007e390'
const VALUE = '2000000000000000000' // 2 ETH

test('should mock and send transaction', async ({ ethereumWalletMock }) => {
  // Connect wallet first
  await ethereumWalletMock.connectToDapp()

  // Send the transaction
  const txHash = await ethereumWalletMock.sendTransaction(TO_ADDRESS, VALUE)

  // Verify transaction hash format
  expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/)
})

test('should mock and send transaction with zero value', async ({ ethereumWalletMock }) => {
  await ethereumWalletMock.connectToDapp()

  const txHash = await ethereumWalletMock.sendTransaction(TO_ADDRESS, '0')

  expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/)
})

test('should mock and send transaction to same address', async ({ ethereumWalletMock }) => {
  await ethereumWalletMock.connectToDapp()

  const txHash = await ethereumWalletMock.sendTransaction(ACCOUNT_MOCK, VALUE)

  expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/)
})

test('should mock and send multiple transactions', async ({ ethereumWalletMock }) => {
  await ethereumWalletMock.connectToDapp()

  const transactions = [
    { to: TO_ADDRESS, value: '1000000000000000000' }, // 1 ETH
    { to: TO_ADDRESS, value: '3000000000000000000' }, // 3 ETH
    { to: TO_ADDRESS, value: '500000000000000000' } // 0.5 ETH
  ]

  for (const tx of transactions) {
    const txHash = await ethereumWalletMock.sendTransaction(tx.to, tx.value)
    expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/)
  }
})

test('should fail with invalid value', async ({ ethereumWalletMock }) => {
  await ethereumWalletMock.connectToDapp()

  const invalidValue = 'invalid'

  await expect(ethereumWalletMock.sendTransaction(TO_ADDRESS, invalidValue)).rejects.toThrow()
})
