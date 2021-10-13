import '@testing-library/cypress/add-commands';
import 'cypress-wait-until';

// puppeteer commands

Cypress.Commands.add('initPuppeteer', () => {
  return cy.task('initPuppeteer');
});

Cypress.Commands.add('assignWindows', () => {
  return cy.task('assignWindows');
});

// metamask commands

Cypress.Commands.add('addMetamaskNetwork', network => {
  return cy.task('addMetamaskNetwork', network);
});

Cypress.Commands.add('changeMetamaskNetwork', network => {
  return cy.task('changeMetamaskNetwork', network);
});

Cypress.Commands.add('importMetamaskAccount', privateKey => {
  return cy.task('importMetamaskAccount', privateKey);
});

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

Cypress.Commands.add('activateCustomNonceInMetamask', () => {
  return cy.task('activateCustomNonceInMetamask');
});

Cypress.Commands.add('resetMetamaskAccount', () => {
  return cy.task('resetMetamaskAccount');
});

Cypress.Commands.add('disconnectMetamaskWalletFromDapp', () => {
  return cy.task('disconnectMetamaskWalletFromDapp');
});

Cypress.Commands.add('disconnectMetamaskWalletFromAllDapps', () => {
  return cy.task('disconnectMetamaskWalletFromAllDapps');
});

Cypress.Commands.add('confirmMetamaskSignatureRequest', () => {
  return cy.task('confirmMetamaskSignatureRequest');
});

Cypress.Commands.add('rejectMetamaskSignatureRequest', () => {
  return cy.task('rejectMetamaskSignatureRequest');
});

Cypress.Commands.add('confirmMetamaskPermissionToSpend', () => {
  return cy.task('confirmMetamaskPermissionToSpend');
});

Cypress.Commands.add('rejectMetamaskPermissionToSpend', () => {
  return cy.task('rejectMetamaskPermissionToSpend');
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
  (secretWordsOrPrivateKey, network, password = 'Tester@1234') => {
    return cy.task('setupMetamask', {
      secretWordsOrPrivateKey,
      network,
      password,
    });
  },
);

Cypress.Commands.add('getNetwork', () => {
  return cy.task('getNetwork');
});

// SNX commands

Cypress.Commands.add(
  'snxExchangerSettle',
  (asset, walletAddress, privateKey) => {
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

// etherscan commands

Cypress.Commands.add('etherscanGetTransactionStatus', txid => {
  return cy.task('etherscanGetTransactionStatus', { txid }, { timeout: 30000 });
});

Cypress.Commands.add('etherscanWaitForTxSuccess', txid => {
  return cy.task('etherscanWaitForTxSuccess', { txid }, { timeout: 120000 });
});

// helper commands

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

Cypress.Commands.add('waitForResources', (resources = []) => {
  const globalTimeout = 30000;
  const resourceCheckInterval = 2000;
  const idleTimesInit = 3;
  let idleTimes = idleTimesInit;
  let resourcesLengthPrevious;
  let timeout;

  return new Cypress.Promise((resolve, reject) => {
    const checkIfResourcesLoaded = () => {
      const resourcesLoaded = cy
        .state('window')
        .performance.getEntriesByType('resource')
        .filter(r => !['script', 'xmlhttprequest'].includes(r.initiatorType));

      const allFilesFound = resources.every(resource => {
        const found = resourcesLoaded.filter(resourceLoaded => {
          return resourceLoaded.name.includes(resource.name);
        });
        if (found.length === 0) {
          return false;
        }
        return !resource.number || found.length >= resource.number;
      });

      if (allFilesFound) {
        if (resourcesLoaded.length === resourcesLengthPrevious) {
          idleTimes--;
        } else {
          idleTimes = idleTimesInit;
          resourcesLengthPrevious = resourcesLoaded.length;
        }
      }
      if (!idleTimes) {
        resolve();
        return;
      }

      timeout = setTimeout(checkIfResourcesLoaded, resourceCheckInterval);
    };

    checkIfResourcesLoaded();
    setTimeout(() => {
      reject();
      clearTimeout(timeout);
    }, globalTimeout);
  });
});

// overwrite default cypress commands
if (!process.env.SKIP_RESOURCES_WAIT) {
  Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
    originalFn(url, options);
    return cy.waitForResources();
  });
}
