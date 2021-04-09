import '@testing-library/cypress/add-commands';
import 'cypress-wait-until';

Cypress.Commands.add('initPuppeteer', () => {
  return cy.task('initPuppeteer');
});

Cypress.Commands.add('assignWindows', () => {
  return cy.task('assignWindows');
});

Cypress.Commands.add('confirmMetamaskWelcomePage', () => {
  return cy.task('confirmMetamaskWelcomePage');
});

Cypress.Commands.add(
  'importMetamaskWallet',
  (secretWords = process.env.SECRET_WORDS, password = 'Tester@1234') => {
    return cy.task('importMetamaskWallet', { secretWords, password });
  },
);

Cypress.Commands.add(
  'addMetamaskNetwork',
  (
    network = {
      networkName: process.env.NETWORK_NAME,
      rpcUrl: process.env.RPC_URL,
      chainId: process.env.CHAIN_ID,
      symbol: process.env.SYMBOL,
      blockExplorer: process.env.BLOCK_EXPLORER,
      isTestnet: process.env.IS_TESTNET,
    },
  ) => {
    return cy.task('addMetamaskNetwork', network);
  },
);

Cypress.Commands.add(
  'changeMetamaskNetwork',
  (network = process.env.NETWORK_NAME) => {
    return cy.task('changeMetamaskNetwork', network);
  },
);

Cypress.Commands.add('getMetamaskWalletAddress', () => {
  cy.task('getMetamaskWalletAddress').then(address => {
    return address;
  });
});

Cypress.Commands.add('switchToCypressWindow', () => {
  return cy.task('switchToCypressWindow');
});

Cypress.Commands.add('switchToMetamaskWindow', () => {
  return cy.task('switchToMetamaskWindow');
});

Cypress.Commands.add('acceptMetamaskAccess', () => {
  return cy.task('acceptMetamaskAccess');
});

Cypress.Commands.add('confirmMetamaskTransaction', () => {
  return cy.task('confirmMetamaskTransaction');
});

Cypress.Commands.add('rejectMetamaskTransaction', () => {
  return cy.task('rejectMetamaskTransaction');
});

Cypress.Commands.add('switchToMetamaskNotification', () => {
  return cy.task('switchToMetamaskNotification');
});

Cypress.Commands.add('unlockMetamask', (password = 'Tester@1234') => {
  return cy.task('unlockMetamask', password);
});

Cypress.Commands.add('fetchMetamaskWalletAddress', () => {
  cy.task('fetchMetamaskWalletAddress').then(address => {
    return address;
  });
});

Cypress.Commands.add(
  'setupMetamask',
  (
    secretWords,
    network = process.env.NETWORK_NAME,
    password = 'Tester@1234',
  ) => {
    return cy.task('setupMetamask', { secretWords, network, password });
  },
);

Cypress.Commands.add(
  'snxExchangerSettle',
  (asset, walletAddress, privateKey = process.env.PRIVATE_KEY) => {
    return cy.task(
      'snxExchangerSettle',
      { asset, walletAddress, privateKey },
      { timeout: 300000 },
    );
  },
);

Cypress.Commands.add('snxCheckWaitingPeriod', (asset, walletAddress) => {
  return cy.task(
    'snxCheckWaitingPeriod',
    { asset, walletAddress },
    { timeout: 200000 },
  );
});

Cypress.Commands.add('getNetwork', () => {
  return cy.task('getNetwork');
});

Cypress.Commands.add('getDesktopSizes', () => {
  return [
    [1366, 768],
    [1920, 1080],
    [1536, 864],
    [1440, 900],
    [1280, 720],
    [1600, 900],
  ];
});

Cypress.Commands.add('getTabletSizes', () => {
  return [
    [768, 1024],
    [1024, 768],
    [1280, 800],
    [800, 1280],
    [601, 962],
    [962, 601],
    [600, 1024],
    [1024, 600],
  ];
});

Cypress.Commands.add('getMobileSizes', () => {
  return [
    [360, 640],
    [640, 360],
    [375, 667],
    [667, 375],
    [414, 896],
    [896, 414],
    [360, 780],
    [780, 360],
    [360, 760],
    [760, 360],
    [375, 812],
    [812, 375],
  ];
});
