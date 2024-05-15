# Built-in Fixtures

Synpress has fixtures for `EthereumWalletMock` and `MetaMask` built-in. You can use them in your tests to interact with
the wallet.

## EthereumWalletMock

`EthereumWalletMock` is a simple class that allows you to interact with the mocked wallet without any external
dependencies.

### Usage

```javascript
import { ethereumWalletMockFixtures } from "@synthetixio/synpress";

const test = testWithSynpress(ethereumWalletMockFixtures);

test("test", async ({ ethereumWalletMock }) => {
  // Test code here
});
```

## MetaMask

`MetaMask` is a class that allows you to interact with the real MetaMask wallet using the MetaMask browser extension.

### Usage

```javascript
import { metaMaskFixtures } from "@synthetixio/synpress";

// Pick one
import basicSetup from './wallet-setup/basic.setup'
import connectedSetup from './wallet-setup/connected.setup'
import customSetup from './wallet-setup/custom.setup'

const testBasic = testWithSynpress(metaMaskFixtures(basicSetup));
const testConnected = testWithSynpress(metaMaskFixtures(connectedSetup));
const testCustom = testWithSynpress(metaMaskFixtures(customSetup));

test("test", async ({
  metamaskPage,
  extensionId,
  createAnvilNode,
  connectToAnvil,
  deployToken,
  deployAndMintERC1155,
}) => {
  // Test code here
});
```
