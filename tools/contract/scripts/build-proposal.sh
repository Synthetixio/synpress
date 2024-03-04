#!/bin/sh
# NOTE: intended to run _inside_ the agd container

cd /workspace/contract

mkdir -p bundles
(agoric run ./scripts/build-contract-deployer.js )>/tmp/,run.log
./scripts/parseProposals.mjs </tmp/,run.log \
  | jq -r '.bundles[]' | sort -u > bundles/bundle-list


