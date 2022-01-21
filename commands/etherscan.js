const sleep = require('util').promisify(setTimeout);
const fetch = require('node-fetch');
let retries = 0;

const MAIN_API_URL = 'https://api.etherscan.io';
const TESTNET_API_URL_MAP = {
  ropsten: 'https://api-ropsten.etherscan.io',
  kovan: 'https://api-kovan.etherscan.io',
  rinkeby: 'https://api-rinkeby.etherscan.io',
  homestead: 'https://api.etherscan.io',
  goerli: 'https://api-goerli.etherscan.io',
};

const executeEtherscanRequest = (
  networkName,
  module,
  action,
  extraParams = {},
) => {
  const url = TESTNET_API_URL_MAP[networkName] || MAIN_API_URL;
  const queryData = {
    module,
    action,
    apiKey: process.env.ETHERSCAN_KEY,
    ...extraParams,
  };
  const searchParams = new URLSearchParams(queryData);
  return fetch(`${url}/api?${searchParams.toString()}`);
};

module.exports = {
  getTransactionStatus: async txid => {
    const { getNetwork } = require('../helpers');
    const currentNetwork = getNetwork().networkName;
    try {
      const responseTxStatus = await executeEtherscanRequest(
        currentNetwork,
        'transaction',
        'getstatus',
        { txhash: txid },
      );
      const responseTxRecipt = await executeEtherscanRequest(
        currentNetwork,
        'proxy',
        'eth_getTransactionReceipt',
        { txhash: txid },
      );
      const txStatus = await responseTxStatus.json();
      const txReceipt = await responseTxRecipt.json();
      return { txStatus, txReceipt };
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  },
  waitForTxSuccess: async txid => {
    console.log('My txid', txid);
    const txStatus = await module.exports.getTransactionStatus(txid);
    console.log(txStatus);
    if (
      // status success
      txStatus.txReceipt.result &&
      txStatus.txReceipt.result.status === '0x1' &&
      txStatus.txStatus.result &&
      txStatus.txStatus.result.isError === '0'
    ) {
      console.log(
        `Transaction ${txid} has been confirmed with success, moving on..`,
      );
      retries = 0;
      return txStatus.txReceipt;
    } else if (
      // status pending
      txStatus.txReceipt.result === null &&
      txStatus.txStatus.result.isError === '0' &&
      retries <= 24 // 120 sec
    ) {
      console.log(`Transaction ${txid} is still pending.. waiting..`);
      retries++;
      await sleep(5000);
      const result = await module.exports.waitForTxSuccess(txid);
      return result;
    } else {
      retries = 0;
      throw new Error(
        `Transaction ${txid} has failed or it hasn't been approved until timer ran out. Check Etherscan for more details.`,
      );
    }
  },
  getAccountTransactions: async accountAddress => {
    const { getNetwork } = require('../helpers');
    const { networkName } = getNetwork();
    const module = 'account';
    const action = 'txlist';
    try {
      const response = await executeEtherscanRequest(
        networkName,
        module,
        action,
        { address: accountAddress, page: 1, offset: 10, sort: 'desc' },
      );
      return response.json();
    } catch (e) {
      return Promise.reject(e);
    }
  },
};
