const { SynthetixJs } = require('synthetix-js');
const { getNetwork } = require('../helpers');

module.exports = {
  settle: async ({ asset, privateKey }) => {
    if (privateKey === undefined && process.env.PRIVATE_KEY) {
      privateKey = process.env.PRIVATE_KEY;
    }
    const network = getNetwork();
    const signer = new SynthetixJs.signers.PrivateKey(
      // eslint-disable-next-line unicorn/no-null
      null,
      network,
      `0x${privateKey}`,
    );
    const snxjs = new SynthetixJs({ signer, network });
    const { toUtf8Bytes32 } = snxjs.utils;

    try {
      const txn = await snxjs.Synthetix.settle(toUtf8Bytes32(asset));
      console.log(`Settle executed: ${txn.hash}`);
      await txn.wait();
      return true;
    } catch (error) {
      console.error(`There was an error while executing settle: ${error}`);
    }
  },
};
