import { chromium } from 'playwright-core'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { createCacheForWalletSetupFunction } from '../../src/utils/createCacheForWalletSetupFunction'
import * as WaitForExtensionOnLoadPage from '../../src/utils/waitForExtensionOnLoadPage'

const EXTENSION_PATH = '/tmp/extension'
const CONTEXT_PATH = '/tmp/context'
const EXPECTED_BROWSER_ARGS = [`--disable-extensions-except=${EXTENSION_PATH}`, `--load-extension=${EXTENSION_PATH}`]
const EXPECTED_BROWSER_ARGS_FOR_HEADLESS = [...EXPECTED_BROWSER_ARGS, '--headless=new']

vi.mock('playwright-core', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    // biome-ignore lint/suspicious/noExplicitAny: any type here is intentional
    ...(actual as any),
    chromium: {
      launchPersistentContext: vi.fn().mockImplementation(async () => {
        return {
          close: vi.fn()
        }
      })
    }
  }
})

vi.mock('../../src/utils/waitForExtensionOnLoadPage', async () => {
  return {
    waitForExtensionOnLoadPage: vi.fn().mockResolvedValue({
      duck: 'A mock Page full of quacks! 🦆'
    })
  }
})

describe('createCacheForWalletSetupFunction', () => {
  const launchPersistentContextSpy = vi.spyOn(chromium, 'launchPersistentContext')
  const walletSetup = vi.fn()
  const fileName = 'test.ts'

  const runCreateCacheForWalletSetupFunction = async () => {
    const promise = createCacheForWalletSetupFunction(EXTENSION_PATH, CONTEXT_PATH, walletSetup, fileName)
    await vi.runAllTimersAsync()
    await promise
  }

  afterAll(() => {
    vi.resetAllMocks()
  })

  beforeAll(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('calls chrome.launchPersistentContext with correct arguments', async () => {
    await runCreateCacheForWalletSetupFunction()

    expect(launchPersistentContextSpy).toHaveBeenCalledOnce()
    expect(launchPersistentContextSpy).toHaveBeenCalledWith(CONTEXT_PATH, {
      headless: false,
      args: EXPECTED_BROWSER_ARGS
    })
  })

  it('calls chrome.launchPersistentContext with correct arguments for headless mode', async () => {
    vi.stubEnv('HEADLESS', 'true')

    await runCreateCacheForWalletSetupFunction()

    expect(launchPersistentContextSpy).toHaveBeenCalledOnce()
    expect(launchPersistentContextSpy).toHaveBeenCalledWith(CONTEXT_PATH, {
      headless: false,
      args: EXPECTED_BROWSER_ARGS_FOR_HEADLESS
    })

    vi.unstubAllEnvs()
  })

  it('calls waitForExtensionOnLoadPage with correct argument', async () => {
    const waitForExtensionOnLoadPageSpy = vi.spyOn(WaitForExtensionOnLoadPage, 'waitForExtensionOnLoadPage')

    await runCreateCacheForWalletSetupFunction()

    expect(waitForExtensionOnLoadPageSpy).toHaveBeenCalledOnce()

    const context = launchPersistentContextSpy.mock.results[0]?.value
    expect(waitForExtensionOnLoadPageSpy).toHaveBeenCalledWith(context)
  })

  it('calls walletSetup', async () => {
    const waitForExtensionOnLoadPageSpy = vi.spyOn(WaitForExtensionOnLoadPage, 'waitForExtensionOnLoadPage')

    await runCreateCacheForWalletSetupFunction()

    expect(walletSetup).toHaveBeenCalledOnce()

    const context = launchPersistentContextSpy.mock.results[0]?.value
    const extensionPage = waitForExtensionOnLoadPageSpy.mock.results[0]?.value
    expect(walletSetup).toHaveBeenCalledWith(context, extensionPage)
  })

  it('throws an error if walletSetup throws one', async () => {
    const errorMessage = 'A duck has thrown a tantrum! 🦆'
    walletSetup.mockRejectedValueOnce(new Error(errorMessage))

    const promise = createCacheForWalletSetupFunction(EXTENSION_PATH, CONTEXT_PATH, walletSetup, fileName)

    await expect(promise).rejects.toThrowError(
      `[CORE] Encountered an error while executing wallet setup function from file ${fileName}. Error message: ${errorMessage}`
    )
  })

  it('closes context', async () => {
    const closeContext = vi.fn()
    // biome-ignore lint/suspicious/noExplicitAny: any type here is intentional
    launchPersistentContextSpy.mockResolvedValueOnce({ close: closeContext } as any)

    await runCreateCacheForWalletSetupFunction()

    expect(closeContext).toHaveBeenCalledOnce()
  })

  it('sleeps before closing the context', async () => {
    const closeContext = vi.fn()
    // biome-ignore lint/suspicious/noExplicitAny: any type here is intentional
    launchPersistentContextSpy.mockResolvedValueOnce({ close: closeContext } as any)

    const setTimeoutSpy = vi.spyOn(global, 'setTimeout')

    const promise = createCacheForWalletSetupFunction(EXTENSION_PATH, CONTEXT_PATH, walletSetup, fileName)

    // Verify that nothing was run yet.
    expect(walletSetup).not.toHaveBeenCalled()
    expect(setTimeoutSpy).not.toHaveBeenCalled()
    expect(closeContext).not.toHaveBeenCalled()

    // Verify that sleep was triggered between `walletSetup` and `context.close` calls.
    await vi.advanceTimersByTimeAsync(100)
    expect(walletSetup).toHaveBeenCalledOnce()
    expect(setTimeoutSpy).toHaveBeenCalled()
    expect(closeContext).not.toHaveBeenCalled()

    // Verify that `context.close` was triggered after the sleep.
    await vi.runAllTimersAsync()
    await promise
    expect(walletSetup).toHaveBeenCalledOnce()
    expect(setTimeoutSpy).toHaveBeenCalledOnce()
    expect(closeContext).toHaveBeenCalledOnce()
  })
})
