import { afterAll, describe, expect, it, vi } from 'vitest'
import { removeTempContextDir } from '../../src/utils/removeTempContextDir'

const PATH = 'Happy Quack Path'
const MAX_RETRIES = 10

// This mock acts both as a mock and a spy.
// I couldn't make `vi.spyOn` or mocking a throw to work, so this is used instead.
vi.mock('rimraf', async () => {
  return {
    rimraf: vi.fn(async (path: string, options: { maxRetries: number }) => {
      expect(path).toEqual(PATH)
      expect(options.maxRetries).toEqual(MAX_RETRIES)
    })
  }
})

describe('removeTempContextDir', () => {
  afterAll(() => {
    vi.resetAllMocks()
  })

  it('returns null on success', async () => {
    const result = await removeTempContextDir(PATH)
    expect(result).toBeNull()
  })

  it('returns error if one occurred', async () => {
    const result = await removeTempContextDir('A Ducking Wrong Path')
    expect(result?.message).toMatch(/expected 'A Ducking Wrong Path' to deeply equal/)
  })
})
