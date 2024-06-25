import type { BrowserContext } from '@playwright/test'
import { z } from 'zod'

const Extension = z.object({
  id: z.string(),
  name: z.string()
})

const Extensions = z.array(Extension)

/**
 * Returns the extension ID for the given extension name. The ID is fetched from the `chrome://extensions` page.
 *
 * ::: tip
 * This function soon will be removed to improve the developer experience! 😇
 * :::
 *
 * @param context - The browser context.
 * @param extensionName - The name of the extension, e.g., `MetaMask`.
 *
 * @returns The extension ID.
 */
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
