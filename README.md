# ⚙️ Block automation

This is Block's Wallet e2e testing suite.

This project is based on [Synpress](https://github.com/Synthetixio/synpress) and uses [cypress](https://github.com/cypress-io/cypress) and [puppeteer](https://github.com/puppeteer/puppeteer) to run commands on blank's extension.

## 👷 Project structure

```text
block-automation
└── src
└── tests
    └── e2e
        └── .eslintrc.js
        └── tsconfig.json
        └── specs
            └── example-spec.js
```

## ⚡ Important

Tests work only in headed mode because extensions are not supported in headless mode in [puppeteer](https://github.com/puppeteer/puppeteer/issues/659) and [Cypress](https://docs.cypress.io/api/plugins/browser-launch-api.html#Add-browser-extensions). It's intended to be used in conjunction with `xvfb` on CI.

There is a global [`before()`](https://github.com/block-wallet/e2e-test/blob/master/support/index.js#L25) which runs blank setup before all tests:

- passes welcome page
- imports wallet
- switches back to Cypress window and starts testing

It requires environmental variable called `SECRET_WORDS` to be present in following format => `'word1 word2 etc..'`.

In order to use Etherscan API helpers, you will have to provide Etherscan API key using `ETHERSCAN_KEY` enironmental variable.

To fail a test if there are any browser console errors, set `FAIL_ON_ERROR` to `1` or `true`.

Automatic waiting for XHR requests to finish before tests start can be turned off with `CYPRESS_SKIP_RESOURCES_WAIT` environmental variable, set it to `1` or `true`.

If you want to skip blank extension installation or metamask setup, you can use `SKIP_BLANK_INSTALL` and `SKIP_BLANK_SETUP` separately. Both variables accept `1` or `true`.

## 🧪 Usage

- `synpress run` to run tests
- `synpress open` to open Cypress UI (may be bugged in some cases because it doesn't clear blank state before each e2e test, please use `synpress run`)

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

## 👨‍💻 Development

### Install the dependencies

`yarn install`

### Run specs

`yarn run test:e2e`
