const log = require('debug')('synpress:config');
const path = require('path');
const packageJson = require('./package.json');
const { defineConfig } = require('cypress');
const synpressPath = getSynpressPath();
log(`Detected synpress root path is: ${synpressPath}`);
const pluginsPath = `${synpressPath}/plugins/index`;
log(`Detected synpress plugin path is: ${pluginsPath}`);
const setupNodeEvents = require(pluginsPath);
const fixturesFolder = `${synpressPath}/fixtures`;
log(`Detected synpress fixtures path is: ${fixturesFolder}`);
const supportFile = 'tests/e2e/support.js';

module.exports = defineConfig({
  userAgent: 'synpress',
  retries: {
    runMode: process.env.CI ? 1 : 0,
    openMode: 0,
  },
  fixturesFolder,
  screenshotsFolder: 'tests/e2e/screenshots',
  videosFolder: 'tests/e2e/videos',
  chromeWebSecurity: true,
  viewportWidth: 1920,
  viewportHeight: 1080,
  env: {
    coverage: false,
  },
  defaultCommandTimeout: process.env.SYNDEBUG ? 9999999 : 30000,
  pageLoadTimeout: process.env.SYNDEBUG ? 9999999 : 30000,
  requestTimeout: process.env.SYNDEBUG ? 9999999 : 30000,
  e2e: {
    testIsolation: false,
    setupNodeEvents,
    baseUrl: 'http://localhost:3000',
    specPattern: 'tests/e2e/specs/**/*.{js,jsx,ts,tsx}',
    supportFile,
  },
  component: {
    setupNodeEvents,
    specPattern: './**/*spec.{js,jsx,ts,tsx}',
    supportFile,
  },
});

function getSynpressPath() {
  if (process.env.SYNPRESS_LOCAL_TEST) {
    return '.';
  } else {
    return path.dirname(require.resolve(packageJson.name));
  }
}
