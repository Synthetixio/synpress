import { helpers, metamask, metamaskPages } from 'metamask-legacy'

console.log('Current network:', helpers.getCurrentNetwork())
console.log('Example selector:', metamaskPages.mainPage.mainPageElements.importAccount.importButton)
console.log('MetaMask extension urls:', metamask.extensionUrls())
