#!/bin/bash

#save my current folder
CURRENTDIR=$(pwd)

#move to a temp folder
cd /tmp

#remove previous folder
rm -rf extension

#clone and download submodules
git clone git@github.com:block-wallet/extension.git
cd extension
git submodule update --init --recursive

#checkout and install
make git/branch/checkout BRANCH=master
make install

#prepare environment
cp packages/background/env.orig packages/background/.env
cp packages/provider/env.orig packages/provider/.env

#build
make build

#copy dist folder
cp -r dist $CURRENTDIR/blockwallet-extension

