import '@testing-library/cypress/add-commands';
import 'cypress-wait-until';

// puppeteer commands

Cypress.Commands.add('initPuppeteer', () => {
  return cy.task('initPuppeteer');
});

Cypress.Commands.add('assignWindows', () => {
  return cy.task('assignWindows');
});

Cypress.Commands.add('assignActiveTabName', tabName => {
  return cy.task('assignActiveTabName', tabName);
});

Cypress.Commands.add('isMetamaskWindowActive', () => {
  return cy.task('isMetamaskWindowActive');
});

Cypress.Commands.add('isCypressWindowActive', () => {
  return cy.task('isCypressWindowActive');
});

Cypress.Commands.add('switchToCypressWindow', () => {
  return cy.task('switchToCypressWindow');
});

Cypress.Commands.add('switchToMetamaskWindow', () => {
  return cy.task('switchToMetamaskWindow');
});

Cypress.Commands.add('switchToMetamaskNotification', () => {
  return cy.task('switchToMetamaskNotification');
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

Cypress.Commands.add('createMetamaskAccount', accountName => {
  return cy.task('createMetamaskAccount', accountName);
});

Cypress.Commands.add('switchMetamaskAccount', accountNameOrAccountNumber => {
  return cy.task('switchMetamaskAccount', accountNameOrAccountNumber);
});

Cypress.Commands.add('getMetamaskWalletAddress', () => {
  cy.task('getMetamaskWalletAddress').then(address => {
    return address;
  });
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

Cypress.Commands.add('confirmMetamaskSignTypedData', () => {
  return cy.task('confirmMetamaskSignTypedData');
});

Cypress.Commands.add('confirmMetamaskEncryptionPublicKeyRequest', () => {
  return cy.task('confirmMetamaskEncryptionPublicKeyRequest');
});

Cypress.Commands.add('rejectMetamaskEncryptionPublicKeyRequest', () => {
  return cy.task('rejectMetamaskEncryptionPublicKeyRequest');
});

Cypress.Commands.add('confirmMetamaskDecryptionRequest', () => {
  return cy.task('confirmMetamaskDecryptionRequest');
});

Cypress.Commands.add('rejectMetamaskDecryptionRequest', () => {
  return cy.task('rejectMetamaskDecryptionRequest');
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

Cypress.Commands.add('acceptMetamaskAccess', allAccounts => {
  return cy.task('acceptMetamaskAccess', allAccounts);
});

Cypress.Commands.add('confirmMetamaskTransaction', gasConfig => {
  return cy.task('confirmMetamaskTransaction', gasConfig);
});

Cypress.Commands.add('rejectMetamaskTransaction', () => {
  return cy.task('rejectMetamaskTransaction');
});

Cypress.Commands.add('allowMetamaskToAddNetwork', () => {
  return cy.task('allowMetamaskToAddNetwork');
});

Cypress.Commands.add('rejectMetamaskToAddNetwork', () => {
  return cy.task('rejectMetamaskToAddNetwork');
});

Cypress.Commands.add('allowMetamaskToSwitchNetwork', () => {
  return cy.task('allowMetamaskToSwitchNetwork');
});

Cypress.Commands.add('rejectMetamaskToSwitchNetwork', () => {
  return cy.task('rejectMetamaskToSwitchNetwork');
});

Cypress.Commands.add('allowMetamaskToAddAndSwitchNetwork', () => {
  return cy.task('allowMetamaskToAddAndSwitchNetwork');
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
if (!Cypress.env('SKIP_RESOURCES_WAIT')) {
  Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
    originalFn(url, options);
    return cy.waitForResources();
  });
}

Cypress.Commands.add(
  'topIsWithinViewport',
  { prevSubject: true },
  (subject, viewportWidth = Cypress.config(`viewportWidth`)) => {
    const bounding = subject[0].getBoundingClientRect();

    const rightBoundOfWindow = viewportWidth;
    const boundingRightLessThanOrEqualRightBoundOfWindow =
      bounding.right <= rightBoundOfWindow;

    expect(bounding.top).to.be.at.least(0);
    expect(bounding.left).to.be.at.least(0);
    // todo: lessThanOrEqual doesn't seem to work
    expect(boundingRightLessThanOrEqualRightBoundOfWindow).to.be.true;

    return subject;
  },
);

Cypress.Commands.add(
  'isWithinViewport',
  { prevSubject: true },
  (
    subject,
    viewportWidth = Cypress.config(`viewportWidth`),
    viewportHeight = Cypress.config(`viewportHeight`),
  ) => {
    const bounding = subject[0].getBoundingClientRect();

    const rightBoundOfWindow = viewportWidth;
    const boundingRightLessThanOrEqualRightBoundOfWindow =
      bounding.right <= rightBoundOfWindow;
    const bottomBoundOfWindow = viewportHeight;
    const boundingBottomLessThanOrEqualBottomBoundOfWindow =
      bounding.bottom <= bottomBoundOfWindow;

    expect(bounding.top).to.be.at.least(0);
    expect(bounding.left).to.be.at.least(0);
    // todo: lessThanOrEqual doesn't seem to work
    expect(boundingRightLessThanOrEqualRightBoundOfWindow).to.be.true;
    expect(boundingBottomLessThanOrEqualBottomBoundOfWindow).to.be.true;

    return subject;
  },
);
