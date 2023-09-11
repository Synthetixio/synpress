const { findNetwork } = require('../helpers');
const which = require('which');

const log = require('debug')('synpress:foundry');

let activeChains;

module.exports = {
  async resetState() {
    log('Resetting state of foundry');
    activeChains = undefined;
  },
  async getActiveChains() {
    return activeChains;
  },
  async forkChains(options) {
    await validateIfAnvilIsInstalledOrThrow();

    if (typeof options === 'object') {
      const chains = await module.exports.runAnvilWithViem(
        options.chainsToFork,
      );

      return { chains };
    } else if (typeof options === 'string') {
      if (isNaN(options)) {
        // todo: add support for:
        // (multiple) network IDs
        // (single) network name
        // (multiple) network names
      } else {
        // todo: add support for:
        // (single) network ID
      }
    }
  },
  async setupViem(anvilChainType) {
    try {
      const {
        createTestClient,
        createPublicClient,
        createWalletClient,
        http,
      } = require('viem');

      const testClient = createTestClient({
        chain: anvilChainType,
        mode: 'anvil',
        transport: http(),
      });

      const publicClient = createPublicClient({
        chain: anvilChainType,
        transport: http(),
      });

      const walletClient = createWalletClient({
        chain: anvilChainType,
        transport: http(),
      });

      return { testClient, publicClient, walletClient };
    } catch (error) {
      throw new Error('There was an error while trying to setup Viem.', error);
    }
  },
  async runAnvilWithViem(chains) {
    try {
      const { ethers } = require('ethers');
      const anvilClient = await import('@viem/anvil');

      const pool = anvilClient.createPool();

      for (const [index, [chain, options]] of Object.entries(
        Object.entries(chains),
      )) {
        // use fork url if provided, if not then find it in presets
        const forkUrl =
          options.forkUrl || (await findNetwork(chain)).rpcUrls.public.http[0];

        const poolOptions = {
          ...options,
          forkUrl,
        };

        // remove nativeCurrency because its not supported by anvil
        if (poolOptions.nativeCurrency) {
          delete poolOptions.nativeCurrency;
        }

        const anvilInstance = await pool.start(index, poolOptions);

        const anvilUrl = `${anvilInstance.host}:${anvilInstance.port}`;
        const provider = new ethers.JsonRpcProvider(`http://${anvilUrl}`);
        const { chainId, name } = await provider.getNetwork();
        chains[chain].anvilClientDetails = {
          anvilPool: pool,
          anvilPoolId: Number(index),
          provider,
          anvilInstance,
          anvilUrl: `http://${anvilUrl}`,
          anvilChainId: Number(chainId),
          anvilChainName: name,
          anvilChainType: {
            id: Number(chainId),
            name: name,
            network: name,
            nativeCurrency: options.nativeCurrency
              ? options.nativeCurrency
              : {
                  decimals: 18,
                  name: 'Anvil',
                  symbol: 'ANV',
                },
            rpcUrls: {
              default: {
                http: [`http://${anvilUrl}`],
                webSocket: [`ws://${anvilUrl}`],
              },
              public: {
                http: [`http://${anvilUrl}`],
                webSocket: [`ws://${anvilUrl}`],
              },
            },
          },
        };

        chains[chain].viemClients = await module.exports.setupViem(
          chains[chain].anvilClientDetails.anvilChainType,
        );
      }

      activeChains = chains;
      return chains;
    } catch (error) {
      throw new Error('There was an error while trying to run anvil.', error);
    }
  },
  async stopAnvil(anvilInstance) {
    try {
      await anvilInstance.stop();
      return true;
    } catch (error) {
      throw new Error('There was an error while trying to stop anvil.', error);
    }
  },
  async stopAnvilPoolId(anvilPool, anvilPoolId) {
    try {
      await anvilPool.stop(anvilPoolId);
    } catch (error) {
      throw new Error(
        `There was an error while trying to stop anvil pool with id ${anvilPoolId}`,
        error,
      );
    }
  },
  async stopAnvilPool(anvilPool) {
    try {
      if (Object.values(activeChains)[0]) {
        await Object.values(
          activeChains,
        )[0].anvilClientDetails.anvilPool.empty();
      } else {
        await anvilPool.empty();
      }
      return true;
    } catch (error) {
      throw new Error(
        `There was an error while trying to stop anvil pool`,
        error,
      );
    }
  },
};

async function validateIfAnvilIsInstalledOrThrow() {
  try {
    await which('anvil');
  } catch (e) {
    throw new Error(
      'Anvil not detected!. Forking is possible thanks to Anvil, a local testnet node shipped with Foundry. To install the Foundry toolchain please refer here: https://book.getfoundry.sh/getting-started/installation',
    );
  }
}
