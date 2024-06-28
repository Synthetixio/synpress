import os from 'node:os'
import path from 'node:path'
import fs from 'fs-extra'

/**
 * Creates a temporary context directory.
 * This directory should be created per-worker basis.
 *
 * This function mirrors the one found in the Playwright source code:
 * https://github.com/microsoft/playwright/blob/d1d5fc67dc684a5d4b682749e59bba8cc0ad14de/packages/playwright-core/src/server/browserType.ts#L161
 */
export async function createTempContextDir(browserName: string, testId: string) {
  return await fs.mkdtemp(path.join(os.tmpdir(), `synpress_${browserName}_${testId}_`))
}
