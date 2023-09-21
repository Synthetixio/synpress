import { helpers, metamaskPages } from 'metamask-legacy'

console.log(helpers.getCurrentNetwork())
console.log(
  'Example selector:',
  metamaskPages.mainPage.mainPageElements.importAccount.importButton
)
