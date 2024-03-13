#!/bin/bash
# NOTE: intended to run _inside_ the agd container

set -xueo pipefail

cd /workspace/contract

# TODO: try `agoric publish` to better track outcome
install_bundle() {
  ls -sh "$1"
  agd tx swingset install-bundle --compress "@$1" \
    --from user1 --keyring-backend=test --gas=auto --gas-adjustment=1.2 \
    --chain-id=agoriclocal -bblock --yes -o json
}

# exit fail if bundle-list is emtpy
[ -s bundles/bundle-list ] || exit 1

make balance-q  # do we have enough IST?

for b in $(cat bundles/bundle-list); do 
  echo installing $b
  install_bundle $b
done
