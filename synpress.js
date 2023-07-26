#!/usr/bin/env node
const log = require('debug')('synpress:cli');
const program = require('commander');
const { run, open } = require('./launcher');
const { version } = require('./package.json');

if (process.env.DEBUG && process.env.DEBUG.includes('synpress')) {
  log('DEBUG mode is enabled');
  process.env.PWDEBUG = 1;
  if (!process.env.STABLE_MODE) {
    log('Enabling stable mode');
    process.env.STABLE_MODE = true;
  }
}

if (process.env.SYNPRESS_LOCAL_TEST) {
  log('Loading .env config file from root folder');
  require('dotenv').config();
} else {
  const envFiles = ['.env', '.env.e2e', '.env.local', '.env.dev'];
  envFiles.forEach(envFile => {
    log(
      `Loading ${envFile} config file from first matching config file - root dir, ancestor or home dir`,
    );
    require('dotenv').config({ path: require('find-config')(envFile) });
  });
}

// if user skips metamask install or setup
if (!process.env.SKIP_METAMASK_INSTALL && !process.env.SKIP_METAMASK_SETUP) {
  // we don't want to check for presence of SECRET_WORDS or PRIVATE_KEY
  if (!process.env.SECRET_WORDS && !process.env.PRIVATE_KEY) {
    throw new Error(
      'Please provide SECRET_WORDS or PRIVATE_KEY environment variable',
    );
  }
} else {
  log(
    'Skipping check for SECRET_WORDS and PRIVATE_KEY as SKIP_METAMASK_INSTALL or SKIP_METAMASK_SETUP is set',
  );
}

if (process.env.RPC_URL || process.env.CHAIN_ID || process.env.SYMBOL) {
  if (!process.env.RPC_URL) {
    throw new Error('Please provide RPC_URL environment variable');
  } else if (!process.env.CHAIN_ID) {
    throw new Error('Please provide CHAIN_ID environment variable');
  } else if (!process.env.SYMBOL) {
    throw new Error('Please provide SYMBOL environment variable');
  }

  if (
    !process.env.RPC_URL.startsWith('http://') && //DevSkim: ignore DS137138
    !process.env.RPC_URL.startsWith('https://')
  ) {
    throw new Error(
      'RPC_URL environment variable should start with "http://" or "https://"', //DevSkim: ignore DS137138
    );
  }

  if (
    process.env.BLOCK_EXPLORER &&
    !process.env.BLOCK_EXPLORER.startsWith('http://') && //DevSkim: ignore DS137138
    !process.env.BLOCK_EXPLORER.startsWith('https://')
  ) {
    throw new Error(
      'BLOCK_EXPLORER environment variable should start with "http://" or "https://"', //DevSkim: ignore DS137138
    );
  }
}

program.version(version, '-v, --version');

program
  .command('run')
  .requiredOption('-b, --browser <name>', 'run on specified browser', 'chrome')
  .option('-h, --headless', 'run tests in headless mode')
  .option('-cmp, --component', 'run component tests')
  .option(
    '-c, --config <config>',
    'set configuration values, separate multiple values with a comma',
  )
  .option(
    '-cf, --configFile <path>',
    'specify a path to a JSON file where configuration values are set',
  )
  .option('--e2e', 'run e2e tests (already set as default)')
  .option(
    '-e, --env <env=val>',
    'set environment variables, separate multiple values with comma',
  )
  .option('-s, --spec <path or glob>', 'run only provided spec files')
  .option('-ne, --noExit', 'keep runner open after tests finish')
  .option('-pt, --port <value>', 'override default port')
  .option('-pr, --project <path>', 'run with specific project path')
  .option('-q, --quiet', 'only test runner output in console')
  .option('-r, --reporter <reporter>', 'specify mocha reporter')
  .option(
    '-ro, --reporterOptions <options>',
    'specify mocha reporter options, separate multiple values with comma',
  )
  // dashboard
  .option('-cid, --ciBuildId', '[dashboard] add custom ci build id to the run')
  .option(
    '-r, --record',
    '[dashboard] record video of tests running after setting up your project to record',
  )
  .option('-k, --key <key>', '[dashboard] set record key')
  .option(
    '-p, --parallel',
    '[dashboard] run recorded specs in parallel across multiple machines',
  )
  .option(
    '-g, --group [name]',
    '[dashboard] group recorded tests together under a single run',
  )
  .option('-t, --tag <name>', '[dashboard] add tags to dashboard for test run')
  .description('launch tests')
  .action(options => {
    run({
      browser: options.browser,
      headless: options.headless,
      component: options.component,
      config: options.config,
      configFile: options.configFile,
      e2e: options.e2e,
      env: options.env,
      spec: options.spec,
      noExit: options.noExit,
      port: options.port,
      project: options.project,
      quiet: options.quiet,
      reporter: options.reporter,
      reporterOptions: options.reporterOptions,
      ciBuildId: options.ciBuildId,
      record: options.record,
      key: options.key,
      parallel: options.parallel,
      group: options.group,
      tag: options.tag,
    });
  });

program
  .command('open')
  .description('launch test runner UI')
  .option(
    '-cf, --configFile <path>',
    'specify a path to a JSON file where configuration values are set',
  )
  .action(options => {
    open({
      configFile: options.configFile,
    });
  });

program.parse(process.argv);
