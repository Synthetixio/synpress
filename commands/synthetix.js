const { synthetixJs } = require('synthetix-js');
const { getNetwork } = require('../helpers');

module.exports = {
  settle: async ({ asset, privateKey }) => {
    const network = getNetwork();
    const signer = new synthetixJs.signers.PrivateKey(
      // eslint-disable-next-line unicorn/no-null
      null,
      network,
      `0x${privateKey}`,
    );
    const snxjs = new synthetixJs({ signer, network });
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
