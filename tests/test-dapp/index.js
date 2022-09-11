import MetaMaskOnboarding from '@metamask/onboarding';
// eslint-disable-next-line camelcase
import {
  encrypt,
  recoverPersonalSignature,
  recoverTypedSignatureLegacy,
  recoverTypedSignature,
  recoverTypedSignature_v4 as recoverTypedSignatureV4,
} from 'eth-sig-util';
import { ethers } from 'ethers';
import { toChecksumAddress } from 'ethereumjs-util';
import {
  hstBytecode,
  hstAbi,
  piggybankBytecode,
  piggybankAbi,
  collectiblesAbi,
  collectiblesBytecode,
  failingContractAbi,
  failingContractBytecode,
} from './constants.json';

let ethersProvider;
let hstFactory;
let piggybankFactory;
let collectiblesFactory;
let failingContractFactory;
let hstContract;
let piggybankContract;
let collectiblesContract;
let failingContract;

const currentUrl = new URL(window.location.href);
const forwarderOrigin =
  currentUrl.hostname === 'localhost' ? 'http://localhost:9010' : undefined;
const urlSearchParams = new URLSearchParams(window.location.search);
const deployedContractAddress = urlSearchParams.get('contract');

const { isMetaMaskInstalled } = MetaMaskOnboarding;

// Dapp Status Section
const networkDiv = document.getElementById('network');
const chainIdDiv = document.getElementById('chainId');
const accountsDiv = document.getElementById('accounts');
const warningDiv = document.getElementById('warning');

// Basic Actions Section
const onboardButton = document.getElementById('connectButton');
const getAccountsButton = document.getElementById('getAccounts');
const getAccountsResults = document.getElementById('getAccountsResult');

// Permissions Actions Section
const requestPermissionsButton = document.getElementById('requestPermissions');
const getPermissionsButton = document.getElementById('getPermissions');
const permissionsResult = document.getElementById('permissionsResult');

// Contract Section
const deployButton = document.getElementById('deployButton');
const depositButton = document.getElementById('depositButton');
const withdrawButton = document.getElementById('withdrawButton');
const contractStatus = document.getElementById('contractStatus');
const deployFailingButton = document.getElementById('deployFailingButton');
const sendFailingButton = document.getElementById('sendFailingButton');
const failingContractStatus = document.getElementById('failingContractStatus');

// Collectibles Section
const deployCollectiblesButton = document.getElementById(
  'deployCollectiblesButton',
);
const mintButton = document.getElementById('mintButton');
const mintAmountInput = document.getElementById('mintAmountInput');
const approveTokenInput = document.getElementById('approveTokenInput');
const approveButton = document.getElementById('approveButton');
const setApprovalForAllButton = document.getElementById(
  'setApprovalForAllButton',
);
const transferTokenInput = document.getElementById('transferTokenInput');
const transferFromButton = document.getElementById('transferFromButton');
const collectiblesStatus = document.getElementById('collectiblesStatus');

// Send Eth Section
const sendButton = document.getElementById('sendButton');
const sendEIP1559Button = document.getElementById('sendEIP1559Button');

// Send Tokens Section
const decimalUnits = 4;
const tokenSymbol = 'TST';
const tokenAddress = document.getElementById('tokenAddress');
const createToken = document.getElementById('createToken');
const watchAsset = document.getElementById('watchAsset');
const transferTokens = document.getElementById('transferTokens');
const approveTokens = document.getElementById('approveTokens');
const transferTokensWithoutGas = document.getElementById(
  'transferTokensWithoutGas',
);
const approveTokensWithoutGas = document.getElementById(
  'approveTokensWithoutGas',
);

// Encrypt / Decrypt Section
const getEncryptionKeyButton = document.getElementById(
  'getEncryptionKeyButton',
);
const encryptMessageInput = document.getElementById('encryptMessageInput');
const encryptButton = document.getElementById('encryptButton');
const decryptButton = document.getElementById('decryptButton');
const encryptionKeyDisplay = document.getElementById('encryptionKeyDisplay');
const ciphertextDisplay = document.getElementById('ciphertextDisplay');
const cleartextDisplay = document.getElementById('cleartextDisplay');

// Ethereum Signature Section
const ethSign = document.getElementById('ethSign');
const ethSignResult = document.getElementById('ethSignResult');
const personalSign = document.getElementById('personalSign');
const personalSignResult = document.getElementById('personalSignResult');
const personalSignVerify = document.getElementById('personalSignVerify');
const personalSignVerifySigUtilResult = document.getElementById(
  'personalSignVerifySigUtilResult',
);
const personalSignVerifyECRecoverResult = document.getElementById(
  'personalSignVerifyECRecoverResult',
);
const signTypedData = document.getElementById('signTypedData');
const signTypedDataResult = document.getElementById('signTypedDataResult');
const signTypedDataVerify = document.getElementById('signTypedDataVerify');
const signTypedDataVerifyResult = document.getElementById(
  'signTypedDataVerifyResult',
);
const signTypedDataV3 = document.getElementById('signTypedDataV3');
const signTypedDataV3Result = document.getElementById('signTypedDataV3Result');
const signTypedDataV3Verify = document.getElementById('signTypedDataV3Verify');
const signTypedDataV3VerifyResult = document.getElementById(
  'signTypedDataV3VerifyResult',
);
const signTypedDataV4 = document.getElementById('signTypedDataV4');
const signTypedDataV4Result = document.getElementById('signTypedDataV4Result');
const signTypedDataV4Verify = document.getElementById('signTypedDataV4Verify');
const signTypedDataV4VerifyResult = document.getElementById(
  'signTypedDataV4VerifyResult',
);

// Send form section
const fromDiv = document.getElementById('fromInput');
const toDiv = document.getElementById('toInput');
const type = document.getElementById('typeInput');
const amount = document.getElementById('amountInput');
const gasPrice = document.getElementById('gasInput');
const maxFee = document.getElementById('maxFeeInput');
const maxPriority = document.getElementById('maxPriorityFeeInput');
const data = document.getElementById('dataInput');
const gasPriceDiv = document.getElementById('gasPriceDiv');
const maxFeeDiv = document.getElementById('maxFeeDiv');
const maxPriorityDiv = document.getElementById('maxPriorityDiv');
const submitFormButton = document.getElementById('submitForm');

// Miscellaneous
const addEthereumChain = document.getElementById('addEthereumChain');
const switchEthereumChain = document.getElementById('switchEthereumChain');

const initialize = async () => {
  try {
    // We must specify the network as 'any' for ethers to allow network changes
    ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    if (deployedContractAddress) {
      hstContract = new ethers.Contract(
        deployedContractAddress,
        hstAbi,
        ethersProvider.getSigner(),
      );
      piggybankContract = new ethers.Contract(
        deployedContractAddress,
        piggybankAbi,
        ethersProvider.getSigner(),
      );
      collectiblesContract = new ethers.Contract(
        deployedContractAddress,
        collectiblesAbi,
        ethersProvider.getSigner(),
      );
      failingContract = new ethers.Contract(
        deployedContractAddress,
        failingContractAbi,
        ethersProvider.getSigner(),
      );
    }
    hstFactory = new ethers.ContractFactory(
      hstAbi,
      hstBytecode,
      ethersProvider.getSigner(),
    );
    piggybankFactory = new ethers.ContractFactory(
      piggybankAbi,
      piggybankBytecode,
      ethersProvider.getSigner(),
    );
    collectiblesFactory = new ethers.ContractFactory(
      collectiblesAbi,
      collectiblesBytecode,
      ethersProvider.getSigner(),
    );
    failingContractFactory = new ethers.ContractFactory(
      failingContractAbi,
      failingContractBytecode,
      ethersProvider.getSigner(),
    );
  } catch (error) {
    console.error(error);
  }

  let onboarding;
  try {
    onboarding = new MetaMaskOnboarding({ forwarderOrigin });
  } catch (error) {
    console.error(error);
  }

  let accounts;
  let accountButtonsInitialized = false;

  const accountButtons = [
    deployButton,
    depositButton,
    withdrawButton,
    deployCollectiblesButton,
    mintButton,
    mintAmountInput,
    approveTokenInput,
    approveButton,
    setApprovalForAllButton,
    transferTokenInput,
    transferFromButton,
    deployFailingButton,
    sendFailingButton,
    sendButton,
    createToken,
    watchAsset,
    transferTokens,
    approveTokens,
    transferTokensWithoutGas,
    approveTokensWithoutGas,
    getEncryptionKeyButton,
    encryptMessageInput,
    encryptButton,
    decryptButton,
    ethSign,
    personalSign,
    personalSignVerify,
    signTypedData,
    signTypedDataVerify,
    signTypedDataV3,
    signTypedDataV3Verify,
    signTypedDataV4,
    signTypedDataV4Verify,
  ];

  const isMetaMaskConnected = () => accounts && accounts.length > 0;

  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress';
    onboardButton.disabled = true;
    onboarding.startOnboarding();
  };

  const onClickConnect = async () => {
    try {
      const newAccounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      handleNewAccounts(newAccounts);
    } catch (error) {
      console.error(error);
    }
  };

  const clearTextDisplays = () => {
    encryptionKeyDisplay.innerText = '';
    encryptMessageInput.value = '';
    ciphertextDisplay.innerText = '';
    cleartextDisplay.innerText = '';
  };

  const updateButtons = () => {
    const accountButtonsDisabled =
      !isMetaMaskInstalled() || !isMetaMaskConnected();
    if (accountButtonsDisabled) {
      for (const button of accountButtons) {
        button.disabled = true;
      }
      clearTextDisplays();
    } else {
      deployButton.disabled = false;
      deployCollectiblesButton.disabled = false;
      sendButton.disabled = false;
      deployFailingButton.disabled = false;
      createToken.disabled = false;
      personalSign.disabled = false;
      signTypedData.disabled = false;
      getEncryptionKeyButton.disabled = false;
      ethSign.disabled = false;
      personalSign.disabled = false;
      signTypedData.disabled = false;
      signTypedDataV3.disabled = false;
      signTypedDataV4.disabled = false;
    }

    if (isMetaMaskInstalled()) {
      addEthereumChain.disabled = false;
      switchEthereumChain.disabled = false;
    } else {
      onboardButton.innerText = 'Click here to install MetaMask!';
      onboardButton.onclick = onClickInstall;
      onboardButton.disabled = false;
    }

    if (isMetaMaskConnected()) {
      onboardButton.innerText = 'Connected';
      onboardButton.disabled = true;
      if (onboarding) {
        onboarding.stopOnboarding();
      }
    } else {
      onboardButton.innerText = 'Connect';
      onboardButton.onclick = onClickConnect;
      onboardButton.disabled = false;
    }

    if (deployedContractAddress) {
      // Piggy bank contract
      contractStatus.innerHTML = 'Deployed';
      depositButton.disabled = false;
      withdrawButton.disabled = false;
      // Failing contract
      failingContractStatus.innerHTML = 'Deployed';
      sendFailingButton.disabled = false;
      // ERC721 Token - Collectibles contract
      collectiblesStatus.innerHTML = 'Deployed';
      mintButton.disabled = false;
      mintAmountInput.disabled = false;
      approveTokenInput.disabled = false;
      approveButton.disabled = false;
      setApprovalForAllButton.disabled = false;
      transferTokenInput.disabled = false;
      transferFromButton.disabled = false;
      // ERC20 Token - Send Tokens
      tokenAddress.innerHTML = hstContract.address;
      watchAsset.disabled = false;
      transferTokens.disabled = false;
      approveTokens.disabled = false;
      transferTokensWithoutGas.disabled = false;
      approveTokensWithoutGas.disabled = false;
    }
  };

  addEthereumChain.onclick = async () => {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x53a',
          rpcUrls: ['http://127.0.0.1:8546'],
          chainName: 'Localhost 8546',
          nativeCurrency: { name: 'TEST', decimals: 18, symbol: 'TEST' },
          blockExplorerUrls: null,
        },
      ],
    });
  };

  switchEthereumChain.onclick = async () => {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: '0x53a',
        },
      ],
    });
  };

  const initializeAccountButtons = () => {
    if (accountButtonsInitialized) {
      return;
    }
    accountButtonsInitialized = true;

    /**
     * Piggy bank
     */

    deployButton.onclick = async () => {
      contractStatus.innerHTML = 'Deploying';

      try {
        piggybankContract = await piggybankFactory.deploy();
        await piggybankContract.deployTransaction.wait();
      } catch (error) {
        contractStatus.innerHTML = 'Deployment Failed';
        throw error;
      }

      if (piggybankContract.address === undefined) {
        return;
      }

      console.log(
        `Contract mined! address: ${piggybankContract.address} transactionHash: ${piggybankContract.deployTransaction.hash}`,
      );
      contractStatus.innerHTML = 'Deployed';
      depositButton.disabled = false;
      withdrawButton.disabled = false;
    };

    depositButton.onclick = async () => {
      contractStatus.innerHTML = 'Deposit initiated';
      const result = await piggybankContract.deposit({
        from: accounts[0],
        value: '0x3782dace9d900000',
      });
      console.log(result);
      const receipt = await result.wait();
      console.log(receipt);
      contractStatus.innerHTML = 'Deposit completed';
    };

    withdrawButton.onclick = async () => {
      const result = await piggybankContract.withdraw('0xde0b6b3a7640000', {
        from: accounts[0],
      });
      console.log(result);
      const receipt = await result.wait();
      console.log(receipt);
      contractStatus.innerHTML = 'Withdrawn';
    };

    /**
     * Failing
     */

    deployFailingButton.onclick = async () => {
      failingContractStatus.innerHTML = 'Deploying';

      try {
        failingContract = await failingContractFactory.deploy();
        await failingContract.deployTransaction.wait();
      } catch (error) {
        failingContractStatus.innerHTML = 'Deployment Failed';
        throw error;
      }

      if (failingContract.address === undefined) {
        return;
      }

      console.log(
        `Contract mined! address: ${failingContract.address} transactionHash: ${failingContract.deployTransaction.hash}`,
      );
      failingContractStatus.innerHTML = 'Deployed';
      sendFailingButton.disabled = false;
    };

    sendFailingButton.onclick = async () => {
      try {
        const result = await ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: accounts[0],
              to: failingContract.address,
              value: '0x0',
              gasLimit: '0x5028',
              maxFeePerGas: '0x2540be400',
              maxPriorityFeePerGas: '0x3b9aca00',
            },
          ],
        });
        failingContractStatus.innerHTML =
          'Failed transaction process completed as expected.';
        console.log('send failing contract result', result);
      } catch (error) {
        console.log('error', error);
        throw error;
      }
    };

    /**
     * ERC721 Token
     */

    deployCollectiblesButton.onclick = async () => {
      collectiblesStatus.innerHTML = 'Deploying';

      try {
        collectiblesContract = await collectiblesFactory.deploy();
        await collectiblesContract.deployTransaction.wait();
      } catch (error) {
        collectiblesStatus.innerHTML = 'Deployment Failed';
        throw error;
      }

      if (collectiblesContract.address === undefined) {
        return;
      }

      console.log(
        `Contract mined! address: ${collectiblesContract.address} transactionHash: ${collectiblesContract.deployTransaction.hash}`,
      );
      collectiblesStatus.innerHTML = 'Deployed';
      mintButton.disabled = false;
      mintAmountInput.disabled = false;
    };

    mintButton.onclick = async () => {
      collectiblesStatus.innerHTML = 'Mint initiated';
      let result = await collectiblesContract.mintCollectibles(
        mintAmountInput.value,
        {
          from: accounts[0],
        },
      );
      result = await result.wait();
      console.log(result);
      collectiblesStatus.innerHTML = 'Mint completed';
      approveTokenInput.disabled = false;
      approveButton.disabled = false;
      setApprovalForAllButton.disabled = false;
      transferTokenInput.disabled = false;
      transferFromButton.disabled = false;
    };

    approveButton.onclick = async () => {
      collectiblesStatus.innerHTML = 'Approve initiated';
      let result = await collectiblesContract.approve(
        '0x9bc5baF874d2DA8D216aE9f137804184EE5AfEF4',
        approveTokenInput.value,
        {
          from: accounts[0],
        },
      );
      result = await result.wait();
      console.log(result);
      collectiblesStatus.innerHTML = 'Approve completed';
    };

    setApprovalForAllButton.onclick = async () => {
      collectiblesStatus.innerHTML = 'Set Approval For All initiated';
      let result = await collectiblesContract.setApprovalForAll(
        '0x9bc5baF874d2DA8D216aE9f137804184EE5AfEF4',
        true,
        {
          from: accounts[0],
        },
      );
      result = await result.wait();
      console.log(result);
      collectiblesStatus.innerHTML = 'Set Approval For All completed';
    };

    transferFromButton.onclick = async () => {
      collectiblesStatus.innerHTML = 'Transfer From initiated';
      let result = await collectiblesContract.transferFrom(
        accounts[0],
        '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
        transferTokenInput.value,
        {
          from: accounts[0],
        },
      );
      result = await result.wait();
      console.log(result);
      collectiblesStatus.innerHTML = 'Transfer From completed';
    };

    /**
     * Sending ETH
     */

    sendButton.onclick = async () => {
      const result = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: accounts[0],
            to: '0x0c54FcCd2e384b4BB6f2E405Bf5Cbc15a017AaFb',
            value: '0x0',
            gasLimit: '0x5028',
            gasPrice: '0x2540be400',
            type: '0x0',
          },
        ],
      });
      console.log(result);
    };

    sendEIP1559Button.onclick = async () => {
      const result = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: accounts[0],
            to: '0x0c54FcCd2e384b4BB6f2E405Bf5Cbc15a017AaFb',
            value: '0x0',
            gasLimit: '0x5028',
            maxFeePerGas: '0x2540be400',
            maxPriorityFeePerGas: '0x3b9aca00',
          },
        ],
      });
      console.log(result);
    };

    /**
     * ERC20 Token
     */

    createToken.onclick = async () => {
      const _initialAmount = 100;
      const _tokenName = 'TST';

      try {
        hstContract = await hstFactory.deploy(
          _initialAmount,
          _tokenName,
          decimalUnits,
          tokenSymbol,
        );
        await hstContract.deployTransaction.wait();
      } catch (error) {
        tokenAddress.innerHTML = 'Creation Failed';
        throw error;
      }

      if (hstContract.address === undefined) {
        return;
      }

      console.log(
        `Contract mined! address: ${hstContract.address} transactionHash: ${hstContract.deployTransaction.hash}`,
      );
      tokenAddress.innerHTML = hstContract.address;
      watchAsset.disabled = false;
      transferTokens.disabled = false;
      approveTokens.disabled = false;
      transferTokensWithoutGas.disabled = false;
      approveTokensWithoutGas.disabled = false;
    };

    watchAsset.onclick = async () => {
      const result = await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: hstContract.address,
            symbol: tokenSymbol,
            decimals: decimalUnits,
            image: 'https://metamask.github.io/test-dapp/metamask-fox.svg',
          },
        },
      });
      console.log('result', result);
    };

    transferTokens.onclick = async () => {
      const result = await hstContract.transfer(
        '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
        '15000',
        {
          from: accounts[0],
          gasLimit: 60000,
          gasPrice: '20000000000',
        },
      );
      console.log('result', result);
    };

    approveTokens.onclick = async () => {
      const result = await hstContract.approve(
        '0x9bc5baF874d2DA8D216aE9f137804184EE5AfEF4',
        '70000',
        {
          from: accounts[0],
          gasLimit: 60000,
          gasPrice: '20000000000',
        },
      );
      console.log('result', result);
    };

    transferTokensWithoutGas.onclick = async () => {
      const result = await hstContract.transfer(
        '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
        '15000',
        {
          gasPrice: '20000000000',
        },
      );
      console.log('result', result);
    };

    approveTokensWithoutGas.onclick = async () => {
      const result = await hstContract.approve(
        '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
        '70000',
        {
          gasPrice: '20000000000',
        },
      );
      console.log('result', result);
    };

    /**
     * Permissions
     */

    requestPermissionsButton.onclick = async () => {
      try {
        const permissionsArray = await ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
        permissionsResult.innerHTML =
          getPermissionsDisplayString(permissionsArray);
      } catch (err) {
        console.error(err);
        permissionsResult.innerHTML = `Error: ${err.message}`;
      }
    };

    getPermissionsButton.onclick = async () => {
      try {
        const permissionsArray = await ethereum.request({
          method: 'wallet_getPermissions',
        });
        permissionsResult.innerHTML =
          getPermissionsDisplayString(permissionsArray);
      } catch (err) {
        console.error(err);
        permissionsResult.innerHTML = `Error: ${err.message}`;
      }
    };

    getAccountsButton.onclick = async () => {
      try {
        const _accounts = await ethereum.request({
          method: 'eth_accounts',
        });
        getAccountsResults.innerHTML =
          _accounts[0] || 'Not able to get accounts';
      } catch (err) {
        console.error(err);
        getAccountsResults.innerHTML = `Error: ${err.message}`;
      }
    };

    /**
     * Encrypt / Decrypt
     */

    getEncryptionKeyButton.onclick = async () => {
      try {
        encryptionKeyDisplay.innerText = await ethereum.request({
          method: 'eth_getEncryptionPublicKey',
          params: [accounts[0]],
        });
        encryptMessageInput.disabled = false;
      } catch (error) {
        encryptionKeyDisplay.innerText = `Error: ${error.message}`;
        encryptMessageInput.disabled = true;
        encryptButton.disabled = true;
        decryptButton.disabled = true;
      }
    };

    encryptMessageInput.onkeyup = () => {
      if (
        !getEncryptionKeyButton.disabled &&
        encryptMessageInput.value.length > 0
      ) {
        if (encryptButton.disabled) {
          encryptButton.disabled = false;
        }
      } else if (!encryptButton.disabled) {
        encryptButton.disabled = true;
      }
    };

    encryptButton.onclick = () => {
      try {
        ciphertextDisplay.innerText = stringifiableToHex(
          encrypt(
            encryptionKeyDisplay.innerText,
            { data: encryptMessageInput.value },
            'x25519-xsalsa20-poly1305',
          ),
        );
        decryptButton.disabled = false;
      } catch (error) {
        ciphertextDisplay.innerText = `Error: ${error.message}`;
        decryptButton.disabled = true;
      }
    };

    decryptButton.onclick = async () => {
      try {
        cleartextDisplay.innerText = await ethereum.request({
          method: 'eth_decrypt',
          params: [ciphertextDisplay.innerText, ethereum.selectedAddress],
        });
      } catch (error) {
        cleartextDisplay.innerText = `Error: ${error.message}`;
      }
    };
  };

  type.onchange = async () => {
    if (type.value === '0x0') {
      gasPriceDiv.style.display = 'block';
      maxFeeDiv.style.display = 'none';
      maxPriorityDiv.style.display = 'none';
    } else {
      gasPriceDiv.style.display = 'none';
      maxFeeDiv.style.display = 'block';
      maxPriorityDiv.style.display = 'block';
    }
  };

  submitFormButton.onclick = async () => {
    let params;
    if (type.value === '0x0') {
      params = [
        {
          from: accounts[0],
          to: toDiv.value,
          value: amount.value,
          gasPrice: gasPrice.value,
          type: type.value,
          data: data.value,
        },
      ];
    } else {
      params = [
        {
          from: accounts[0],
          to: toDiv.value,
          value: amount.value,
          maxFeePerGas: maxFee.value,
          maxPriorityFeePerGas: maxPriority.value,
          type: type.value,
          data: data.value,
        },
      ];
    }
    const result = await ethereum.request({
      method: 'eth_sendTransaction',
      params,
    });
    console.log(result);
  };

  /**
   * eth_sign
   */
  ethSign.onclick = async () => {
    try {
      // const msg = 'Sample message to hash for signature'
      // const msgHash = keccak256(msg)
      const msg =
        '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0';
      const ethResult = await ethereum.request({
        method: 'eth_sign',
        params: [accounts[0], msg],
      });
      ethSignResult.innerHTML = JSON.stringify(ethResult);
    } catch (err) {
      console.error(err);
      ethSign.innerHTML = `Error: ${err.message}`;
    }
  };

  /**
   * Personal Sign
   */
  personalSign.onclick = async () => {
    const exampleMessage = 'Example `personal_sign` message';
    try {
      const from = accounts[0];
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
      const sign = await ethereum.request({
        method: 'personal_sign',
        params: [msg, from, 'Example password'],
      });
      personalSignResult.innerHTML = sign;
      personalSignVerify.disabled = false;
    } catch (err) {
      console.error(err);
      personalSign.innerHTML = `Error: ${err.message}`;
    }
  };

  /**
   * Personal Sign Verify
   */
  personalSignVerify.onclick = async () => {
    const exampleMessage = 'Example `personal_sign` message';
    try {
      const from = accounts[0];
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
      const sign = personalSignResult.innerHTML;
      const recoveredAddr = recoverPersonalSignature({
        data: msg,
        sig: sign,
      });
      if (recoveredAddr === from) {
        console.log(`SigUtil Successfully verified signer as ${recoveredAddr}`);
        personalSignVerifySigUtilResult.innerHTML = recoveredAddr;
      } else {
        console.log(
          `SigUtil Failed to verify signer when comparing ${recoveredAddr} to ${from}`,
        );
        console.log(`Failed comparing ${recoveredAddr} to ${from}`);
      }
      const ecRecoverAddr = await ethereum.request({
        method: 'personal_ecRecover',
        params: [msg, sign],
      });
      if (ecRecoverAddr === from) {
        console.log(`Successfully ecRecovered signer as ${ecRecoverAddr}`);
        personalSignVerifyECRecoverResult.innerHTML = ecRecoverAddr;
      } else {
        console.log(
          `Failed to verify signer when comparing ${ecRecoverAddr} to ${from}`,
        );
      }
    } catch (err) {
      console.error(err);
      personalSignVerifySigUtilResult.innerHTML = `Error: ${err.message}`;
      personalSignVerifyECRecoverResult.innerHTML = `Error: ${err.message}`;
    }
  };

  /**
   * Sign Typed Data Test
   */
  signTypedData.onclick = async () => {
    const msgParams = [
      {
        type: 'string',
        name: 'Message',
        value: 'Hi, Alice!',
      },
      {
        type: 'uint32',
        name: 'A number',
        value: '1337',
      },
    ];
    try {
      const from = accounts[0];
      const sign = await ethereum.request({
        method: 'eth_signTypedData',
        params: [msgParams, from],
      });
      signTypedDataResult.innerHTML = sign;
      signTypedDataVerify.disabled = false;
    } catch (err) {
      console.error(err);
      signTypedDataResult.innerHTML = `Error: ${err.message}`;
    }
  };

  /**
   * Sign Typed Data Verification
   */
  signTypedDataVerify.onclick = async () => {
    const msgParams = [
      {
        type: 'string',
        name: 'Message',
        value: 'Hi, Alice!',
      },
      {
        type: 'uint32',
        name: 'A number',
        value: '1337',
      },
    ];
    try {
      const from = accounts[0];
      const sign = signTypedDataResult.innerHTML;
      const recoveredAddr = await recoverTypedSignatureLegacy({
        data: msgParams,
        sig: sign,
      });
      if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from)) {
        console.log(`Successfully verified signer as ${recoveredAddr}`);
        signTypedDataVerifyResult.innerHTML = recoveredAddr;
      } else {
        console.log(
          `Failed to verify signer when comparing ${recoveredAddr} to ${from}`,
        );
      }
    } catch (err) {
      console.error(err);
      signTypedDataV3VerifyResult.innerHTML = `Error: ${err.message}`;
    }
  };

  /**
   * Sign Typed Data Version 3 Test
   */
  signTypedDataV3.onclick = async () => {
    const networkId = parseInt(networkDiv.innerHTML, 10);
    const chainId = parseInt(chainIdDiv.innerHTML, 16) || networkId;

    const msgParams = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' },
        ],
      },
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      },
      message: {
        from: {
          name: 'Cow',
          wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        },
        to: {
          name: 'Bob',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Hello, Bob!',
      },
    };
    try {
      const from = accounts[0];
      const sign = await ethereum.request({
        method: 'eth_signTypedData_v3',
        params: [from, JSON.stringify(msgParams)],
      });
      signTypedDataV3Result.innerHTML = sign;
      signTypedDataV3Verify.disabled = false;
    } catch (err) {
      console.error(err);
      signTypedDataV3Result.innerHTML = `Error: ${err.message}`;
    }
  };

  /**
   * Sign Typed Data V3 Verification
   */
  signTypedDataV3Verify.onclick = async () => {
    const networkId = parseInt(networkDiv.innerHTML, 10);
    const chainId = parseInt(chainIdDiv.innerHTML, 16) || networkId;

    const msgParams = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' },
        ],
      },
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      },
      message: {
        from: {
          name: 'Cow',
          wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        },
        to: {
          name: 'Bob',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Hello, Bob!',
      },
    };
    try {
      const from = accounts[0];
      const sign = signTypedDataV3Result.innerHTML;
      const recoveredAddr = await recoverTypedSignature({
        data: msgParams,
        sig: sign,
      });
      if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from)) {
        console.log(`Successfully verified signer as ${recoveredAddr}`);
        signTypedDataV3VerifyResult.innerHTML = recoveredAddr;
      } else {
        console.log(
          `Failed to verify signer when comparing ${recoveredAddr} to ${from}`,
        );
      }
    } catch (err) {
      console.error(err);
      signTypedDataV3VerifyResult.innerHTML = `Error: ${err.message}`;
    }
  };

  /**
   * Sign Typed Data V4
   */
  signTypedDataV4.onclick = async () => {
    const networkId = parseInt(networkDiv.innerHTML, 10);
    const chainId = parseInt(chainIdDiv.innerHTML, 16) || networkId;
    const msgParams = {
      domain: {
        chainId: chainId.toString(),
        name: 'Ether Mail',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        version: '1',
      },
      message: {
        contents: 'Hello, Bob!',
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
          ],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
          },
        ],
      },
      primaryType: 'Mail',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' },
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
        ],
      },
    };
    try {
      const from = accounts[0];
      const sign = await ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [from, JSON.stringify(msgParams)],
      });
      signTypedDataV4Result.innerHTML = sign;
      signTypedDataV4Verify.disabled = false;
    } catch (err) {
      console.error(err);
      signTypedDataV4Result.innerHTML = `Error: ${err.message}`;
    }
  };

  /**
   *  Sign Typed Data V4 Verification
   */
  signTypedDataV4Verify.onclick = async () => {
    const networkId = parseInt(networkDiv.innerHTML, 10);
    const chainId = parseInt(chainIdDiv.innerHTML, 16) || networkId;
    const msgParams = {
      domain: {
        chainId,
        name: 'Ether Mail',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        version: '1',
      },
      message: {
        contents: 'Hello, Bob!',
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
          ],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
          },
        ],
      },
      primaryType: 'Mail',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' },
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
        ],
      },
    };
    try {
      const from = accounts[0];
      const sign = signTypedDataV4Result.innerHTML;
      const recoveredAddr = recoverTypedSignatureV4({
        data: msgParams,
        sig: sign,
      });
      if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from)) {
        console.log(`Successfully verified signer as ${recoveredAddr}`);
        signTypedDataV4VerifyResult.innerHTML = recoveredAddr;
      } else {
        console.log(
          `Failed to verify signer when comparing ${recoveredAddr} to ${from}`,
        );
      }
    } catch (err) {
      console.error(err);
      signTypedDataV4VerifyResult.innerHTML = `Error: ${err.message}`;
    }
  };

  function handleNewAccounts(newAccounts) {
    accounts = newAccounts;
    accountsDiv.innerHTML = accounts;
    fromDiv.value = accounts;
    gasPriceDiv.style.display = 'block';
    maxFeeDiv.style.display = 'none';
    maxPriorityDiv.style.display = 'none';
    if (isMetaMaskConnected()) {
      initializeAccountButtons();
    }
    updateButtons();
  }

  function handleNewChain(chainId) {
    chainIdDiv.innerHTML = chainId;

    if (chainId === '0x1') {
      warningDiv.classList.remove('warning-invisible');
    } else {
      warningDiv.classList.add('warning-invisible');
    }
  }

  function handleEIP1559Support(supported) {
    if (supported && Array.isArray(accounts) && accounts.length >= 1) {
      sendEIP1559Button.disabled = false;
      sendEIP1559Button.hidden = false;
      sendButton.innerText = 'Send Legacy Transaction';
    } else {
      sendEIP1559Button.disabled = true;
      sendEIP1559Button.hidden = true;
      sendButton.innerText = 'Send';
    }
  }

  function handleNewNetwork(networkId) {
    networkDiv.innerHTML = networkId;
  }

  async function getNetworkAndChainId() {
    try {
      const chainId = await ethereum.request({
        method: 'eth_chainId',
      });
      handleNewChain(chainId);

      const networkId = await ethereum.request({
        method: 'net_version',
      });
      handleNewNetwork(networkId);

      const block = await ethereum.request({
        method: 'eth_getBlockByNumber',
        params: ['latest', false],
      });

      handleEIP1559Support(block.baseFeePerGas !== undefined);
    } catch (err) {
      console.error(err);
    }
  }

  updateButtons();

  if (isMetaMaskInstalled()) {
    ethereum.autoRefreshOnNetworkChange = false;
    getNetworkAndChainId();

    ethereum.autoRefreshOnNetworkChange = false;
    getNetworkAndChainId();

    ethereum.on('chainChanged', (chain) => {
      handleNewChain(chain);
      ethereum
        .request({
          method: 'eth_getBlockByNumber',
          params: ['latest', false],
        })
        .then((block) => {
          handleEIP1559Support(block.baseFeePerGas !== undefined);
        });
    });
    ethereum.on('chainChanged', handleNewNetwork);
    ethereum.on('accountsChanged', (newAccounts) => {
      ethereum
        .request({
          method: 'eth_getBlockByNumber',
          params: ['latest', false],
        })
        .then((block) => {
          handleEIP1559Support(block.baseFeePerGas !== undefined);
        });
      handleNewAccounts(newAccounts);
    });

    try {
      const newAccounts = await ethereum.request({
        method: 'eth_accounts',
      });
      handleNewAccounts(newAccounts);
    } catch (err) {
      console.error('Error on init when getting accounts', err);
    }
  }
};

window.addEventListener('load', initialize);

// utils

function getPermissionsDisplayString(permissionsArray) {
  if (permissionsArray.length === 0) {
    return 'No permissions found.';
  }
  const permissionNames = permissionsArray.map((perm) => perm.parentCapability);
  return permissionNames
    .reduce((acc, name) => `${acc}${name}, `, '')
    .replace(/, $/u, '');
}

function stringifiableToHex(value) {
  return ethers.utils.hexlify(Buffer.from(JSON.stringify(value)));
}
