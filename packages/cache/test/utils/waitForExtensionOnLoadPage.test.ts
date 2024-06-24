import { errors as playwrightErrors } from 'playwright-core'
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest'
import { waitForExtensionOnLoadPage } from '../../src/utils/waitForExtensionOnLoadPage'

const createContext = vi.fn().mockReturnValue({
  waitForEvent: vi.fn().mockResolvedValue(undefined)
})

const createTimeoutContext = vi.fn().mockReturnValue({
  waitForEvent: vi.fn().mockImplementation(() => {
    throw new playwrightErrors.TimeoutError('Timeout :)')
  })
})

const createThrowContext = vi.fn().mockReturnValue({
  waitForEvent: vi.fn().mockImplementation(() => {
    throw new Error('Unknown Quack!')
  })
})

describe('waitForExtensionOnLoadPage', () => {
  afterAll(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('calls context.waitForEvent with correct arguments', async () => {
    const context = createContext()
    const waitForEventSpy = vi.spyOn(context, 'waitForEvent')

    await waitForExtensionOnLoadPage(context)

    expect(waitForEventSpy).toHaveBeenCalledOnce()
    expect(waitForEventSpy).toHaveBeenCalledWith('page', { timeout: 5000 })
  })

  it('throws with custom error if waitForEvent throws due to timeout', async () => {
    const context = createTimeoutContext()

    await expect(waitForExtensionOnLoadPage(context)).rejects.toThrowError(
      '[WaitForExtensionOnLoadPage] Extension did not load in time!'
    )
  })

  it('throws if unknown error', async () => {
    const context = createThrowContext()

    await expect(waitForExtensionOnLoadPage(context)).rejects.toThrowError('Unknown Quack!')
  })
})
