import type { Locator } from '@playwright/test'
import { z } from 'zod'

// Custom implementation of `locator.allTextContents()` that is not utilizing `.map` which is not accessible under MetaMask's scuttling mode.
export async function allTextContents(locators: Locator[]) {
  const names = await Promise.all(locators.map((locator) => locator.textContent()))

  // We're making sure that the return type is `string[]` same as `locator.allTextContents()`.
  return names.map((name) => z.string().parse(name))
}
