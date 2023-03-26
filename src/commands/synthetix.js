const { SynthetixJs } = require('synthetix-js');
const { synthetix } = require('@synthetixio/js');
const { getNetwork } = require('../helpers');
const metamask = require('./metamask');
const bytes32 = require('bytes32');
const sleep = require('util').promisify(setTimeout);

module.exports = {
  settle: async ({ asset, walletAddress, privateKey }) => {
    if (walletAddress === undefined) {
      walletAddress = metamask.walletAddress();
    }
    const assetAsBytes32 = bytes32({ input: asset });
    const networkId = getNetwork().networkId;
    const networkName = getNetwork().networkName;
    const signer = new SynthetixJs.signers.PrivateKey(
      undefined,
      networkId,
      `0x${privateKey}`,
    );
    const snxjs = new SynthetixJs({ signer, networkId });

    const maxEntriesInQueue = await getMaxEntriesInQueue(networkName);
    const currentLengthOfEntries = await getLengthOfEntries(
      networkName,
      walletAddress,
      assetAsBytes32,
    );

    if (currentLengthOfEntries >= maxEntriesInQueue - 3) {
      const maxSecsLeftInWaitingPeriod = await getMaxSecsLeftInWaitingPeriod(
        networkName,
        walletAddress,
        assetAsBytes32,
      );

      if (maxSecsLeftInWaitingPeriod > 0) {
        console.log(
          `We're currently in waiting period, waiting for ${maxSecsLeftInWaitingPeriod} seconds before settling..`,
        );
        await sleep(maxSecsLeftInWaitingPeriod * 1000);
        const txHash = await sendSettleTx();
        return txHash;
      } else {
        const txHash = await sendSettleTx();
        return txHash;
      }
    } else {
      console.log(
        `Current length of entries in queue is ${currentLengthOfEntries}, no need to settle yet.`,
      );
      return false;
    }

    async function sendSettleTx() {
      const txn = await snxjs.Synthetix.settle(assetAsBytes32);
      console.log(`Settle executed: ${txn.hash}`);
      await txn.wait();
      return txn.hash;
    }
  },
  checkWaitingPeriod: async ({ asset, walletAddress }) => {
    if (walletAddress === undefined) {
      walletAddress = metamask.walletAddress();
    }
    const assetAsBytes32 = bytes32({ input: asset });
    const networkName = getNetwork().networkName;
    const maxSecsLeftInWaitingPeriod = await getMaxSecsLeftInWaitingPeriod(
      networkName,
      walletAddress,
      assetAsBytes32,
    );
    if (maxSecsLeftInWaitingPeriod > 0) {
      console.log(
        `We're currently in waiting period, waiting for ${maxSecsLeftInWaitingPeriod} seconds..`,
      );
      await sleep(maxSecsLeftInWaitingPeriod * 1000);
      return true;
    } else {
      return true;
    }
  },
};

async function getMaxEntriesInQueue(networkName) {
  const snxjs = synthetix({ network: networkName });
  const maxEntriesInQueue =
    await snxjs.contracts.ExchangeState.maxEntriesInQueue();
  return Number(maxEntriesInQueue);
}

async function getLengthOfEntries(networkName, walletAddress, assetAsBytes32) {
  const snxjs = synthetix({ network: networkName });
  const getLengthOfEntries =
    await snxjs.contracts.ExchangeState.getLengthOfEntries(
      walletAddress,
      assetAsBytes32,
    );
  return Number(getLengthOfEntries);
}

// async function hasWaitingPeriodOrSettlementOwing(
//   networkName,
//   walletAddress,
//   assetAsBytes32,
// ) {
//   const snxjs = synthetix({ network: networkName });
//   const hasWaitingPeriodOrSettlementOwing = await snxjs.contracts.Exchanger.hasWaitingPeriodOrSettlementOwing(
//     walletAddress,
//     assetAsBytes32,
//   );
//   return hasWaitingPeriodOrSettlementOwing;
// }

async function getMaxSecsLeftInWaitingPeriod(
  networkName,
  walletAddress,
  assetAsBytes32,
) {
  const snxjs = synthetix({ network: networkName });
  const maxSecsLeftInWaitingPeriod =
    await snxjs.contracts.Exchanger.maxSecsLeftInWaitingPeriod(
      walletAddress,
      assetAsBytes32,
    );
  return Number(maxSecsLeftInWaitingPeriod);
}
