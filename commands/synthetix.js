const { SynthetixJs } = require('synthetix-js');
const { getNetwork } = require('../helpers');
const bytes32 = require('bytes32');

module.exports = {
  settle: async ({ asset, privateKey }) => {
    const assetAsBytes32 = bytes32({ input: asset });
    if (privateKey === undefined && process.env.PRIVATE_KEY) {
      privateKey = process.env.PRIVATE_KEY;
    }
    const networkId = getNetwork().networkId;
    const signer = new SynthetixJs.signers.PrivateKey(
      undefined,
      networkId,
      `0x${privateKey}`,
    );
    const snxjs = new SynthetixJs({ signer, networkId });
    const txn = await snxjs.Synthetix.settle(assetAsBytes32);
    console.log(`Settle executed: ${txn.hash}`);
    await txn.wait();
    return true;
  },
};
