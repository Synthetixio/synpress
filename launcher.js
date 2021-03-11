const cypress = require('cypress');
const helpers = require('./helpers');
const synpressConfigPath = `${helpers.getSynpressPath()}/synpress.json`;

process.env.CYPRESS_REMOTE_DEBUGGING_PORT = 9222;

const fixturesFolder = `${helpers.getSynpressPath()}/fixtures`;
const pluginsFile = `${helpers.getSynpressPath()}/plugins/index.js`;
const supportFile = `${helpers.getSynpressPath()}/support/index.js`;

const defaultConfig = `fixturesFolder=${fixturesFolder},pluginsFile=${pluginsFile},supportFile=${supportFile}`;

const defaultArguments = [
  'cypress',
  'run',
  '--headed', // needed for extensions like metamask to work
];

const launcher = {
  async open(arguments_) {
    await (arguments_.configFile
      ? cypress.open({ configFile: arguments_.configFile })
      : cypress.open({
          configFile: synpressConfigPath,
          config: defaultConfig,
        }));
  },
  async run(arguments_) {
    if (arguments_.configFile) {
      defaultArguments.push(`--config-file=${arguments_.configFile}`);
    } else {
      defaultArguments.push(`--config-file=${synpressConfigPath}`);
    }
    defaultArguments.push(`--browser=${arguments_.browser}`);
    if (arguments_.config) {
      defaultArguments.push(`--config=${defaultConfig},${arguments_.config}`);
    } else {
      defaultArguments.push(`--config=${defaultConfig}`);
    }
    if (arguments_.env) {
      defaultArguments.push(`--env=${arguments_.env}`);
    }
    if (arguments_.spec) {
      defaultArguments.push(`--spec=${arguments_.spec}`);
    }
    if (arguments_.noExit) {
      defaultArguments.push('--no-exit');
    }
    if (arguments_.project) {
      defaultArguments.push(`--project=${arguments_.project}`);
    }
    if (arguments_.quiet) {
      defaultArguments.push('--quiet');
    }
    if (arguments_.reporter) {
      defaultArguments.push(`--reporter=${arguments_.reporter}`);
    }
    if (arguments_.reporterOptions) {
      defaultArguments.push(`--reporter-options=${arguments_.reporterOptions}`);
    }
    if (arguments_.record) {
      defaultArguments.push('--record');
    }
    if (arguments_.key) {
      defaultArguments.push(`--key=${arguments_.key}`);
    }
    if (arguments_.parallel) {
      defaultArguments.push('--parallel');
    }
    if (arguments_.group) {
      defaultArguments.push(`--group=${arguments_.group}`);
    }
    if (arguments_.tag) {
      defaultArguments.push(`--tag=${arguments_.tag}`);
    }

    const runOptions = await cypress.cli.parseRunArguments(defaultArguments);
    const results = await cypress.run(runOptions);
    if (results.failures) {
      console.error('Failed to run Cypress');
      console.error(results.message);
      process.exit(results.failures);
    }

    console.log(
      'Cypress run results: %d total tests, %d passed, %d failed',
      results.totalTests,
      results.totalPassed,
      results.totalFailed,
    );

    process.exit(results.totalFailed);
  },
};

module.exports = launcher;
