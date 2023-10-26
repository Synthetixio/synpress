import { afterAll, afterEach, describe, expect, it, vi } from 'vitest'

import path from 'node:path'
import { createCache } from '../src/createCache'
import type { WalletSetupFunction } from '../src/defineWalletSetup'
import * as GetUniqueWalletSetupFunctions from '../src/utils/getUniqueWalletSetupFunctions'
import * as TriggerCacheCreation from '../src/utils/triggerCacheCreation'

const ROOT_DIR = '/tmp'

const setupFunctions = new Map<string, { fileName: string; setupFunction: WalletSetupFunction }>()

setupFunctions.set('hash1', { fileName: path.join(ROOT_DIR, 'hash1'), setupFunction: vi.fn() })
setupFunctions.set('hash2', { fileName: path.join(ROOT_DIR, 'hash2'), setupFunction: vi.fn() })
setupFunctions.set('hash3', { fileName: path.join(ROOT_DIR, 'hash3'), setupFunction: vi.fn() })

vi.mock('../src/utils/getUniqueWalletSetupFunctions', async () => {
  return {
    getUniqueWalletSetupFunctions: vi.fn().mockImplementation(async () => {
      return setupFunctions
    })
  }
})

vi.mock('../src/utils/triggerCacheCreation', async () => {
  return {
    triggerCacheCreation: vi.fn().mockImplementation(async () => {
      return ['hash1', 'hash2', 'hash3']
    })
  }
})

describe('createCache', () => {
  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

  afterAll(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('calls getUniqueWalletSetupFunctions with correct arguments', async () => {
    const getUniqueWalletSetupFunctionsSpy = vi.spyOn(GetUniqueWalletSetupFunctions, 'getUniqueWalletSetupFunctions')

    await createCache(ROOT_DIR, vi.fn(), false)

    expect(getUniqueWalletSetupFunctionsSpy).toHaveBeenCalledOnce()
    expect(getUniqueWalletSetupFunctionsSpy).toHaveBeenCalledWith(ROOT_DIR)
  })

  it('calls triggerCacheCreation with correct arguments', async () => {
    const triggerCacheCreationSpy = vi.spyOn(TriggerCacheCreation, 'triggerCacheCreation')

    const downloadExtension = vi.fn(async () => path.join(ROOT_DIR, 'extension'))
    await createCache(ROOT_DIR, downloadExtension, false)

    expect(triggerCacheCreationSpy).toHaveBeenCalledOnce()
    expect(triggerCacheCreationSpy).toHaveBeenCalledWith(setupFunctions, downloadExtension, false)
  })

  it('does nothing if no setup functions need caching', async () => {
    vi.spyOn(TriggerCacheCreation, 'triggerCacheCreation').mockResolvedValueOnce([])

    await createCache(ROOT_DIR, vi.fn(), false)

    expect(consoleLogSpy).toHaveBeenCalledOnce()
    expect(consoleLogSpy).toHaveBeenCalledWith('No new setup functions to cache. Exiting...')
  })

  it('console.logs at the end', async () => {
    await createCache(ROOT_DIR, vi.fn(), false)

    expect(consoleLogSpy).toHaveBeenCalledOnce()
    expect(consoleLogSpy).toHaveBeenCalledWith('All wallet setup functions are now cached!')
  })
})
