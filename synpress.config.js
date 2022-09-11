const { defineConfig } = require('cypress');
const setupNodeEvents = require('./plugins/index');
const helpers = require('./helpers');

const fixturesFolder = `${helpers.getSynpressPath()}/fixtures`;
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
  defaultCommandTimeout: process.env.SYNDEBUG ? 0 : 30000,
  pageLoadTimeout: process.env.SYNDEBUG ? 0 : 30000,
  requestTimeout: process.env.SYNDEBUG ? 0 : 30000,
  e2e: {
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
