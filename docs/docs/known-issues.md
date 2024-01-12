# Known Issues

## Playwright

The good news is in all of our testing, we haven't encountered any significant issues with Playwright! However, we're aware of the following problems:

### Blank MetaMask previews in traces {#my-anchor}

When using Playwright UI mode or the HTML reporter, all previews of the MetaMask tab/popup traces are blank. This is due to MetaMask's LavaMoat security policy, and while we find it extremely annoying, we cannot do anything about it. 

If you require the previews for development purposes, your only option is to compile MetaMask yourself from the source code and disable the LavaMoat policies. Hit us up on Discord if you need help with that.

## MetaMask

### MetaMask is not working in headless mode on GitHub Actions CI

Due to a bug in MetaMask, it's impossible to run MetaMask in headless mode on GitHub Actions CI. This bug probably affects other CI providers, but we haven't tested it yet.
