import { describe, expect, it } from 'vitest'
import { bytesToMegabytes } from '../../src/utils/bytesToMegabytes'

describe('bytesToMegabytes', () => {
  it('converts bytes to megabytes and rounds the result', async () => {
    const result = bytesToMegabytes(21_260_893)

    expect(result).to.equal(20.3)
  })
})
