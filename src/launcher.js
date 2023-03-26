const log = require('debug')('synpress:launcher');
const cypress = require('cypress');
const helpers = require('./helpers');
const synpressConfigPath = `${helpers.getSynpressPath()}/synpress.config.js`;
log(`Detected synpress config path is: ${synpressConfigPath}`);

process.env.CYPRESS_REMOTE_DEBUGGING_PORT = 9222;

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
        }));
  },
  async run(arguments_) {
    if (arguments_.configFile) {
      log(`Custom config file arg detected: ${arguments_.configFile}`);
      defaultArguments.push(`--config-file=${arguments_.configFile}`);
    } else {
      log('Using default config file');
      defaultArguments.push(`--config-file=${synpressConfigPath}`);
    }
    log(`Tests will run on ${arguments_.browser} browser`);
    defaultArguments.push(`--browser=${arguments_.browser}`);
    if (arguments_.headless) {
      log(`headless arg enabled`);
      process.env.HEADLESS_MODE = true;
    }
    if (arguments_.component) {
      log(`component arg enabled`);
      defaultArguments.push('--component');
    }
    if (arguments_.config) {
      log(`Custom config arg detected: ${arguments_.config}`);
      defaultArguments.push(`--config=${arguments_.config}`);
    }
    if (arguments_.e2e) {
      log(`e2e arg enabled`);
      defaultArguments.push('--e2e');
    }
    if (arguments_.env) {
      log(`Custom env arg detected: ${arguments_.env}`);
      defaultArguments.push(`--env=${arguments_.env}`);
    }
    if (arguments_.spec) {
      log(`Custom spec arg detected: ${arguments_.spec}`);
      defaultArguments.push(`--spec=${arguments_.spec}`);
    }
    if (arguments_.noExit) {
      log(`noExit arg enabled`);
      defaultArguments.push('--no-exit');
    }
    if (arguments_.port) {
      log(`Custom port arg detected: ${arguments_.port}`);
      defaultArguments.push(`--port=${arguments_.port}`);
    }
    if (arguments_.project) {
      log(`Custom project arg detected: ${arguments_.project}`);
      defaultArguments.push(`--project=${arguments_.project}`);
    }
    if (arguments_.quiet) {
      log(`quiet arg enabled`);
      defaultArguments.push('--quiet');
    }
    if (arguments_.reporter) {
      log(`Custom reporter arg detected: ${arguments_.reporter}`);
      defaultArguments.push(`--reporter=${arguments_.reporter}`);
    }
    if (arguments_.reporterOptions) {
      log(`Custom reporterOptions arg detected: ${arguments_.reporterOptions}`);
      defaultArguments.push(`--reporter-options=${arguments_.reporterOptions}`);
    }
    if (arguments_.ciBuildId) {
      log(`Custom ciBuildId arg detected: ${arguments_.ciBuildId}`);
      defaultArguments.push(`--ci-build-id=${arguments_.ciBuildId}`);
    }
    if (arguments_.record) {
      log(`record arg enabled`);
      defaultArguments.push('--record');
    }
    if (arguments_.key) {
      log(`Custom key arg detected: ${arguments_.key}`);
      defaultArguments.push(`--key=${arguments_.key}`);
    }
    if (arguments_.parallel) {
      log(`parallel arg enabled`);
      defaultArguments.push('--parallel');
    }
    if (arguments_.group) {
      log(`Custom group arg detected: ${arguments_.group}`);
      if (process.env.CYPRESS_GROUP) {
        log(
          `Custom group arg detected (from env var): ${process.env.CYPRESS_GROUP}`,
        );
        defaultArguments.push(`--group=${process.env.CYPRESS_GROUP}`);
      } else if (arguments_.group === true) {
        throw new Error('Please provide CYPRESS_GROUP environment variable');
      } else {
        defaultArguments.push(`--group=${arguments_.group}`);
      }
    }
    if (arguments_.tag) {
      log(`Custom tag arg detected: ${arguments_.tag}`);
      defaultArguments.push(`--tag=${arguments_.tag}`);
    }

    const runOptions = await cypress.cli.parseRunArguments(defaultArguments);
    log(
      `Running synpress with following options: ${JSON.stringify(runOptions)}`,
    );
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
