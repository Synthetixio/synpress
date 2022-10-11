[![npm version](https://badge.fury.io/js/%40synthetixio%2Fsynpress.svg)](https://badge.fury.io/js/%40synthetixio%2Fsynpress)
![Synpress CI](https://github.com/Synthetixio/synpress/workflows/Synpress%20CI/badge.svg?branch=master)
[![CodeQL](https://github.com/Synthetixio/synpress/actions/workflows/codeql.yml/badge.svg?branch=master)](https://github.com/Synthetixio/synpress/actions/workflows/codeql.yml)
[![Release CI](https://github.com/Synthetixio/synpress/actions/workflows/release.yml/badge.svg?branch=master)](https://github.com/Synthetixio/synpress/actions/workflows/release.yml)
[![Discord](https://img.shields.io/discord/413890591840272394.svg?color=768AD4&label=discord&logo=https%3A%2F%2Fdiscordapp.com%2Fassets%2F8c9701b98ad4372b58f13fd9f65f966e.svg)](https://discordapp.com/channels/413890591840272394/)
[![Twitter Follow](https://img.shields.io/twitter/follow/synthetix_io.svg?label=synthetix_io&style=social)](https://twitter.com/synthetix_io)

#

<p align="center">
  <img src="https://i.imgur.com/Bg8Rch6.png" />
</p>

#

[Synpress](https://github.com/Synthetixio/synpress) is e2e testing framework
based on [Cypress.io](https://github.com/cypress-io/cypress) and
[playwright](https://playwright.dev/) with support for
[metamask](https://metamask.io/).

Synpress makes sure to always use latest version of metamask and puts a lot of
effort to make sure that dapp tests are stable and trustful.

It also provides an easy way to use and access metamask straight from your e2e
tests with all features of cypress and playwright.

Usage examples:

- [synpress](https://github.com/Synthetixio/synpress/tree/dev/tests/e2e)
- [kwenta](https://github.com/kwenta/kwenta/tree/dev/tests/e2e)
- [staking](https://github.com/Synthetixio/staking/tree/dev/tests/e2e)

For additional custom commands and their examples,
[check here](https://github.com/synthetixio/synpress/blob/dev/support/index.d.ts).

To see in which direction Synpress is headed to, take a look at
[planning board](https://github.com/orgs/Synthetixio/projects/14).

## Features

- added support for metamask 🦊
- supports headless mode thanks to
  [docker 🐳](https://github.com/Synthetixio/synpress#-using-with-docker)
  - recommended for local development and
    [CI](https://github.com/Synthetixio/synpress#ci-tips--tricks)
  - includes VNC and [noVNC](https://novnc.com/info.html)
  - integrated video recording 🎥 (full screen)
  - exposes noVNC with [ngrok](https://ngrok.com/) (optional)
- easy to debug 🐛
  - improved error handling
  - supports [cypress](https://docs.cypress.io/guides/guides/debugging) and
    [playwright](https://playwright.dev/docs/debug) debuggers
  - noVNC allows for interactions through browser 🌐
  - debug remote machines on CI with ngrok
- blazingly-fast ⚡
- extensible ⚙️ (add own custom commands and plugins)
- can be used in existing
  [cypress setup](https://github.com/Synthetixio/synpress/issues/346#issuecomment-1060506096)
- supports dotenv
  - loads all env vars from your `.env` file automatically (from project root
    folder)
- ability to use latest metamask or lock it's version to avoid unexpected
  failures related to metamask updates
- supports multi-lang of metamask, it doesn't depend on any labels
- synpress is
  [fully tested](https://github.com/Synthetixio/synpress/tree/dev/tests/e2e/specs)
- waits for XHR requests, navigations and animations automatically
- ability to fail test run if there are any browser console errors found
- types support for all additional custom commands
- the best possible options set up in place to avoid flakiness
- etherscan API helpers in place which for ex. allows to compare your
  transaction results with etherscan and check tx status
- synthetix helpers in place which allows to interact with synthetix protocol
  programmatically
- supports codespaces
  - run your tests in docker
  - get your feedback remotely thanks to ngrok
  - use mpeg-4 preview plugin to watch videos from inside codespaces :) ...

## 👷 Example setup for eslint and tsconfig

Project structure:

```text
project_dir
└── src
└── tests
    └── e2e
        └── .eslintrc.js
        └── support.js
        └── tsconfig.json
        └── specs
            └── example-spec.js
        └── pages
            └── example-page.js
```

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

2. Create `support.js` inside your tests folder (`/project_dir/tests/e2e`):

```js
import '@synthetixio/synpress/support/index';
```

_^ hint: you can also use this file to extend synpress - add custom commands,
and more.._

3. Create `tsconfig.json` inside your tests folder (`/project_dir/tests/e2e`):

```json
{
  "compilerOptions": {
    "allowJs": true,
    "baseUrl": "../../node_modules",
    "types": [
      "cypress",
      "@synthetixio/synpress/support",
      "cypress-wait-until",
      "@testing-library/cypress"
    ],
    "outDir": "./output"
  },
  "include": ["**/*.*"]
}
```

4. You're done! 🎉

To change specific values in default config, you can use `--config` flag. For
example, to change path for `support.js` file, you can use
`synpress run --config "supportFile=__tests__/e2e/supportFile.js"`

If you would like to use custom paths for your tests and configs, you should
[mirror (full) default synpress config](https://github.com/Synthetixio/synpress/blob/dev/synpress.config.js)
and then modify it for your needs. Then you can direct synpress to use it with
`--configFile` flag.

For example: `synpress run --configFile __tests__/e2e/customConfig.config.js`

## ⚡ Important

Synpress doesn't seem to communicate with metamask properly if
`"chromeWebSecurity": false` flag is set. More about it
[here](https://github.com/Synthetixio/synpress/issues/17).

Tests work only in non-headless mode because extensions are not supported in
headless mode in [playwright](https://playwright.dev/docs/chrome-extensions) and
[Cypress](https://docs.cypress.io/api/plugins/browser-launch-api.html#Add-browser-extensions).
As a workaround, use provided docker 🐳 containers. They solve this issue.

There is a global
[`before()`](https://github.com/synthetixio/synpress/blob/dev/support/index.js#L27)
which runs metamask setup before all tests:

- passes welcome page
- imports wallet
- changes network (defaults to `kovan`) or creates custom network and changes to
  it (depending on your setup)
- switches back to Cypress window and starts testing

It requires environmental variable called `SECRET_WORDS` to be present in
following format => `'word1, word2, etc..'` or private key in an environmental
variable called `PRIVATE_KEY`.

To change default network (`kovan`), you can use `NETWORK_NAME` environmental
variable, for example: `NETWORK_NAME=rinkeby`.

Available choices are: `mainnet`, `ropsten`, `kovan`, `rinkeby`, `goerli` and
`localhost`.

To create and switch to custom network at metamask setup phase, use these:

1. `NETWORK_NAME` => ex: `synthetix`
2. `RPC_URL` => ex: `https://synthetix-node.io`
3. `CHAIN_ID` => ex: `123`
4. `SYMBOL` (optional) => ex: `SNX`
5. `BLOCK_EXPLORER` (optional) => ex: `https://synthetix-explorer.io`
6. `IS_TESTNET` (optional) => ex: `false`

Metamask version is hardcoded and frequently updated under supervision to avoid
a case when e2e tests break because of CSS classes changes in new version, so
all you need is to keep synpress updated in your project. However, you can still
override metamask with `METAMASK_VERSION` environmental variable, for example:
`METAMASK_VERSION=9.3.0` or `METAMASK_VERSION=latest`.

If you don't want to use environmental variables, you can modify
[`setupMetamask()`](https://github.com/synthetixio/synpress/blob/dev/support/index.js#L29)
to following:

`setupMetamask(secretWordsOrPrivateKey, network, password)`, for example:
`setupMetamask('word1, word2, etc..', 'mainnet', 'password')`.

You can also add and switch to custom network by passing an `object` instead of
`string` inside `setupMetamask(secretWordsOrPrivateKey, network, password)`
function for `network` parameter.

If you want to use Etherscan API helpers, you will have to provide Etherscan API
key using `ETHERSCAN_KEY` environmental variable.

To fail a test if there are any browser console errors, set `FAIL_ON_ERROR` to
`1` or `true`.

Automatic waiting for XHR requests to finish before tests start can be turned on
with `CYPRESS_RESOURCES_WAIT` environmental variable, set it to `1` or `true`.

If you want to skip metamask extension installation or metamask setup, you can
use `SKIP_METAMASK_INSTALL` and `SKIP_METAMASK_SETUP` separately. Both variables
accept `1` or `true`.

Synpress is blazingly-fast ⚡ by default! If you want to change that, you can
use `STABLE_MODE=true` (which will introduce delays only between main actions,
300ms by default) / `STABLE_MODE=<value>` or `SLOW_MODE=true` (which will
introduce delay between every action, 50ms by default) / `SLOW_MODE=<value>`.

`DEBUG=synpress:*` is very useful while debugging your tests. It enables following
features:

- improved logging
- [cypress debugger](https://docs.cypress.io/guides/guides/debugging)
- [playwright debugger](https://playwright.dev/docs/debug)
- slow down tests

## 🐳 Using with Docker

Dreaming about "headless" mode? Here comes a rescue 🚑!

Docker is awesome for CI and local development. Give it a try.

### Requirements

- [docker](https://www.docker.com/)
- [docker-compose](https://docs.docker.com/compose/install/)

### Some neat features

- based on [docker-e2e](https://github.com/Synthetixio/docker-e2e) ❤
- full screen video recording 🎥 (together with metamask extension)
- VNC & noVNC support 🖥️ (very easy to debug with browser)
  - local: http://localhost:8080/vnc.html?autoconnect=true
- ngrok 🔌 integration (exposes noVNC for everyone)
  - remote: https://<random>.ngrok.io/vnc.html?autoconnect=true (check logs for
    url)

### How to use

1. `git clone git@github.com:Synthetixio/synpress.git`
2. `cd synpress`
3. (optional) Fill env vars inside `.env` file
4. (without ngrok) `docker-compose up --build --exit-code-from synpress`
   - (with ngrok)
     `docker-compose --profile ngrok up --build --exit-code-from synpress` or
     `./start-tests.sh`

All examples of setup are present in this repository. Just take a look around.

**Warning: M2 is not supported with docker.** As a workaround - you can use
codespaces, they're fully supported! :)

## CI tips & tricks

- use [docker-e2e](https://github.com/Synthetixio/docker-e2e)
- synpress is tested and should work on all resolutions, starting from 800x600
- take a look at this
  [example config](https://github.com/Synthetixio/synpress/blob/dev/.github/workflows/audit_and_lint.yml#L84)

## 🧪 Usage

- `synpress run` to run tests
- `synpress open` to open Cypress UI (may be bugged in some cases because it
  doesn't clear metamask state before each e2e test, please use `synpress run`)

Command line interface (`synpress help`):

```text
Usage: synpress run [options]

launch tests

Options:
  -b, --browser <name>               run on specified browser (default: "chrome")
  -c, --config <config>              set configuration values, separate multiple values with a comma
  -cf, --configFile <path>          specify a path to *.js file where configuration values are set
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
  -cf, --configFile <path>  specify a path to *.js file where configuration values are set
  -h, --help                display help for command
```

## 🚢 Release process

1. Create PR from `dev` branch to `master` branch
2. Merge it (new `-beta` version is automatically released)
3. Run GitHub Action workflow named
   [Release CI](https://github.com/Synthetixio/synpress/actions/workflows/release.yml)
   with `patch|minor|major` depending on your needs to promote your build.

Alternatively, instead of running GitHub Action for release, you can move on
with manual release process:

1. Switch to `master` branch and pull latest changes
2. Run `yarn release:patch/minor/major` command
3. Keep `dev` branch up to date with `master`

Above actions will lead to:

- New npm node module release
- New GitHub packages node module release
- New GitHub release (tagged) created with changelog from commit messages

## 📃 More resources

- https://gitcoin.co/grants/5699/synpress-web3-enabled-e2e-testing-tool
- https://medium.com/andamp/how-to-setup-synpress-for-wen3-dapp-frontend-test-automation-with-metamask-73396896684a
- https://medium.com/andamp/extending-synpress-with-additional-metamask-commands-fdc6b35a2ffc
- https://medium.com/coinmonks/test-e2e-login-to-dapp-with-metamask-with-synpress-5248dd1f17c1
