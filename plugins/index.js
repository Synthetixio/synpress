module.exports = (on, config) => {
  const extension = process.env.EXTENSION;
  let selectedConfig;
  if (extension === 'metamask') {
    selectedConfig = require('./metamask-plugin');
  } else if (extension === 'keplr') {
    selectedConfig = require('./keplr-plugin');
  } else {
    throw new InvalidInputException(
      `${extension} is not a valid extension name`,
    );
  }

  return selectedConfig(on, config);
};
