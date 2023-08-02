/* eslint-disable ui-testing/no-disabled-tests */
describe('Metamask', () => {
  context('Test commands', () => {
    // todo: clear the state of extension and test different combinations of setupMetamask with private key & custom network
    it(`setupMetamask should finish metamask setup using secret words`, () => {
      cy.setupMetamask(
        'test test test test test test test test test test test junk',
        'sepolia',
        'Tester@1234',
      ).then(setupFinished => {
        expect(setupFinished).to.be.true;
      });
    });
    it(`disconnectMetamaskWalletFromDapp shouldn't fail if there are no dapps connected`, () => {
      cy.disconnectMetamaskWalletFromDapp().then(disconnected => {
        expect(disconnected).to.be.true;
      });
    });
    it(`disconnectMetamaskWalletFromAllDapps shouldn't fail if there are no dapps connected`, () => {
      cy.disconnectMetamaskWalletFromAllDapps().then(disconnected => {
        expect(disconnected).to.be.true;
      });
    });
    it('rejectMetamaskAccess should reject connection request to metamask', () => {
      cy.visit('/');
      cy.get('#connectButton').click();
      cy.rejectMetamaskAccess().then(rejected => {
        expect(rejected).to.be.true;
      });
    });
    it(`acceptMetamaskAccess should accept connection request to metamask`, () => {
      cy.get('#connectButton').click();
      cy.acceptMetamaskAccess().then(connected => {
        expect(connected).to.be.true;
      });
      cy.get('#network').contains('11155111');
      cy.get('#chainId').contains('0xaa36a7');
      cy.get('#accounts').should(
        'have.text',
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      );
    });
    it(`eth_accounts should return valid wallet address`, () => {
      cy.get('#getAccounts').click();
      cy.get('#getAccountsResult').should(
        'have.text',
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      );
    });
    it(`getCurrentNetwork should return network by default`, () => {
      cy.getCurrentNetwork().then(network => {
        expect(network.name).to.match(/sepolia/i);
        expect(network.id).to.be.equal(11155111);
        expect(network.testnet).to.be.true;
      });
    });
    it(`addMetamaskNetwork should add custom network`, () => {
      if (Cypress.env('USE_ANVIL')) {
        cy.addMetamaskNetwork({
          networkName: 'anvil',
          rpcUrl: Cypress.env('DOCKER_RUN')
            ? 'http://foundry:8545'
            : 'http://127.0.0.1:8545',
          chainId: 11155111,
          symbol: 'aETH',
          isTestnet: true,
        });
        cy.get('#network').contains('11155111');
        cy.get('#chainId').contains('0xaa36a7');
      } else {
        cy.addMetamaskNetwork({
          networkName: 'Optimism Network',
          rpcUrl: 'https://mainnet.optimism.io',
          chainId: 10,
          symbol: 'oETH',
          blockExplorer: 'https://optimistic.etherscan.io',
          isTestnet: false,
        }).then(networkAdded => {
          expect(networkAdded).to.be.true;
        });
        cy.get('#network').contains('0xa');
        cy.get('#chainId').contains('0xa');
      }
    });
    it(`getCurrentNetwork should return valid network after adding a new network`, () => {
      cy.getCurrentNetwork().then(network => {
        if (Cypress.env('USE_ANVIL')) {
          expect(network.name).to.be.equal('anvil');
          expect(network.id).to.be.equal(11155111);
          expect(network.testnet).to.be.true;
        } else {
          expect(network.name).to.match(/optimism network/i);
          expect(network.id).to.be.equal(10);
          expect(network.testnet).to.be.false;
        }
      });
    });
    it(`changeMetamaskNetwork should change network using pre-defined network`, () => {
      cy.changeMetamaskNetwork('ethereum').then(networkChanged => {
        expect(networkChanged).to.be.true;
      });
      cy.get('#network').contains('0x1');
      cy.get('#chainId').contains('0x1');
    });
    it(`getCurrentNetwork should return valid network after changing a network`, () => {
      cy.getCurrentNetwork().then(network => {
        console.log(network);
        expect(network.name).to.match(/ethereum/i);
        expect(network.id).to.be.equal(1);
      });
    });
    it(`changeMetamaskNetwork should discard changing network if it is current one`, () => {
      cy.changeMetamaskNetwork('ethereum').then(networkChanged => {
        expect(networkChanged).to.be.false;
      });
    });
    it(`changeMetamaskNetwork should change network using custom network name`, () => {
      if (Cypress.env('USE_ANVIL')) {
        cy.changeMetamaskNetwork('anvil').then(networkChanged => {
          expect(networkChanged).to.be.true;
        });
        cy.get('#network').contains('0xaa36a7');
        cy.get('#chainId').contains('0xaa36a7');
      } else {
        cy.changeMetamaskNetwork('optimism network').then(networkChanged => {
          expect(networkChanged).to.be.true;
        });
        cy.get('#network').contains('0xa');
        cy.get('#chainId').contains('0xa');
        cy.changeMetamaskNetwork('sepolia');
      }
    });
    it(`rejectMetamaskPermisionToApproveAll should reject permission to approve all NFTs upon warning`, () => {
      cy.get('#deployNFTsButton').click();
      cy.confirmMetamaskTransaction();
      cy.get('#mintButton').click();
      cy.confirmMetamaskTransaction();
      cy.get('#setApprovalForAllButton').click();
      cy.rejectMetamaskPermisionToApproveAll().then(rejected => {
        expect(rejected).to.be.true;
      });
    });
    it(`confirmMetamaskPermisionToApproveAll should confirm permission to approve all NFTs`, () => {
      cy.get('#setApprovalForAllButton').click();
      cy.confirmMetamaskPermisionToApproveAll().then(confirmed => {
        expect(confirmed).to.be.true;
      });
    });
    it(`importMetamaskAccount should import new account using private key`, () => {
      cy.importMetamaskAccount(
        '0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6',
      ).then(imported => {
        expect(imported).to.be.true;
      });
      cy.get('#requestPermissions').click();
      cy.acceptMetamaskAccess();
      cy.get('#accounts').contains(
        '0xa0ee7a142d267c1f36714e4a8f75612f20a79720',
      );
    });
    it(`createMetamaskAccount should create new account with default name`, () => {
      cy.createMetamaskAccount().then(created => {
        expect(created).to.be.true;
      });
    });
    it(`createMetamaskAccount should create new account with custom name`, () => {
      cy.createMetamaskAccount('custom-wallet').then(created => {
        expect(created).to.be.true;
      });
    });
    it(`createMetamaskAccount should not fail when creating new account with already existing custom name`, () => {
      cy.createMetamaskAccount('custom-wallet').then(created => {
        expect(created).to.be.equal('This account name already exists');
      });
    });
    it(`switchMetamaskAccount should switch to another account using order number`, () => {
      cy.switchMetamaskAccount(2).then(switched => {
        expect(switched).to.be.true;
      });
    });
    it(`getMetamaskWalletAddress should return wallet address of current metamask account`, () => {
      cy.getMetamaskWalletAddress().then(address => {
        expect(address).to.be.equal(
          '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        );
      });
    });
    it(`switchMetamaskAccount should switch to another account using account name`, () => {
      cy.switchMetamaskAccount('account 1').then(switched => {
        expect(switched).to.be.true;
      });
    });
    it(`getMetamaskWalletAddress should return valid wallet address of metamask account after changing an account`, () => {
      cy.getMetamaskWalletAddress().then(address => {
        expect(address).to.be.equal(
          '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        );
      });
    });
    it(`activateCustomNonceInMetamask should activate custom nonce input field for transactions`, () => {
      cy.activateCustomNonceInMetamask().then(activated => {
        expect(activated).to.be.true;
      });
    });
    // todo: add tests for advanced settings
    it(`resetMetamaskAccount should reset current account`, () => {
      cy.resetMetamaskAccount().then(resetted => {
        expect(resetted).to.be.true;
      });
    });
    it(`disconnectMetamaskWalletFromDapp should disconnect current account from current dapp (when already connected)`, () => {
      cy.get('#requestPermissions').click();
      cy.acceptMetamaskAccess();
      cy.disconnectMetamaskWalletFromDapp().then(disconnected => {
        expect(disconnected).to.be.true;
      });
    });
    it(`disconnectMetamaskWalletFromAllDapps should disconnect current account from all dapps (when already connected)`, () => {
      cy.get('#requestPermissions').click();
      cy.acceptMetamaskAccess();
      cy.disconnectMetamaskWalletFromAllDapps().then(disconnected => {
        expect(disconnected).to.be.true;
      });
    });
    it(`confirmMetamaskSignatureRequest should confirm signature request`, () => {
      cy.get('#requestPermissions').click();
      cy.acceptMetamaskAccess();
      cy.get('#personalSign').click();
      cy.confirmMetamaskSignatureRequest().then(confirmed => {
        expect(confirmed).to.be.true;
      });
      cy.get('#personalSignVerify').click();
      cy.get('#personalSignVerifySigUtilResult').contains(
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      );
    });
    it(`confirmMetamaskSignatureRequest should confirm data signature request`, () => {
      cy.get('#signTypedDataV4').click();
      cy.confirmMetamaskDataSignatureRequest().then(confirmed => {
        expect(confirmed).to.be.true;
      });
      cy.get('#signTypedDataV4Verify').click();
      cy.get('#signTypedDataV4VerifyResult').contains('0x');
    });
    it(`rejectMetamaskEncryptionPublicKeyRequest should reject public encryption key request`, () => {
      cy.get('#getEncryptionKeyButton').click();
      cy.rejectMetamaskEncryptionPublicKeyRequest().then(rejected => {
        expect(rejected).to.be.true;
      });
      cy.get('#encryptionKeyDisplay').contains(
        'Error: MetaMask EncryptionPublicKey: User denied message EncryptionPublicKey.',
      );
    });
    it(`confirmMetamaskEncryptionPublicKeyRequest should confirm public encryption key request`, () => {
      cy.get('#getEncryptionKeyButton').click();
      cy.confirmMetamaskEncryptionPublicKeyRequest().then(confirmed => {
        expect(confirmed).to.be.true;
      });
      cy.get('#encryptionKeyDisplay').contains(
        'mtrHp1WHZM9rxF2Ilot9Hie5XmQcKCf7oDQ1DpGkTSI=',
      );
    });
    it(`confirmMetamaskDecryptionRequest should confirm request to decrypt message with private key`, () => {
      cy.get('#encryptMessageInput').type('test message');
      cy.get('#encryptButton').click();
      cy.get('#ciphertextDisplay').contains('0x7');
      cy.get('#decryptButton').click();
      cy.confirmMetamaskDecryptionRequest().then(confirmed => {
        expect(confirmed).to.be.true;
      });
      cy.get('#cleartextDisplay').contains('test message');
    });
    it(`rejectMetamaskDecryptionRequest should reject request to decrypt message with private key`, () => {
      cy.get('#decryptButton').click();
      cy.rejectMetamaskDecryptionRequest().then(rejected => {
        expect(rejected).to.be.true;
      });
      cy.get('#cleartextDisplay').contains(
        'Error: MetaMask Decryption: User denied message decryption.',
      );
    });
    it(`rejectMetamaskSignatureRequest should reject signature request`, () => {
      cy.get('#personalSign').click();
      cy.rejectMetamaskSignatureRequest().then(rejected => {
        expect(rejected).to.be.true;
      });
      cy.get('#personalSign').contains('User denied message signature');
    });
    it(`rejectMetamaskDataSignatureRequest should confirm data signature request`, () => {
      cy.get('#signTypedDataV4').click();
      cy.rejectMetamaskDataSignatureRequest().then(rejected => {
        expect(rejected).to.be.true;
      });
      cy.get('#signTypedDataV4Result').contains(
        'User denied message signature',
      );
    });
    it(`rejectMetamaskTransaction should reject transaction`, () => {
      if (Cypress.env('USE_ANVIL')) {
        cy.changeMetamaskNetwork('anvil');
        cy.importMetamaskAccount(
          // don't worry my friend, this is just fourth private key from:
          // 'test test test test test test test test test test test junk'
          '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97',
          //0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f
        );
      } else {
        cy.importMetamaskAccount(Cypress.env('PRIVATE_KEY_WITH_FUNDS'));
      }
      cy.get('#requestPermissions').click();
      cy.acceptMetamaskAccess();
      cy.get('#createToken').click();
      cy.rejectMetamaskTransaction().then(rejected => {
        expect(rejected).to.be.true;
      });
      cy.contains('#tokenAddress', 'Creation Failed', { timeout: 60000 });
    });
    it(`confirmMetamaskTransaction should confirm legacy transaction using default settings`, () => {
      cy.get('#sendButton').click();
      cy.confirmMetamaskTransaction().then(txData => {
        expect(txData.recipientPublicAddress).to.be.not.empty;
        expect(txData.networkName).to.be.not.empty;
        expect(txData.customNonce).to.be.not.empty;
        expect(txData.confirmed).to.be.true;
      });
    });
    it(`confirmMetamaskTransaction should confirm legacy transaction using advanced gas settings`, () => {
      cy.get('#sendButton').click();
      cy.confirmMetamaskTransaction({
        gasLimit: 210000,
        gasPrice: 100,
      }).then(txData => {
        expect(txData.confirmed).to.be.true;
      });
    });
    it(`confirmMetamaskTransaction should confirm eip-1559 transaction using default settings`, () => {
      cy.get('#sendEIP1559Button').click();
      cy.confirmMetamaskTransaction().then(txData => {
        expect(txData.recipientPublicAddress).to.be.not.empty;
        expect(txData.networkName).to.be.not.empty;
        expect(txData.customNonce).to.be.not.empty;
        expect(txData.confirmed).to.be.true;
      });
    });
    it(`confirmMetamaskTransaction should confirm eip-1559 transaction using pre-defined (low, market, aggressive, site) gas settings`, () => {
      cy.get('#sendEIP1559Button').click();
      cy.confirmMetamaskTransaction('low').then(txData => {
        expect(txData.confirmed).to.be.true;
      });
      cy.get('#sendEIP1559Button').click();
      cy.confirmMetamaskTransaction('market').then(txData => {
        expect(txData.confirmed).to.be.true;
      });
      cy.get('#sendEIP1559Button').click();
      cy.confirmMetamaskTransaction('aggressive').then(txData => {
        expect(txData.confirmed).to.be.true;
      });
      cy.get('#sendEIP1559Button').click();
      cy.confirmMetamaskTransaction('site').then(txData => {
        expect(txData.confirmed).to.be.true;
      });
    });
    it(`confirmMetamaskTransaction should confirm eip-1559 transaction using advanced gas settings`, () => {
      cy.get('#sendEIP1559Button').click();
      cy.confirmMetamaskTransaction({
        gasLimit: 210000,
        baseFee: 100,
        priorityFee: 10,
      }).then(txData => {
        expect(txData.confirmed).to.be.true;
      });
    });
    it(`confirmMetamaskTransaction should confirm transaction for token creation (contract deployment) and check tx data`, () => {
      cy.get('#createToken').click();
      cy.confirmMetamaskTransaction().then(txData => {
        // todo: enable after confirmmetamasktx is fixed for multicall func
        // expect(txData.origin).to.be.not.empty;
        // expect(txData.bytes).to.be.not.empty;
        // expect(txData.hexData).to.be.not.empty;
        expect(txData.networkName).to.be.not.empty;
        expect(txData.customNonce).to.be.not.empty;
        expect(txData.confirmed).to.be.true;
      });
      cy.contains('#tokenAddress', /0x.*/, { timeout: 60000 })
        .invoke('text')
        .then(text => cy.log('Token hash: ' + text));
    });
    it(`rejectMetamaskAddToken should cancel importing a token`, () => {
      cy.get('#watchAsset').click();
      cy.rejectMetamaskAddToken().then(rejected => {
        expect(rejected).to.be.true;
      });
    });
    it(`confirmMetamaskAddToken should confirm importing a token`, () => {
      cy.get('#watchAsset').click();
      cy.confirmMetamaskAddToken().then(confirmed => {
        expect(confirmed).to.be.true;
      });
    });
    it(`importMetamaskToken should import token to metamask`, () => {
      const USDCContractAddressOnSepolia =
        '0xda9d4f9b69ac6C22e444eD9aF0CfC043b7a7f53f';
      cy.importMetamaskToken(USDCContractAddressOnSepolia).then(tokenData => {
        expect(tokenData.tokenContractAddress).to.be.equal(
          USDCContractAddressOnSepolia,
        );
        expect(tokenData.tokenSymbol).to.be.equal('USDC');
        expect(tokenData.tokenDecimals).to.be.equal('6');
        expect(tokenData.imported).to.be.true;
      });
    });
    it(`importMetamaskToken should import token to metamask using advanced token settings`, () => {
      const tDAIContractAddressOnSepolia =
        '0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0';
      cy.importMetamaskToken({
        address: tDAIContractAddressOnSepolia,
        symbol: 'IADt',
      }).then(tokenData => {
        expect(tokenData.tokenContractAddress).to.be.equal(
          tDAIContractAddressOnSepolia,
        );
        expect(tokenData.tokenSymbol).to.be.equal('IADt');
        expect(tokenData.tokenDecimals).to.be.equal('18');
        expect(tokenData.imported).to.be.true;
      });
    });
    it(`rejectMetamaskPermissionToSpend should reject permission to spend token`, () => {
      cy.get('#approveTokens').click();
      cy.rejectMetamaskPermissionToSpend().then(rejected => {
        expect(rejected).to.be.true;
      });
    });
    it(`confirmMetamaskPermissionToSpend should approve permission to spend token`, () => {
      cy.get('#approveTokens').click();
      cy.confirmMetamaskPermissionToSpend().then(approved => {
        expect(approved).to.be.true;
      });
    });
    // todo: this feature is broken inside test-dapp, needs to be fixed (unable to switch to DAI chain)
    it.skip(`rejectMetamaskToAddNetwork should reject permission to add network`, () => {
      cy.get('#addEthereumChain').click();
      cy.rejectMetamaskToAddNetwork().then(rejected => {
        expect(rejected).to.be.true;
      });
    });
    it.skip(`allowMetamaskToAddNetwork should approve permission to add network`, () => {
      cy.get('#addEthereumChain').click();
      cy.allowMetamaskToAddNetwork('close').then(approved => {
        expect(approved).to.be.true;
      });
    });
    it.skip(`rejectMetamaskToSwitchNetwork should reject permission to switch network`, () => {
      cy.rejectMetamaskToSwitchNetwork().then(rejected => {
        expect(rejected).to.be.true;
      });
    });
    it.skip(`allowMetamaskToSwitchNetwork should approve permission to switch network`, () => {
      cy.get('#switchEthereumChain').click();
      cy.allowMetamaskToSwitchNetwork().then(approved => {
        expect(approved).to.be.true;
      });
    });
  });
});
