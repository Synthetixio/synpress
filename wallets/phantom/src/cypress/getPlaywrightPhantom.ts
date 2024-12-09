import type { BrowserContext, Page } from '@playwright/test'
import { Phantom } from '../playwright'

let phantom: Phantom | undefined

export default function getPlaywrightPhantom(
  context: BrowserContext,
  phantomExtensionPage: Page,
  phantomExtensionId: string
) {
  if (!phantom) {
    phantom = new Phantom(context, phantomExtensionPage, 'password', phantomExtensionId)
  }
  return phantom
}
