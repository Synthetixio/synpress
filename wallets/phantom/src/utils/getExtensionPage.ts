import type { Page } from "@playwright/test";

export const getExtensionPage = async (page: Page, extensionId: string, route: string) => {
  const extensionHomeUrl = `chrome-extension://${extensionId}/notification.html`;

  const routes: any = {
    advanced: `${extensionHomeUrl}#settings/advanced`,
    settings: `${extensionHomeUrl}#settings`,
    experimental: `${extensionHomeUrl}#settings/experimental`,
    addNetwork: `${extensionHomeUrl}#settings/networks/add-network`,
    newAccount: `${extensionHomeUrl}#new-account`,
    importAccount: `${extensionHomeUrl}#new-account/import`,
    importToken: `${extensionHomeUrl}#import-token`,
  }

  page.goto(routes[route])
}