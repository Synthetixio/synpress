# Built-in Fixtures

Synpress has a few built-in Playwright fixtures for you to use in your tests that make it easier to interact with wallets and dapps. Here's the list:

## `extensionId`

Returns the extension ID of MetaMask. This is required by the `MetaMask` class to interact with the MetaMask extension.

## `metamaskPage`

Returns the `Page` object of the browser tab running the full-screen version of the MetaMask extension.

## `createAnvilNode`

This fixture allows you to create a new Anvil node on demand inside a test. It's a wrapper around the [AnvilJS](https://github.com/wevm/anvil.js). See the following usage example:

```typescript
test('create a new Anvil node', async ({ createAnvilNode }) => {
  const { anvil, rpcUrl, chainId } = await createAnvilNode({
    chainId: 1338
  })
})
```

It's that simple! After the test is finished, the Anvil node is automatically stopped.

You can specify any of the Anvil's options in the object you pass to the `createAnvilNode` function.

This function returns an object that contains three properties:
- `anvil` - the Anvil instance,
- `rpcUrl` - the RPC URL of the node,
- `chainId` - the chain ID of the node (useful when you're not passing `chainId` by hand to the `createAnvilNode` function).

For advanced usages, see our example project [here](https://github.com/Synthetixio/synpress/tree/new-dawn/examples/new-dawn).
