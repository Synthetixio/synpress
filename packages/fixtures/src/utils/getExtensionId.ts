import type { BrowserContext } from '@playwright/test'
import { z } from 'zod'

const Extension = z.object({
  id: z.string(),
  name: z.string()
})

const Extensions = z.array(Extension)

export async function getExtensionId(context: BrowserContext, extensionName: string) {
  const page = await context.newPage()
  await page.goto('chrome://extensions')

  const unparsedExtensions = await page.evaluate('chrome.management.getAll()')

  const allExtensions = Extensions.parse(unparsedExtensions)
  const targetExtension = allExtensions.find(
    (extension) => extension.name.toLowerCase() === extensionName.toLowerCase()
  )

  if (!targetExtension) {
    throw new Error(
      [
        `[GetExtensionId] Extension with name ${extensionName} not found.`,
        `Available extensions: ${allExtensions.map((extension) => extension.name).join(', ')}`
      ].join('\n')
    )
  }

  await page.close()

  return targetExtension.id
}
