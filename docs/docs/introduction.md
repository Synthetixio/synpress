# Why Synpress

## The Problem at Hand

In general, the state of Web3 tooling is excellent. There are numerous options for building frontends, backends, and smart contracts. 
However, when it comes to testing, the situation is also great, but only when it comes to testing backends and smart contracts.

Smart contract testing is in a superb state, thanks to tools like [Hardhat](https://hardhat.org/), [Foundry](https://github.com/foundry-rs/foundry), [Echidna](https://github.com/crytic/echidna), and many more.

Backend testing is in an even better state because you can utilize all the tools that are available in the Web2 world.

When it comes to frontend testing, the situation could be better. All Web2 tools used for frontend testing, are not that useful for Web3 dapps, because here we have to deal with stuff like wallets, and other Web3-specific things.

That's why, in 2020, we created Synpress, the first ever Web3-native E2E testing library.

## The Past, Present, and the Future

Over the years, Synpress has been used by many teams, and it has proven to be the go-to tool for testing Web3 dapps. However, it had its shortcomings.

When Synpress was created, the Web3 ecosystem was focused on Ethereum, and out of the few wallets out there, MetaMask was the most popular one. That's why Synpress was built with MetaMask in mind, and it was the only wallet that was supported.

In the last few years, the Web3 ecosystem has grown exponentially, and it's not just Ethereum anymore. There are many other blockchains and wallets.

With all of this in mind, we decided to rewrite Synpress from scratch. This huge step forward allowed us to redesign Synpress and ensure it is entirely future-proof. From now on, Synpress is both wallet and blockchain agnostic at its core.
Additionally, we've rewritten Synpress with a primary focus on **developer experience**, **stability**, and **performance**.

## Developer Experience

::: info
Support for [Cypress](https://www.cypress.io/) is coming soon.
:::

Synpress provides a simple yet powerful and fully typed API that is easy to use.

Our documentation is comprehensive, and we've made sure it covers everything you need to know about Synpress.

Synpress can be used with ~~two~~ leading E2E testing frameworks out there, i.e., both [Playwright](https://playwright.dev/) and [Cypress](https://www.cypress.io/), with support for all of their its features.

## Stability

Stability is one of the most important aspects of any testing library. If the library is not stable, it's not usable. 

We've made sure that Synpress is thoroughly tested and has complete test coverage.

## Performance

We aim to be the fastest Web3 testing library out there, with speeds comparable to the fastest Web2 testing libraries.

By speed, we not only mean the time it takes to run the tests but also the time it takes to write them.

We'd love to show you some fancy graphs, but we have yet to have any since we're still heavily working on the performance aspect of Synpress.

However, at this point in time, we can already say that Synpress is the fastest Web3 testing library out there. Check out [this tweet](https://x.com/0xDuckception/status/1741498318860042438) to see the differences we've seen in our own tests when running them with the new Synpress.
