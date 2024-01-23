# Debugging Wallet Setups

By default, Synpress strips out all `console.log` and `debugger` statements from your wallet setup files when generating the cache.
At first glance, it seems impossible to debug your wallet setup files.

However, we've added a special `--debug` flag to our CLI, which will turn off the stripping of `console.log` and `debugger` statements.

Let's take the following wallet setup file and let's assume that it doesn't work:

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

You want to debug it because you can't figure out why it's not working.

To do that, you'd start by checking whether the `SEED_PHRASE` and `PASSWORD` constants are correctly defined by adding two `console.log` statements:

```typescript
import { MetaMask, defineWalletSetup } from '@synthetixio/synpress'
import 'dotenv/config'

const SEED_PHRASE = process.env.SEED_PHRASE
const PASSWORD = process.env.WALLET_PASSWORD

console.log({ SEED_PHRASE, PASSWORD }) // [!code focus]

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const extensionId = await getExtensionId(context, 'MetaMask')
  
  console.log({ extensionId }) // [!code focus]

  const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId)

  await metamask.importWallet(SEED_PHRASE)
})
```

By default, Synpress will strip out these `console.log` statements, so you won't see anything in the console.

To disable this behavior, you have to add the `--debug` flag to the CLI command:

```bash
# With the default path:
synpress --debug

# With a custom path:
synpress [PATH_TO_DIR_WITH_WALLET_SETUP_FILES] --debug
```

If you try to run the command above, it'll say that the cache is already built. That's because the hash hasn't changed since all `console.log` and `debugger` statements were stripped from the file before generating the hash.

To force rebuild the cache, you'll have to add the `--force` flag:

```bash
# With the default path:
synpress --debug --force

# With a custom path:
synpress [PATH_TO_DIR_WITH_WALLET_SETUP_FILES] --debug --force
```

Now, you should see the outputs of your `console.log` statements in the console! 🎉

::: tip
See the [CLI](./cli.md) section for more information about how the `--force` flags works.
:::
