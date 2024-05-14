# Getting Started

::: warning
This documentation refers to the **alpha** release of Synpress v4. The API is subject to change.

For Synpress v3 documentation, please refer [here](https://github.com/Synthetixio/synpress).
:::

## Overview

::: info
Support for [Cypress](https://www.cypress.io/) is coming soon.
:::

Synpress is an E2E (End-to-End) testing library for Web3 dapps. It can be used with ~~
both~~ [Playwright](https://playwright.dev/) ~~and [Cypress](https://www.cypress.io/)~~.
Synpress is built with developer experience, stability, and performance in mind:

- **Developer Experience**: Type safety, simple API, comprehensive documentation, support for ~~both~~ Playwright ~~and
  Cypress~~ and all of ~~their~~ its features.
- **Stability**: Complete test coverage, bullet-proof wallet integration API.
- **Performance**: Optimized for speed, parallelization, and fast feedback loops.

Check out the [Why Synpress](./introduction) section to learn more about the project's rationale.

## Installation

::: code-group

```bash [pnpm]
pnpm add @synthetixio/synpress@alpha
```

```bash [npm]
npm i @synthetixio/synpress@alpha
```

```bash [yarn]
yarn add @synthetixio/synpress@alpha
```

:::

::: tip NOTE
Synpress is now an ESM-only package. Don't use `require()` to import it, and make sure your nearest `package.json`
contains `"type": "module"`.
:::

## Setup

1. Import `testWithSynpress` from `@synthetixio/synpress` in your test files to get started.

```javascript
import { testWithSynpress } from "@synthetixio/synpress";
```

2. Inject the wallet fixtures you want to use (EthereumWalletMock or MetaMask available at the moment).

```javascript
import { ethereumWalletMockFixtures } from "@synthetixio/synpress";

const test = testWithSynpress(ethereumWalletMockFixtures);

const { expect } = test;
```

or

```javascript
import { metaMaskFixtures } from "@synthetixio/synpress";

import basicSetup from "../wallet-setup/basic.setup";

const test = testWithSynpress(metaMaskFixtures(basicSetup));

const { expect } = test;
```

3a. In case you use MetaMask, you also have to setup the `wallet-cache` feature to generate cache. Check out
the [Wallet Cache](./guides/wallet-cache.md) guide for more information.

## Next Steps

For more information on what to do next, check out the following topics:

- [**TypeScript**](./typescript) - Learn how to set up TypeScript with Synpress.
- [**Wallet Cache**](./guides/wallet-cache) - Learn what's a wallet cache and how to use it.
