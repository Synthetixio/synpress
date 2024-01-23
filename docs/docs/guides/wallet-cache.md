# Wallet Cache

The wallet cache feature of Synpress is its crown jewel. It allows you to define in a separate file how the wallet should be installed and set up. 
Based on this file, Synpress generates a browser cache that is then used as a starting point for the tests. This allows you to skip the wallet installation and setup steps, which can be quite time-consuming.

## Writing a wallet setup file

### File name

Since wallet setup files play a crucial role, they must follow a strict naming convention. The file name must follow this format: `*.setup.{ts,js,mjs}`. 

Here are some examples of valid file names:
- `basic.setup.ts`
- `connected.setup.ts`
- `optimism.setup.ts`
- `multi-user.setup.ts`

### Import

Let's start with the import statement. You need to import the `defineWalletSetup` function from `@synthetixio/synpress`:

```typescript
import { defineWalletSetup } from '@synthetixio/synpress'
```

### Prepare seed phrase and password

Next, you need to define the seed phrase and password that will be used to import the wallet. You can define them as constants, use environment variables, or do whatever suits your needs.

::: code-group
```typescript [Constants]
import { MetaMask, defineWalletSetup } from '@synthetixio/synpress'

const SEED_PHRASE = 'test test test test test test test test test test test junk' // [!code focus]
const PASSWORD = 'Password123' // [!code focus]
```

```typescript [Environment variables]
import { MetaMask, defineWalletSetup } from '@synthetixio/synpress'
import 'dotenv/config' // [!code focus]

const SEED_PHRASE = process.env.SEED_PHRASE // [!code focus]
const PASSWORD = process.env.WALLET_PASSWORD // [!code focus]
```
:::

::: tip NOTE
You can replace `dotenv` with any other alternative to load the environmental variables.
:::

### Define the wallet setup

Finally, you need to define the wallet setup steps. This is done by calling the `defineWalletSetup` function. It takes two arguments, the password, and the setup function. 

The setup function is where the magic happens. Contents of this function will be executed in the browser context, which means you can use all browser-related Playwright APIs.

Here's how you can import a wallet with MetaMask:

```typescript
import { 
  MetaMask, // [!code focus]
  defineWalletSetup 
} from '@synthetixio/synpress'

const SEED_PHRASE = 'test test test test test test test test test test test junk'
const PASSWORD = 'Password123'

export default defineWalletSetup(PASSWORD, async (context, walletPage) => { // [!code focus]
  const metamask = new MetaMask(context, walletPage, PASSWORD) // [!code focus]

  await metamask.importWallet(SEED_PHRASE) // [!code focus]
}) // [!code focus]
```

If, on the other hand, you want to use a wallet imported directly from a private key, you still have to import a seed phrase first and then import the wallet from a private key.

This is due to the fact that MetaMask only allows you to import a wallet from a private key if MetaMask is already initialized with a seed phrase.

Here's how to do it:

```typescript
import { 
  MetaMask,
  defineWalletSetup 
} from '@synthetixio/synpress'

const SEED_PHRASE = 'test test test test test test test test test test test junk'
const PASSWORD = 'Password123'

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD)

  await metamask.importWallet(SEED_PHRASE)
  await metamask.importWalletFromPrivateKey('0xdeadbeef') // [!code focus]
})
```
### Building the cache

::: warning PREREQUISITE
Before building the cache, you must have relevant Playwright browsers installed on your machine. See [this Playwright guide](https://playwright.dev/docs/browsers) for instructions on how to do it.
:::

Once you've written your wallet setup file, you must build its cache. This is done with our CLI tool `synpress`. Here's how to do it:

```bash
synpress
```

By default, the CLI expects the wallet setup files to be in the `[PROJECT_ROOT]/test/wallet-setup` directory. If you want to use a different one, you can pass it as an argument to the CLI:

```bash
synpress [PATH_TO_DIR_WITH_WALLET_SETUP_FILES]
```

::: tip
Run `synpress --help` to see all available options.
:::

When you run this command, Synpress will open a browser for each wallet setup file, execute the setup functions, and then save the browser caches.

::: tip
By default, the browsers will be launched in the headed mode. If you want to run them in the headless mode, you can pass the `--headless` flag to the CLI or set the `HEADLESS` environmental variable to `true`.
:::

## How it works

### Basics

Understanding how the wallet cache works is crucial for writing wallet setup files. 

Let's start with the basics.

Here's the wallet setup file from the previous section:

::: code-group
```typescript [basic.setup.ts]
import { MetaMask, defineWalletSetup } from '@synthetixio/synpress'

const SEED_PHRASE = 'test test test test test test test test test test test junk'
const PASSWORD = 'Password123'

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD)

  await metamask.importWallet(SEED_PHRASE)
})
```
:::

When you run our CLI, it will first analyze the wallet setup file, generate a hash of its contents, and then check if the cache for this hash already exists. If it doesn't, it will open a browser, execute the setup function, and save the cache to the `[PROJECT_ROOT]/.cache-synpress` directory.

Each cache is saved in a separate directory named after the hash of the wallet setup file.

::: tip
You should add the `.cache-synpress` directory to your `.gitignore` file.
:::

::: danger IMPORTANT NOTE
If you intend to use MetaMask to send transactions, sign data, or do anything that requires interactions through the pop-up, you must adjust your wallet setup file by including its extension ID.

::: details 💡 Click me to see the adjusted wallet setup file
```typescript
import { MetaMask, defineWalletSetup } from '@synthetixio/synpress'

const SEED_PHRASE = 'test test test test test test test test test test test junk'
const PASSWORD = 'Password123'

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  // This is a workaround for the fact that the MetaMask extension ID changes, and this ID is required to detect the pop-ups. // [!code focus]
  // It won't be needed in the near future! 😇 // [!code focus]
  const extensionId = await getExtensionId(context, 'MetaMask') // [!code focus]

  const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId) // [!code focus]

  await metamask.importWallet(SEED_PHRASE)
})
```
:::

### Hash generation

The hash is generated **ONLY** from the contents of the function you pass to the `defineWalletSetup` function. This means you can import other files, define constants, etc., without affecting the hash.

Based on the wallet setup above, only the following lines will be used to generate the hash:

```typescript
import { MetaMask, defineWalletSetup } from '@synthetixio/synpress'

const SEED_PHRASE = 'test test test test test test test test test test test junk'
const PASSWORD = 'Password123'

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD) // [!code highlight]
  // [!code highlight]
  await metamask.importWallet(SEED_PHRASE) // [!code highlight]
})
```

If you change anything in the highlighted code above, the hash will change, and the cache must be rebuilt.

For example, let's say we get rid of the `SEED_PHRASE` constant and inline it like this:

```typescript
import { MetaMask, defineWalletSetup } from '@synthetixio/synpress'

const PASSWORD = 'Password123'

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD)
  
  await metamask.importWallet('test test test test test test test test test test test junk') // [!code focus]
})
```

This simple change will cause the hash to change, which means you'll have to rebuild the cache with the CLI.

::: tip NOTE
There's one exception to this rule. All `console.log` and `debugger` statements are stripped out before the hash is generated, which means they do **NOT** affect the hash.

To learn more about this, see the [Debugging Wallet Setup Files](./wallet-setup-debug) section.
:::

## Things to keep in mind

Here are a few things that are important to keep in mind when dealing with setup files:

- You can do whatever you want in the setup function as long as it's not affecting the state of a blockchain in any way. This means you can add wallets, networks, change settings, etc., but you cannot send any transactions. 
However, you can still sign data with imported wallets, which is useful for connecting to dapps. With this, you can start tests with a fully configured wallet connected to a dapp.
- You don't have to close the browser or any tabs in the setup function. Synpress will handle everything.
- You can have multiple wallet setup files. Synpress will generate a cache for each of them. However, currently, all caches are built in parallel, so if you have a ton of setup files and a slow computer, it might be impossible to build them. We're working on a solution for this.

## Using the cache

Once you've built the cache, you can use it in your tests. Each test can use a different cache. This is useful if you want to test different scenarios.

Based on the wallet setup file passed to a test, Synpress will generate a hash from it and then check if the cache for this hash exists. If it doesn't, it will immediately throw an error.

For detailed instructions on using the cache in your tests, see the [Playwright](./playwright) section.
