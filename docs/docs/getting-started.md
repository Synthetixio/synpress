# Getting Started

::: warning
This documentation refers to Synpress v4 and it is still in progress.

For Synpress v3 documentation, please refer [here](https://github.com/Synthetixio/synpress).
:::

## Overview

Synpress is an E2E (End-to-End) testing library for Web3 dapps. It can be used with
both: [Playwright](https://playwright.dev/) and [Cypress](https://www.cypress.io/).
Synpress is built with developer experience, stability, and performance in mind:

- **Developer Experience**: Type safety, simple API, comprehensive documentation, support for both Playwright and
  Cypress and all of their its features.
- **Stability**: Complete test coverage, bullet-proof wallet integration API.
- **Performance**: Optimized for speed, parallelization, and fast feedback loops.

Check out the [Why Synpress](./introduction) section to learn more about the project's rationale.

## Installation

::: code-group

```bash [pnpm]
pnpm add @synthetixio/synpress@latest
```

```bash [npm]
npm i @synthetixio/synpress@latest
```

```bash [yarn]
yarn add @synthetixio/synpress@latest
```

:::

::: tip NOTE
Synpress is now an ESM-only package. Don't use `require()` to import it, and make sure your nearest `package.json`
contains `"type": "module"`.
:::

## Next Steps

For more information on what to do next, check out the following topics:

- [**TypeScript**](./typescript) - Learn how to set up TypeScript with Synpress.
- [**Playwright**](./setupPlaywright) - Learn how to set up Playwright with Synpress.
- [**Cypress**](./setupCypress) - Learn how to set up Cypress with Synpress.
