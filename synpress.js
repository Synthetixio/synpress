#!/usr/bin/env node

const program = require('commander');
const { run, open } = require('./launcher');
const { version } = require('./package.json');
require('dotenv').config();

if (
  !process.env.SECRET_WORDS &&
  !process.env.SKIP_BLANK_SETUP &&
  !process.env.SKIP_BLANK_INSTALL
) {
  throw new Error(
    'Please provide SECRET_WORDS or PRIVATE_KEY environment variable',
  );
}

program.version(version, '-v, --version');

program
  .command('run')
  .requiredOption('-b, --browser <name>', 'run on specified browser', 'chrome')
  .option(
    '-c, --config <config>',
    'set configuration values, separate multiple values with a comma',
  )
  .option(
    '-cf, --configFile <path>',
    'specify a path to a JSON file where configuration values are set',
  )
  .option(
    '-e, --env <env=val>',
    'set environment variables, separate multiple values with comma',
  )
  .option('-s, --spec <path or glob>', 'run only provided spec files')
  .option('-ne, --noExit', 'keep runner open after tests finish')
  .option('-pr, --project <path>', 'run with specific project path')
  .option('-q, --quiet', 'only test runner output in console')
  .option('-r, --reporter <reporter>', 'specify mocha reporter')
  .option(
    '-ro, --reporterOptions <options>',
    'specify mocha reporter options, separate multiple values with comma',
  )
  // dashboard
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
    '-g, --group <name>',
    '[dashboard] group recorded tests together under a single run',
  )
  .option('-t, --tag <name>', '[dashboard] add tags to dashboard for test run')
  .description('launch tests')
  .action(options => {
    run({
      browser: options.browser,
      config: options.config,
      configFile: options.configFile,
      env: options.env,
      spec: options.spec,
      noExit: options.noExit,
      project: options.project,
      quiet: options.quiet,
      reporter: options.reporter,
      reporterOptions: options.reporterOptions,
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
