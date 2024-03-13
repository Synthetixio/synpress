/* eslint-disable import/order -- https://github.com/endojs/endo/issues/1235 */
import { test } from './prepare-test-env-ava.js';
import { execSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { makeCompressFile } from './utils.js';

test.before(t => (t.context.compressFile = makeCompressFile(fs.readFile)));

test.only('proposal builder generates compressed bundles less than 1MB', async t => {
  const stdout = execSync('agoric run scripts/build-contract-deployer.js', { encoding: 'utf8' }); 
  t.log('agoric run stdout:', stdout);
  t.truthy(stdout, 'Proposal successfully bundled.');

  const regex = /agd tx swingset install-bundle @(.*?)\.json/g;
  const bundles = Array.from(stdout.matchAll(regex), m => `${m[1]}.json`);
  t.assert(bundles.length, 'Found bundles in stdout');

  for (const bundle of bundles) {
    // eslint-disable-next-line @jessie.js/safe-await-separator
    const buffer = await t.context.compressFile(bundle);
    t.assert(buffer);
    const sizeInMb = buffer.length / (1024 * 1024);
    t.assert(sizeInMb < 1, 'Compressed bundle is less than 1MB');
    t.log({
      bundleId: bundle.split('cache/')[1].split('.json')[0],
      compressedSize: `${sizeInMb} MB`,
    });
  }
});
