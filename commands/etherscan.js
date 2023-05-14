const sleep = require('util').promisify(setTimeout);

let retries = 0;

module.exports = {
  async getTransactionStatus(txid) {
    const { getCurrentNetwork } = require('../helpers');
    const currentNetwork = getCurrentNetwork().name;
    const etherscanApi = require('etherscan-api').init(
      process.env.ETHERSCAN_KEY,
      currentNetwork,
      30000,
    );
    const txStatus = await etherscanApi.transaction.getstatus(txid);
    const txReceipt = await etherscanApi.proxy.eth_getTransactionReceipt(txid);
    return { txStatus, txReceipt };
  },
  async waitForTxSuccess(txid) {
    const txStatus = await module.exports.getTransactionStatus(txid);
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
      return true;
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
};
