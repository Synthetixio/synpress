[![npm version](https://badge.fury.io/js/%40synthetixio%2Fsynpress.svg)](https://badge.fury.io/js/%40synthetixio%2Fsynpress)
![Synpress CI](https://github.com/Synthetixio/synpress/workflows/Synpress%20CI/badge.svg?branch=master)
[![Discord](https://img.shields.io/discord/413890591840272394.svg?color=768AD4&label=discord&logo=https%3A%2F%2Fdiscordapp.com%2Fassets%2F8c9701b98ad4372b58f13fd9f65f966e.svg)](https://discordapp.com/channels/413890591840272394/)
[![Twitter Follow](https://img.shields.io/twitter/follow/synthetix_io.svg?label=synthetix_io&style=social)](https://twitter.com/synthetix_io)

# ⚙️ Synpress

[Synpress](https://github.com/Synthetixio/synpress) is an wrapper around [Cypress.io](https://github.com/cypress-io/cypress) with [metamask](https://metamask.io/) support thanks to [puppeteer](https://github.com/puppeteer/puppeteer).

Synpress makes sure to always use latest version of metamask before tests are ran.

It also provides an easy way to use metamask straight from your e2e tests.

Feel free to take a look at [kwenta](https://github.com/Synthetixio/kwenta/tree/master/tests/e2e) repository for examples of usage.

For additional custom commands and their examples, [check here](https://github.com/synthetixio/synpress/blob/master/support/index.d.ts).

## 👷 Example setup for eslint and tsconfig

Project structure:

```text
project_dir
└── src
└── tests
    └── e2e
        └── .eslintrc.js
        └── tsconfig.json
        └── specs
            └── example-spec.js
        └── pages
            └── example-page.js
```

1. Create `.eslintrc.js` inside your tests folder (`/project_dir/tests/e2e`):

```js
const path = require('path');
const synpressPath = path.join(process.cwd(), '/node_modules/@synthetixio/synpress');

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
        "types": ["cypress", "@types/puppeteer-core", "@synthetixio/synpress/support", "cypress-wait-until", "@testing-library/cypress"],
        "outDir": "./output"
    },
    "include": ["**/*.*"]
}
```

3. You're done! 🎉

## ⚡ Important

Synpress doesn't seem to communicate with metamask properly if `"chromeWebSecurity": false` flag is set. More about it [here](https://github.com/Synthetixio/synpress/issues/17).

Tests work only in headed mode because extensions are not supported in headless mode in [puppeteer](https://github.com/puppeteer/puppeteer/issues/659) and [Cypress](https://docs.cypress.io/api/plugins/browser-launch-api.html#Add-browser-extensions). It's intended to be used in conjunction with `xvfb` on CI.

There is a global [`before()`](https://github.com/synthetixio/synpress/blob/master/support/index.js#L25) which runs metamask setup before all tests:

- passes welcome page
- imports wallet
- changes network (defaults to `rinkeby`)
- switches back to Cypress window and starts testing

It requires environmental variable called `SECRET_WORDS` to be present in following format => `'word1, word2, etc..'`.

If you want to customize it, instead of using environmental variable, you can modify [`setupMetamask()`](https://github.com/synthetixio/synpress/blob/master/support/index.js#L26) to following:

`setupMetamask(secretWords, network, password)`, for example: `setupMetamask('word1, word2, etc..', 'mainnet', 'password')`.

## 🧪 Usage

- `synpress run` to run tests
- `synpress open` to open Cypress UI

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
2. Merge it
3. Switch to `master` branch and pull latest changes
4. Run `npm run release:patch/minor/major` command
5. Keep `dev` branch up to date with `master`

Above actions will lead to:

- New npm node module release
- New GitHub packages node module release
- New GitHub release (tagged) created with changelog from commit messages
