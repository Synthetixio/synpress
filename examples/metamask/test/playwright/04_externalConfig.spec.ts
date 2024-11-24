import { testWithSynpress } from '@synthetixio/synpress'
import { metaMaskFixtures } from '@synthetixio/synpress/playwright'
import config from '../config'
import importedConfigSetup from '../wallet-setup/importedConfig.setup'

const test = testWithSynpress(metaMaskFixtures(importedConfigSetup))

test('Properly generate cache', async ({ page }) => {
  await page.goto(config.baseUrl)
})
