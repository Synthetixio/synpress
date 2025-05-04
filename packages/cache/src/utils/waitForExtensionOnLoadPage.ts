import { type BrowserContext, type Page, errors as playwrightErrors } from 'playwright-core'

// Increase timeout for CI environments
const EXTENSION_LOAD_TIMEOUT = 10000
// Increase max retries for CI environments
const MAX_RETRIES = 3
// Add delay between retries
const RETRY_DELAY_BASE = 1000
// Initial delay to ensure browser is fully initialized
const INITIAL_BROWSER_DELAY = 1000
// Max retries for fixing blank pages
const MAX_BLANK_PAGE_RETRIES = 5
// Delay after page reload
const RELOAD_DELAY = 1000
// Polling interval for finding extension page
const POLLING_INTERVAL = 500

const APP_SELECTORS = {
  METAMASK: '#app-content .app',
  PHANTOM: '#root'
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Checks if a page is blank (no MetaMask or Phantom app content)
 */
async function isPageBlank(page: Page, extensionPath: string): Promise<boolean> {
  const app = (extensionPath: string) => {
    if (extensionPath.includes('metamask')) {
      return 'METAMASK'
    } else {
      return 'PHANTOM'
    }
  }

  try {
    // Check for specific app element
    const appElementCount = await page
      .locator(APP_SELECTORS[app(extensionPath)])
      .count()
      .catch(() => 0)

    if (appElementCount === 0) {
      console.log(`[WaitForExtensionOnLoadPage] ${app(extensionPath)} app element not found, page appears to be blank`)
      return true
    }

    return false
  } catch (e) {
    console.warn(
      `[WaitForExtensionOnLoadPage] Error checking if page is blank: ${e instanceof Error ? e.message : String(e)}`
    )
    return true // Assume blank if we can't check
  }
}

/**
 * Attempts to fix a blank page by reloading
 */
async function fixBlankPage(page: Page, extensionPath: string): Promise<boolean> {
  for (let attempt = 0; attempt < MAX_BLANK_PAGE_RETRIES; attempt++) {
    console.log(`[WaitForExtensionOnLoadPage] Checking page state (attempt ${attempt + 1}/${MAX_BLANK_PAGE_RETRIES})`)

    const isBlank = await isPageBlank(page, extensionPath)

    if (isBlank) {
      console.log('[WaitForExtensionOnLoadPage] Page is blank, reloading...')
      await page.reload()
      await sleep(RELOAD_DELAY)
    } else {
      console.log('[WaitForExtensionOnLoadPage] Page appears to be loaded correctly')
      return true
    }
  }

  console.warn('[WaitForExtensionOnLoadPage] Failed to fix blank/error page after multiple attempts')
  return false
}

/**
 * Finds an extension page in the current browser context
 */
async function findExtensionPage(context: BrowserContext): Promise<Page | null> {
  const pages = context.pages()
  const extensionPage = pages.find((page) => {
    try {
      const url = page.url()
      return url.startsWith('chrome-extension://')
    } catch (e) {
      return false
    }
  })

  return extensionPage || null
}

/**
 * Waits for the extension page to load and ensures it's not blank or has errors
 */
export async function waitForExtensionOnLoadPage(context: BrowserContext, extensionPath: string): Promise<Page> {
  let retries = 0
  console.log(
    `[WaitForExtensionOnLoadPage] Starting with timeout: ${EXTENSION_LOAD_TIMEOUT}ms and max retries: ${MAX_RETRIES}`
  )

  // Initial delay to ensure browser is fully initialized
  console.log(`[WaitForExtensionOnLoadPage] Waiting ${INITIAL_BROWSER_DELAY}ms for browser to initialize...`)
  await sleep(INITIAL_BROWSER_DELAY)

  const startTime = Date.now()

  while (retries <= MAX_RETRIES) {
    try {
      console.log(
        `[WaitForExtensionOnLoadPage] Looking for extension page (attempt ${retries + 1}/${MAX_RETRIES + 1})...`
      )

      // Poll for extension page until timeout
      let extensionPage: Page | null = null
      let pollingAttempts = 0
      const maxPollingAttempts = Math.floor(EXTENSION_LOAD_TIMEOUT / POLLING_INTERVAL)

      while (pollingAttempts < maxPollingAttempts) {
        extensionPage = await findExtensionPage(context)

        if (extensionPage) {
          console.log(`[WaitForExtensionOnLoadPage] Found extension page after ${pollingAttempts + 1} polling attempts`)
          break
        }

        pollingAttempts++
        console.log(
          `[WaitForExtensionOnLoadPage] No extension page found, polling (${pollingAttempts}/${maxPollingAttempts})...`
        )
        await sleep(POLLING_INTERVAL)
      }

      if (!extensionPage) {
        throw new playwrightErrors.TimeoutError(
          `Timed out waiting for extension page after ${EXTENSION_LOAD_TIMEOUT}ms`
        )
      }

      // Now check if the page is blank or has errors and fix if needed
      console.log('[WaitForExtensionOnLoadPage] Checking if extension page is properly loaded...')
      const isFixed = await fixBlankPage(extensionPage, extensionPath)

      if (isFixed) {
        console.log('[WaitForExtensionOnLoadPage] Extension page is properly loaded and ready')
        return extensionPage
      } else {
        throw new Error('Failed to fix blank or error page')
      }
    } catch (e) {
      retries++

      // Log more detailed information about the current browser state
      const pages = context.pages()
      console.log(`[WaitForExtensionOnLoadPage] Current browser has ${pages.length} pages open`)
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]
        if (page) {
          try {
            console.log(`[WaitForExtensionOnLoadPage] Page ${i + 1}: ${page.url()}`)
          } catch (urlError) {
            console.log(`[WaitForExtensionOnLoadPage] Page ${i + 1}: Unable to get URL`)
          }
        }
      }

      if (retries <= MAX_RETRIES) {
        const delayTime = RETRY_DELAY_BASE * retries
        console.warn(
          `[WaitForExtensionOnLoadPage] Extension page issue, retrying (attempt ${retries}/${MAX_RETRIES}) after ${delayTime}ms delay...`
        )

        await sleep(delayTime)
        continue
      }

      const elapsedTime = Date.now() - startTime
      throw new Error(
        `[WaitForExtensionOnLoadPage] Extension failed to load properly after ${elapsedTime}ms and ${retries} attempts!`
      )
    }
  }

  // This should never be reached
  throw new Error('[WaitForExtensionOnLoadPage] Unexpected end of function reached')
}
