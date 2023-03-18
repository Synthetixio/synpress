const ENV_VARS = {
  SECRET_WORDS: getEnvVar('SECRET_WORDS'),
  PRIVATE_KEY: getEnvVar('PRIVATE_KEY'),
  NETWORK_NAME: getEnvVar('NETWORK_NAME'),
  RPC_URL: getEnvVar('RPC_URL'),
  CHAIN_ID: getEnvVar('CHAIN_ID'),
  SYMBOL: getEnvVar('SYMBOL'),
  IS_TESTNET: getEnvVar('IS_TESTNET'),
  BLOCK_EXPLORER: getEnvVar('BLOCK_EXPLORER'),
  SYNDEBUG: getEnvVar('SYNDEBUG'),
  STABLE_MODE: getEnvVar('STABLE_MODE'),
  SLOW_MODE: getEnvVar('SLOW_MODE'),
  METAMASK_VERSION: getEnvVar('METAMASK_VERSION'),
  SKIP_METAMASK_INSTALL: getEnvVar('SKIP_METAMASK_INSTALL'),
  SKIP_METAMASK_SETUP: getEnvVar('SKIP_METAMASK_SETUP'),
  RESET_METAMASK: getEnvVar('RESET_METAMASK'),
  GH_USERNAME: getEnvVar('GH_USERNAME'),
  GH_PAT: getEnvVar('GH_PAT'),
  ETHERSCAN_KEY: getEnvVar('ETHERSCAN_KEY'),
  FAIL_ON_ERROR: getEnvVar('FAIL_ON_ERROR'),
  CYPRESS_GROUP: getEnvVar('CYPRESS_GROUP'),
  CI: getEnvVar('CI'),
  DEBUG: getEnvVar('DEBUG'),
  HEADLESS_MODE: getEnvVar('HEADLESS_MODE'),
  BASE_URL: getEnvVar('BASE_URL'),
  PWDEBUG: getEnvVar('PWDEBUG'),
};

/**
 *  ### Get environment variables.
 *  Prefixed environment variables (e.g. `E2E_`) have
 *  priority over non-prefix ones to avoid name clashing. For example when
 *  looking for `SECRET_WORDS`, first will look for `E2E_SECRET_WORDS` if not
 *  found will look for `SECRET_WORDS`
 */
function getEnvVar(envVar, prefix = 'E2E_') {
  return process.env[prefix.concat(envVar)] || process.env[envVar];
}

module.exports = {
  ENV_VARS,
  getEnvVar,
};
