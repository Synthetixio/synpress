<h1 align="center">
    Synpress: New Dawn
    <br>
    <small>⭐ Example Project ⭐</small>
</h1>

# 📖 Intro

The New Dawn version of Synpress differs in one major way from all previous versions and all other similar Web3 tools:

- We set up the browser only once, and we cache it. Thanks to this, tests not only run faster, but it also allows to use
  **ALL FEATURES** of [Playwright](https://playwright.dev/), such as parallel testing 🚀

You can define how a browser should be set up yourself. You can find setup file examples [here](test/playwright/wallet-setup).
All setup files must have the following naming structure: `*.setup.{js,ts}`.

Once you define a setup file, you can build a cache with our CLI. By default, the cache is built in a headed mode and
utilizes the setup files from `test/wallet-setup` directory.
Try running it with the `--help` flag to see all available configuration options.

Here's how to use it:

```bash
# Build cache in a headed mode:
synpress

# Build cache in a headless mode:
synpress --headless
```

# 🧑‍💻 Usage

1. Install dependencies:

```bash
pnpm install 
```

2. Start MetaMask Test Dapp:

```bash
pnpm run serve:test-dapp
```

3. Install Playwright:

```bash
pnpm exec playwright install  
```

*3a. If you do not have Anvil installed, go to
the [Foundry installation guide](https://book.getfoundry.sh/getting-started/installation#installation)* and follow the
instructions.

4. Build cache with our CLI by using a script:

```bash
# You can either build cache in a headed mode:
pnpm run build:cache

# Or in a headless mode:
pnpm run build:cache:headless
```

5. Run Playwright tests as you would normally do:

```bash
# Use one of our scripts:
pnpm run test:playwright:headful
pnpm run test:playwright:headless
pnpm run test:playwright:headless:ui

# Or use Playwright directly:
playwright test
HEADLESS=true playwright test
HEADLESS=true playwright test --ui
```

### ⚠️ Important note ⚠️

Currently, tests are triggered in a headed mode by default. Add `HEADLESS=true` to run them in a headless mode.

This behavior will change soon! 🫡

# 🤔 Still want more?

If you need more than this example project, check out our tests for MetaMask [here](../../wallets/metamask/test/e2e).
