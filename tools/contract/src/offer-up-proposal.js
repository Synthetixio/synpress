// @ts-check
import { E } from '@endo/far';
import { makeMarshal } from '@endo/marshal';
import { AmountMath } from '@agoric/ertp/src/amountMath.js';

console.warn('start proposal module evaluating');

const { Fail } = assert;

// vstorage paths under published.*
const BOARD_AUX = 'boardAux';

const marshalData = makeMarshal(_val => Fail`data only`);

const IST_UNIT = 1_000_000n;
const CENT = IST_UNIT / 100n;

/**
 * Make a storage node for auxilliary data for a value on the board.
 *
 * @param {ERef<StorageNode>} chainStorage
 * @param {string} boardId
 */
const makeBoardAuxNode = async (chainStorage, boardId) => {
  const boardAux = E(chainStorage).makeChildNode(BOARD_AUX);
  return E(boardAux).makeChildNode(boardId);
};

const publishBrandInfo = async (chainStorage, board, brand) => {
  const [id, displayInfo] = await Promise.all([
    E(board).getId(brand),
    E(brand).getDisplayInfo(),
  ]);
  const node = makeBoardAuxNode(chainStorage, id);
  const aux = marshalData.toCapData(harden({ displayInfo }));
  await E(node).setValue(JSON.stringify(aux));
};

/**
 * Core eval script to start contract
 *
 * @param {BootstrapPowers} permittedPowers
 */
export const startOfferUpContract = async permittedPowers => {
  console.error('startOfferUpContract()...');
  const {
    consume: { board, chainStorage, startUpgradable, zoe },
    brand: {
      consume: { IST: istBrandP },
      // @ts-expect-error dynamic extension to promise space
      produce: { Item: produceItemBrand },
    },
    issuer: {
      consume: { IST: istIssuerP },
      // @ts-expect-error dynamic extension to promise space
      produce: { Item: produceItemIssuer },
    },
    installation: {
      consume: { offerUp: offerUpInstallationP },
    },
    instance: {
      // @ts-expect-error dynamic extension to promise space
      produce: { offerUp: produceInstance },
    },
  } = permittedPowers;

  const istIssuer = await istIssuerP;
  const istBrand = await istBrandP;

  const terms = { tradePrice: AmountMath.make(istBrand, 25n * CENT) };

  // agoricNames gets updated each time; the promise space only once XXXXXXX
  const installation = await offerUpInstallationP;

  const { instance } = await E(startUpgradable)({
    installation,
    issuerKeywordRecord: { Price: istIssuer },
    label: 'offerUp',
    terms,
  });
  console.log('CoreEval script: started contract', instance);
  const {
    brands: { Item: brand },
    issuers: { Item: issuer },
  } = await E(zoe).getTerms(instance);

  console.log('CoreEval script: share via agoricNames:', brand);

  produceInstance.reset();
  produceInstance.resolve(instance);

  produceItemBrand.reset();
  produceItemIssuer.reset();
  produceItemBrand.resolve(brand);
  produceItemIssuer.resolve(issuer);

  await publishBrandInfo(chainStorage, board, brand);
  console.log('offerUp (re)started');
};

/** @type { import("@agoric/vats/src/core/lib-boot").BootstrapManifest } */
const offerUpManifest = {
  [startOfferUpContract.name]: {
    consume: {
      agoricNames: true,
      board: true, // to publish boardAux info for NFT brand
      chainStorage: true, // to publish boardAux info for NFT brand
      startUpgradable: true, // to start contract and save adminFacet
      zoe: true, // to get contract terms, including issuer/brand
    },
    installation: { consume: { offerUp: true } },
    issuer: { consume: { IST: true }, produce: { Item: true } },
    brand: { consume: { IST: true }, produce: { Item: true } },
    instance: { produce: { offerUp: true } },
  },
};
harden(offerUpManifest);

export const getManifestForOfferUp = ({ restoreRef }, { offerUpRef }) => {
  return harden({
    manifest: offerUpManifest,
    installations: {
      offerUp: restoreRef(offerUpRef),
    },
  });
};
