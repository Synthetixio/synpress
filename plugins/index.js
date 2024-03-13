module.exports = (on, config) => {
  const extension = process.env.EXTENSION;
  let selectedConfig;
  if (extension === 'metamask') {
    selectedConfig = require('./metamask-plugin');
  } else if (extension === 'keplr') {
    selectedConfig = require('./keplr-plugin');
  } else {
    throw new Error(`${extension} is not a valid extension name`);
  }

  if (process.env.SKIP_EXTENSION_SETUP) {
    config.env.SKIP_EXTENSION_SETUP = JSON.parse(
      process.env.SKIP_EXTENSION_SETUP,
    );
  }

  if (process.env.EXTENSION) {
    config.env.EXTENSION = process.env.EXTENSION;
  }

  return selectedConfig(on, config);
};
