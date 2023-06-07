class Network {
  shouldAddNetworkFromEnv() {
    return (
      process.env.NETWORK_NAME &&
      process.env.RPC_URL &&
      process.env.CHAIN_ID &&
      process.env.SYMBOL
    );
  }

  getNetworkFromEnv() {
    const networkName = process.env.NETWORK_NAME;
    const rpcUrl = process.env.RPC_URL;
    const chainId = process.env.CHAIN_ID;
    const symbol = process.env.SYMBOL;
    const isTestnet = process.env.IS_TESTNET;
    const blockExplorer = process.env.BLOCK_EXPLORER;

    return {
      networkName,
      rpcUrl,
      chainId,
      symbol,
      blockExplorer,
      isTestnet,
    };
  }
}

const networkHandler = new Network();
module.exports = networkHandler;
