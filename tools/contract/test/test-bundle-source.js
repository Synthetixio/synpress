/**
 * @file Test using bundleSource() on the contract.
 */
// @ts-check

/* eslint-disable import/order -- https://github.com/endojs/endo/issues/1235 */
import { test } from './prepare-test-env-ava.js';

import { createRequire } from 'module';
import bundleSource from '@endo/bundle-source';
import { E, passStyleOf } from '@endo/far';
import { makeZoeKitForTest } from '@agoric/zoe/tools/setup-zoe.js';

const myRequire = createRequire(import.meta.url);
const contractPath = myRequire.resolve(`../src/offer-up.contract.js`);

test('bundleSource() bundles the contract for use with zoe', async t => {
  const bundle = await bundleSource(contractPath);
  t.is(bundle.moduleFormat, 'endoZipBase64');
  t.log(bundle.endoZipBase64Sha512);
  t.true(bundle.endoZipBase64.length > 10_000);

  const { zoeService: zoe } = await makeZoeKitForTest();
  const installation = await E(zoe).install(bundle);
  t.log(installation);

  t.is(passStyleOf(installation), 'remotable');
});
