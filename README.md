[![npm version](https://badge.fury.io/js/%40synthetixio%2Fsynpress.svg)](https://badge.fury.io/js/%40synthetixio%2Fsynpress)
![Synpress CI](https://github.com/Synthetixio/synpress/workflows/Synpress%20CI/badge.svg?branch=master)
[![CodeQL](https://github.com/Synthetixio/synpress/actions/workflows/codeql.yml/badge.svg?branch=master)](https://github.com/Synthetixio/synpress/actions/workflows/codeql.yml)
[![Release CI](https://github.com/Synthetixio/synpress/actions/workflows/release.yml/badge.svg?branch=master)](https://github.com/Synthetixio/synpress/actions/workflows/release.yml)
[![synpress](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/wv9yi9/master&style=flat)](https://dashboard.cypress.io/projects/wv9yi9/runs)
[![Discord](https://img.shields.io/discord/413890591840272394.svg?color=768AD4&label=discord&logo=https%3A%2F%2Fdiscordapp.com%2Fassets%2F8c9701b98ad4372b58f13fd9f65f966e.svg)](https://discordapp.com/channels/413890591840272394/)
[![Twitter Follow](https://img.shields.io/twitter/follow/synthetix_io.svg?label=synthetix_io&style=social)](https://twitter.com/synthetix_io)

# ⚙️ Synpress

[Synpress](https://github.com/Synthetixio/synpress) is an wrapper around [Cypress.io](https://github.com/cypress-io/cypress) with [metamask](https://metamask.io/) support thanks to [puppeteer](https://github.com/puppeteer/puppeteer).

Synpress makes sure to always use latest version of metamask before tests are ran.

It also provides an easy way to use metamask straight from your e2e tests.

For usage examples, feel free to take a look at [kwenta](https://github.com/kwenta/kwenta/tree/master/tests/e2e), [staking](https://github.com/Synthetixio/staking/tree/master/tests/e2e) or [synpress](https://github.com/Synthetixio/synpress/tree/master/tests/e2e) repository.

For additional custom commands and their examples, [check here](https://github.com/synthetixio/synpress/blob/master/support/index.d.ts).

**Features:**

- metamask support
- ability to use latest metamask or lock it's version to avoid unexpected failures related to metamask update
- supports multi-lang of metamask, it doesn't depend on any labels
- synpress is fully [tested](https://github.com/Synthetixio/synpress/tree/dev/tests/e2e/specs)
- automatically waits for all XHR requests to be finished before tests are run
- ability to fail e2e tests if there are any browser console error found during test run
- types support for all additional custom commands
- the best possible options set up in place to avoid flakiness
- etherscan API helpers in place which for ex. allows to compare your transaction results with etherscan and check tx status
- synthetix helpers in place which allows to interact with synthetix protocol programatically

## 👉 Tutorial configure Synpress

Project structure:

```text
project_dir
└── package.json
└── src
└── testing
     └── e2e
        └── .eslintrc.js
        └── tsconfig.json
        └── synpress.json
        └── specs
            └── example-spec.js
        └── pages
            └── example-page.js
        └── screenshots
        └── support
            └── commands.ts
```

1. Create a test folder (you can use the cypress default folder structure: [cypress folder](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests)).

2. Add synpress and cypress-es-lint-plugin to your dependencies:

   Example `package.json`:

   ```json
   {
     "devDependencies": {
       "@synthetixio/synpress": "1.1.1",
       "eslint-plugin-cypress": "^2.12.1"
     },
     "name": "testing",
     "version": "1.0.0",
     "description": "",
     "main": ".eslintrc.js",
     "scripts": {
       "test": "npy synpress run -ne -cf tests/e2e/synpress.json",
       "start": "npx synpress open -cf tests/e2e/synpress.json"
     }
   }
   ```

3. If you would like to use custom paths for your tests and configs and modify it for your needs. Then you can direct synpress to use it with `--configFile <pathToConfigFile>` or `-cf <pathToConfigFile>` flag.

   Example `synpress.json`:

   ```json
   {
     "baseUrl": "http://localhost:3000",
     "userAgent": "synpress",
     "retries": { "runMode": 0, "openMode": 0 },
     "integrationFolder": "tests/e2e/specs",
     "screenshotsFolder": "tests/e2e/screenshots",
     "videosFolder": "tests/e2e/videos",
     "chromeWebSecurity": true,
     "viewportWidth": 1366,
     "viewportHeight": 768,
     "component": {
       "componentFolder": ".",
       "testFiles": "**/*spec.{js,jsx,ts,tsx}"
     },
     "env": {
       "coverage": false
     },
     "defaultCommandTimeout": 30000,
     "pageLoadTimeout": 30000,
     "requestTimeout": 30000
   }
   ```

4. Create `.eslintrc.js` and if you write your spec files in TypeScript `tsconfig.json`

   👷 Example setup for eslint and tsconfig:

   1. Create `.eslintrc.js` inside your tests folder (`/project_dir/tests/e2e`):

      ```js
      const path = require('path');
      const synpressPath = path.join(
        process.cwd(),
        '/node_modules/@synthetixio/synpress',
      );

      module.exports = {
        extends: `${synpressPath}/.eslintrc.js`,
      };
      ```

   2. Create `tsconfig.json` inside your tests folder (`/project_dir/tests/e2e`):

      ```json
      {
        "compilerOptions": {
          "allowJs": true,
          "baseUrl": "../../node_modules",
          "types": [
            "cypress",
            "@types/puppeteer-core",
            "@synthetixio/synpress/support",
            "cypress-wait-until",
            "@testing-library/cypress"
          ],
          "outDir": "./output"
        },
        "include": ["**/*.*"]
      }
      ```

5. Write your e2e test spec files

   - you can run single tests with `npy synpress run --spec <specFilePath> -ne -cf synpress.json`
   - or you can run all tests with `npy synpress run -ne -cf synpress.json` or `npm run test`

6. To define custom commands, you can use the `support/commands.js` file, but you have to import it in each spec file, where you want to use the custom commands.

7. You're done! 🎉

## ⚡ Important

Synpress doesn't seem to communicate with metamask properly if `"chromeWebSecurity": false` flag is set. More about it [here](https://github.com/Synthetixio/synpress/issues/17).

Tests work only in headed mode because extensions are not supported in headless mode in [puppeteer](https://github.com/puppeteer/puppeteer/issues/659) and [Cypress](https://docs.cypress.io/api/plugins/browser-launch-api.html#Add-browser-extensions). It's intended to be used in conjunction with `xvfb` on CI.

There is a global [`before()`](https://github.com/synthetixio/synpress/blob/master/support/index.js#L25) which runs metamask setup before all tests:

- passes welcome page
- imports wallet
- changes network (defaults to `kovan`) or creates custom network and changes to it (depending on your setup)
- switches back to Cypress window and starts testing

It requires environmental variable called `SECRET_WORDS` to be present in following format => `'word1, word2, etc..'` or private key in an environmental variable called `PRIVATE_KEY`.

To change default network (`kovan`), you can use `NETWORK_NAME` environmental variable, for example: `NETWORK_NAME=rinkeby`.

Available choices are: `mainnet`, `ropsten`, `kovan`, `rinkeby`, `goerli` and `localhost`.

To create and switch to custom network at metamask setup phase, use these:

1. `NETWORK_NAME` => ex: `synthetix`
2. `RPC_URL` => ex: `https://synthetix-node.io`
3. `CHAIN_ID` => ex: `123`
4. `SYMBOL` (optional) => ex: `SNX`
5. `BLOCK_EXPLORER` (optional) => ex: `https://synthetix-explorer.io`
6. `IS_TESTNET` (optional) => ex: `false`

Metamask version is hardcoded and frequently updated under supervision to avoid a case when e2e tests break because of CSS classes changes in new version, so all you need is to keep synpress updated in your project. However, you can still override metamask with `METAMASK_VERSION` environmental variable, for example: `METAMASK_VERSION=9.3.0` or `METAMASK_VERSION=latest`.

If you don't want to use environmental variables, you can modify [`setupMetamask()`](https://github.com/synthetixio/synpress/blob/master/support/index.js#L26) to following:

`setupMetamask(secretWordsOrPrivateKey, network, password)`, for example: `setupMetamask('word1, word2, etc..', 'mainnet', 'password')`.

You can also add and switch to custom network by passing an `object` instead of `string` inside `setupMetamask(secretWordsOrPrivateKey, network, password)` function for `network` parameter.

If you want to use Etherscan API helpers, you will have to provide Etherscan API key using `ETHERSCAN_KEY` enironmental variable.

To fail a test if there are any browser console errors, set `FAIL_ON_ERROR` to `1` or `true`.

Automatic waiting for XHR requests to finish before tests start can be turned off with `CYPRESS_SKIP_RESOURCES_WAIT` environmental variable, set it to `1` or `true`.

If you want to skip metamask extension installation or metamask setup, you can use `SKIP_METAMASK_INSTALL` and `SKIP_METAMASK_SETUP` separately. Both variables accept `1` or `true`.

## 🧪 Usage

- `synpress run` to run tests
- `synpress open` to open Cypress UI (may be bugged in some cases because it doesn't clear metamask state before each e2e test, please use `synpress run`)

Command line interface (`synpress help`):

```text
Usage: synpress run [options]

launch tests

Options:
  -b, --browser <name>               run on specified browser (default: "chrome")
  -c, --config <config>              set configuration values, separate multiple values with a comma
  -cf, --configFile <path>          specify a path to a JSON file where configuration values are set
  -e, --env <env=val>                set environment variables, separate multiple values with comma
  -s, --spec <path or glob>          run only provided spec files
  -ne, --noExit                     keep runner open after tests finish
  -pr, --project <path>              run with specific project path
  -q, --quiet                        only test runner output in console
  -r, --reporter <reporter>          specify mocha reporter
  -ro, --reporterOptions <options>  specify mocha reporter options, separate multiple values with comma
  -r, --record                       [dashboard] record video of tests running after setting up your project to record
  -k, --key <key>                    [dashboard] set record key
  -p, --parallel                     [dashboard] run recorded specs in parallel across multiple machines
  -g, --group <name>                 [dashboard] group recorded tests together under a single run
  -t, --tag <name>                   [dashboard] add tags to dashboard for test run
  -h, --help                         display help for command
```

```text
Usage: synpress open [options]

launch test runner UI

Options:
  -cf, --configFile <path>  specify a path to a JSON file where configuration values are set
  -h, --help                display help for command
```

## 🚢 Release process

1. Create PR from `dev` branch to `master` branch
2. Merge it (new `-beta` version is automatically released)
3. Run GitHub Action workflow named [Release CI](https://github.com/Synthetixio/synpress/actions/workflows/release.yml) with `patch|minor|major` depending on your needs to promote your build.

Alternatively, instead of running GitHub Action for release, you can move on with manual release process:

1. Switch to `master` branch and pull latest changes
2. Run `npm run release:patch/minor/major` command
3. Keep `dev` branch up to date with `master`

Above actions will lead to:

- New npm node module release
- New GitHub packages node module release
- New GitHub release (tagged) created with changelog from commit messages

## 📝
