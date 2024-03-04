/**
 * @file IST faucet using the `centralSupply` contract.
 * @see {makeStableFaucet}
 */

// @ts-check
import { E } from '@endo/far';
import { createRequire } from 'module';

const myRequire = createRequire(import.meta.url);
const centralSupplyPath = myRequire.resolve(
  '@agoric/vats/src/centralSupply.js',
);

/** @typedef {Installation<typeof import('@agoric/vats/src/centralSupply.js').start>} CentralSupplyInstallation */
/** @typedef {Awaited<ReturnType<import('@endo/bundle-source/cache.js').makeNodeBundleCache>>} BundleCache */

/**
 * Make a stable faucet; that is: a tool to mint the Zoe fee token.
 *
 * Zoe contract execution fees are paid in a (presumed) stable token. On mainnet,
 * this token is called IST, the Inter Stable Token. The testing version
 * of zoe from makeZoeKitForTest() calls it ZDEFAULT.
 *
 * ZCF grants access to the fee mint when presented with the `feeMintAccess` object.
 * ZCF is only available inside a contract. `centralSupply` is an available contract
 * just for this purpose. Each time we want to mint a fee/stable token payment,
 * we make an instance of of the `centralSupply` contract.
 *
 * @param {object} powers
 * @param {ERef<FeeMintAccess>} powers.feeMintAccess for minting IST
 * @param {ERef<ZoeService>} powers.zoe for starting the `centralSupply` contract
 * @param {BundleCache} powers.bundleCache for bundling the `centralSupply` contract
 */
export const makeStableFaucet = ({
  feeMintAccess: feeMintAccessP,
  zoe,
  bundleCache,
}) => {
  /** @type {ERef<CentralSupplyInstallation>} */
  const centralSupply = bundleCache
    .load(centralSupplyPath, 'centralSupply')
    .then(b => E(zoe).install(b));

  /**
   * Mint a payment in the fee token.
   *
   * @param {bigint} value the associated brand is implicitly the fee brand
   * @returns {Promise<Payment<'nat'>>}
   */
  const mintBrandedPayment = async value => {
    const feeMintAccess = await feeMintAccessP;

    const { creatorFacet: bootstrapSupplier } = await E(zoe).startInstance(
      centralSupply,
      {},
      { bootstrapPaymentValue: value },
      { feeMintAccess },
    );
    return E(bootstrapSupplier).getBootstrapPayment();
  };

  /**
   * Make a purse containing some amount of the fee/stable token.
   *
   * @param {bigint} value
   */
  const faucet = async value => {
    const pmt = await mintBrandedPayment(value);

    const purse = await E(E(zoe).getFeeIssuer()).makeEmptyPurse();
    await E(purse).deposit(pmt);
    return purse;
  };

  return harden({ mintBrandedPayment, faucet });
};
