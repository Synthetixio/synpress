async function run() {
  await installFoundry();
  const { anvilInstance, anvilChainType } = await runAnvil();
  const { publicClient, testClient, walletClient } = await setupViem(
    anvilChainType,
  );
  await stopAnvil(anvilInstance);

  async function setupViem(anvilChainType) {
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
  }

  async function runAnvil(
    forkUrl = 'https://sepolia.infura.io/v3/c77b50f0c19349e18712b6fbc93bb723',
    forkBlockNumber,
  ) {
    const { ethers } = require('ethers');
    const anvilClient = await import('@viem/anvil');
    const getPort = (await import('get-port')).default;
    try {
      const availablePort = await getPort();
      const anvil = anvilClient.createAnvil({
        port: availablePort,
        forkUrl,
        forkBlockNumber,
      });
      await anvil.start();
      console.log(anvil.status); // listening
      //   console.log(anvil.logs);
      const anvilUrl = `${anvil.host}:${anvil.port}`;
      const provider = new ethers.JsonRpcProvider(`http://${anvilUrl}`);
      const { chainId, name } = await provider.getNetwork();
      return {
        anvilInstance: anvil,
        anvilUrl: `http://${anvilUrl}`,
        anvilStatus: anvil.status,
        anvilLogs: anvil.logs,
        anvilOptions: anvil.options,
        anvilChainId: Number(chainId),
        anvilChainName: name,
        anvilChainType: {
          id: Number(chainId),
          name: name,
          network: name,
          nativeCurrency: {
            decimals: 18,
            name: 'Ether',
            symbol: 'ETH',
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
    } catch (error) {
      throw new Error('There was an error while trying to run anvil.', error);
    }
  }

  async function stopAnvil(anvilInstance) {
    try {
      await anvilInstance.stop();
      console.log(anvilInstance.status); // idle
    } catch (error) {
      throw new Error('There was an error while trying to stop anvil.', error);
    }
  }

  async function installFoundry(
    commit = '200b3f48a1fccdd93d579233df740f8727da5bcd',
  ) {
    const foundryClient = require('@foundry-rs/easy-foundryup');
    try {
      await foundryClient.getAnvilCommand();
    } catch (error) {
      await foundryClient.run(true, {
        commit,
      });
    }
  }
}

run();
