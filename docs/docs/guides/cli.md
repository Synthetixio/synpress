# CLI

Synpress comes with a built-in CLI tool. It's used to generate the cache based on the wallet setup files.

See the [Wallet Cache](./wallet-cache.md) section to learn how to build the cache.

## Flags

Here's the list of all available flags:

### `--help`

Shows the help message with a description of all flags.

### `--headless`

This flag makes the browser run in headless mode when building the cache. Useful for local development. 

By default, the browser runs in the headful mode.

### `--debug`

This flag is used to enable the debug mode. For more information, see the [Debugging Wallet Setups](./wallet-setup-debug.md) section.

### `--force`

This flag is used to force the cache to rebuild. By default, the cache can only be rebuilt if the wallet setup file's hash has changed. It's useful when there are issues with your wallet setup files.

Consider this example setup file:

```typescript
import { MetaMask, defineWalletSetup } from '@synthetixio/synpress'
import 'dotenv/config'

const SEED_PHRASE = process.env.SEED_PHRASE
const PASSWORD = process.env.WALLET_PASSWORD

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const extensionId = await getExtensionId(context, 'MetaMask')
  
  const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId)

  await metamask.importWallet(SEED_PHRASE)
})
```

If, for some reason, we forget to create the `.env` file with the environmental variables, the cache would still be built but with an incorrect state. To fix this cache, you'd have to create the `.env` file first and then rebuild it.

If you run the `synpress` command again after creating the correct `.env` file, you'd get a warning saying that this cache already exists and it won't be rebuilt. To overcome this, you'd want to add the `--force` flag to the command (`synpress --force`) to force the cache to rebuild.
