#!/usr/bin/env node

import fs from 'fs';

const Fail = (template, ...args) => {
  throw Error(String.raw(template, ...args.map(val => String(val))));
};

/**
 * Parse output of `agoric run proposal-builder.js`
 *
 * @param {string} txt
 *
 * adapted from packages/boot/test/bootstrapTests/supports.js
 */
const parseProposalParts = txt => {
  const evals = [
    ...txt.matchAll(/swingset-core-eval (?<permit>\S+) (?<script>\S+)/g),
  ].map(m => {
    if (!m.groups) throw Fail`Invalid proposal output ${m[0]}`;
    const { permit, script } = m.groups;
    return { permit, script };
  });
  evals.length || Fail`No swingset-core-eval found in proposal output: ${txt}`;

  const bundles = [...txt.matchAll(/swingset install-bundle @([^\n]+)/gm)].map(
    ([, bundle]) => bundle,
  );
  bundles.length || Fail`No bundles found in proposal output: ${txt}`;

  return { evals, bundles };
};

const main = (stdin, readFileSync) => {
  const input = readFileSync(stdin.fd).toString();
  const parts = parseProposalParts(input);
  // relies on console.log printing to stdout unmodified
  console.log(JSON.stringify(parts));
};

main(process.stdin, fs.readFileSync);
