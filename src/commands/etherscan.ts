import { promisify } from 'util';
import { getNetwork } from '../helpers';

const sleep = promisify(setTimeout);

type TxStatus = {
  status: string;
  message: string;
  result: {
    isError: string;
    errDescription: string;
  };
};

type TxReceipt = {
  blockHash: string;
  blockNumber: string;
  contractAddress: string | null;
  cumulativeGasUsed: string;
  effectiveGasPrice: string;
  from: string;
  to: string;
  gasUsed: string;
  logs: Array<any>;
  logsBloom: string;
  status: string;
  transactionHash: string;
  transactionIndex: string;
  type: string;
};

class EtherscanApi {
  retries: number;

  constructor(retries: number = 0) {
    this.retries = retries;
  }

  async getTransactionStatus(txid: string): Promise<{
    txStatus: TxStatus;
    txReceipt: {
      jsonrpc: string;
      id: number;
      result: TxReceipt | null;
    };
  }> {
    const currentNetwork = getNetwork().networkName;
    const etherscanApi = require('etherscan-api').init(
      process.env.ETHERSCAN_KEY,
      currentNetwork,
      30000,
    );
    const txStatus = await etherscanApi.transaction.getstatus(txid);
    const txReceipt = await etherscanApi.proxy.eth_getTransactionReceipt(txid);
    return { txStatus, txReceipt };
  }

  async waitForTxSuccess(txid: string): Promise<boolean> {
    const txStatus = await this.getTransactionStatus(txid);
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
      this.retries = 0;
      return true;
    } else if (
      // status pending
      txStatus.txReceipt.result === null &&
      txStatus.txStatus.result.isError === '0' &&
      this.retries <= 24 // 120 sec
    ) {
      console.log(`Transaction ${txid} is still pending.. waiting..`);
      this.retries++;
      await sleep(5000);
      const result = await this.waitForTxSuccess(txid);
      return result;
    } else {
      this.retries = 0;
      throw new Error(
        `Transaction ${txid} has failed or it hasn't been approved until timer ran out. Check Etherscan for more details.`,
      );
    }
  }
}

const etherscanApi = new EtherscanApi();
export default etherscanApi;
