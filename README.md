[![npm version](https://badge.fury.io/js/@agoric%2Fsynpress.svg)](https://badge.fury.io/js/@agoric%2Fsynpress)
[![E2E (docker)](https://github.com/agoric-labs/synpress/actions/workflows/e2e_docker.yml/badge.svg?branch=master)](https://github.com/agoric-labs/synpress/actions/workflows/e2e_docker.yml)
[![Release CI](https://github.com/agoric-labs/synpress/actions/workflows/release.yml/badge.svg?branch=master)](https://github.com/agoric-labs/synpress/actions/workflows/release.yml)

#

`@agoric/synpress` is a testing framework designed to test DApps that use the Keplr Wallet.

For full commands and their examples,
[check here](https://github.com/agoric-labs/synpress/blob/master/support/index.d.ts).

## 🖥️ Install

```bash
# with pnpm
pnpm add --save-dev @agoric/synpress
# with npm
npm install --save-dev @agoric/synpress
# with yarn
yarn add -D @agoric/synpress
```

## 👝 Supported wallets

- [Keplr](https://www.keplr.app)
- [MetaMask](https://metamask.io/) (Currently in alpha)

## 👷 Example setup

Project structure:

```text
project_dir
└── src
└── tests
    └── e2e
        └── .eslintrc.js
        └── support.js
        └── specs
            └── example-spec.js
```

1. Create `.eslintrc.js` inside your tests folder (`/project_dir/tests/e2e`):

```js
const path = require('path');
const synpressPath = path.join(
  process.cwd(),
  '/node_modules/@agoric/synpress',
);

module.exports = {
  extends: `${synpressPath}/.eslintrc.js`,
};
```

2. Create `support.js` inside your tests folder (`/project_dir/tests/e2e`):

```js
import '@agoric/synpress/support/index';
```

_^ hint: you can also use this file to extend synpress - add custom commands,
and more.._

3. Add a command to your package.json file
```json
{
  ...
  "scripts": {
    ...
    "test:e2e": "EXTENSION=keplr synpress run"
  }
}
```

4. **(Optional)** Create a custom config file. @agoric/synpress aleardy has some configurations set up in this [file](https://github.com/agoric-labs/synpress/blob/master/synpress.config.js). To override this and add your custom config, you can create your own config file `synpress.config.js` in `/project_dir/tests/e2e`
```js
const baseConfig = require('@agoric/synpress/synpress.config');
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    baseUrl: 'http://localhost:5173',
  },
});
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
use this config by passing the `--configFile` flag to synpress
```json
{
  ...
  "scripts": {
    ...
    "test:e2e": "EXTENSION=keplr synpress run --configFile=test/e2e/synpress.config.js"
  }
}

```


5. You're done! 🎉

</br>

For an example project, you can take a look at how we've set up tests in this [repository](https://github.com/agoric-labs/synpress/tree/dev/tests/e2e) 

## 📃 Environmental variables

| Variable                | Description                                                                                                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EXTENSION` (Required)          | Picks which extension to use during tests. `keplr` and `metamask` are the only possible values                                                                                                                              |
| `SECRET_WORDS`          | Space separated words for the test wallet recovery phrase (mnemonic; 24 words)                                                                                                                              |
| `PRIVATE_KEY`           | Test wallet private key                                                                                                                                                                                     |
| `SYNDEBUG`              | Set debugging mode to be on                                                                                                                                                                                 |
| `STABLE_MODE`           | Introduce delay between main actions, 300ms by default (eg `STABLE_MODE=300ms`, `STABLE_MODE=true`)                                                                                                         |
| `SLOW_MODE`             | Introduce delay between every action, 50ms by default (eg `SLOW_MODE=true`, `SLOW_MODE=200ms`)                                                                                                              |
| `KEPLR_VERSION`      | Keplr version to be installed                                                                                                                                                                            |
| `SKIP_KEPLR_INSTALL` | Will skip installation of keplr wallet                                                                                                                                                                             |
| `SKIP_EXTENSION_SETUP`   | Will skip initial setup of wallet                                                                                                                                                                           |

These is a basic list of environment variables to be used. A more in depth list can be found [here](https://github.com/Synthetixio/synpress#-environmental-variables) 

## 📝 More resources

`@agoric/synpress` uses Synpress as its base and therefore supports most of its functionality. To learn more about command line options, usage examples, and CI/CD setup, you can use the original [README file](https://github.com/Synthetixio/synpress/blob/dev/README.md)