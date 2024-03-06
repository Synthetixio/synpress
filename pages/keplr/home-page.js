const tokenNameLabel = tokenName => `:text-is("${tokenName}")`;
const tokenParentSelector = '../../../..';
const selectAllTokensCheck = 'input[type="checkbox"]:enabled';
const newTokensFound = 'new token(s) found';
const addChainsButton = 'Add Chains';

module.exports.homePageElements = {
  tokenNameLabel,
  tokenParentSelector,
  selectAllTokensCheck,
  newTokensFound,
  addChainsButton,
};
