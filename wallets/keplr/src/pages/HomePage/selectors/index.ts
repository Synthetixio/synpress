export const homePageElements = {
  tokenNameLabel: (tokenName: string) => `:text-is("${tokenName}")`,
  tokenParentSelector: '../../../..',
  selectAllTokensCheckbox: 'input[type="checkbox"]:enabled',
  newTokensFound: 'new token(s) found',
  addChainsButton: 'Add Chains',
  newTokensFoundSelector: 'text=new token(s) found',
}