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

Cypress.Commands.add('isBlankWindowActive', () => {
  return cy.task('isBlankWindowActive');
});

Cypress.Commands.add('isCypressWindowActive', () => {
  return cy.task('isCypressWindowActive');
});

Cypress.Commands.add('switchToCypressWindow', () => {
  return cy.task('switchToCypressWindow');
});

Cypress.Commands.add('switchToBlankWindow', () => {
  return cy.task('switchToBlankWindow');
});

Cypress.Commands.add('switchToBlankNotification', () => {
  return cy.task('switchToBlankNotification');
});

// metamask commands

Cypress.Commands.add('addBlankNetwork', network => {
  return cy.task('addBlankNetwork', network);
});

Cypress.Commands.add('changeBlankNetwork', network => {
  return cy.task('changeBlankNetwork', network);
});

Cypress.Commands.add('importBlankAccount', privateKey => {
  return cy.task('importBlankAccount', privateKey);
});

Cypress.Commands.add('createBlankAccount', accountName => {
  return cy.task('createBlankAccount', accountName);
});

Cypress.Commands.add('getBlankAccountName', () => {
  return cy.task('getBlankAccountName');
});

Cypress.Commands.add('switchBlankAccount', accountNameOrAccountNumber => {
  return cy.task('switchBlankAccount', accountNameOrAccountNumber);
});

Cypress.Commands.add('getLastTransactionId', () => {
  return cy.task('getLastTransactionId');
});

Cypress.Commands.add('sendTransaction', (accountName, amount = 0.1) => {
  return cy.task('sendTransaction', accountName, amount);
});

Cypress.Commands.add('getBlankWalletAddress', () => {
  cy.task('getBlankWalletAddress').then(address => {
    return address;
  });
});

Cypress.Commands.add('activateCustomNonceInBlank', () => {
  return cy.task('activateCustomNonceInBlank');
});

Cypress.Commands.add('resetBlankAccount', () => {
  return cy.task('resetBlankAccount');
});

Cypress.Commands.add('disconnectBlankWalletFromDapp', () => {
  return cy.task('disconnectBlankWalletFromDapp');
});

Cypress.Commands.add('disconnectBlankWalletFromAllDapps', () => {
  return cy.task('disconnectBlankWalletFromAllDapps');
});

Cypress.Commands.add('confirmBlankSignatureRequest', () => {
  return cy.task('confirmBlankSignatureRequest');
});

Cypress.Commands.add('rejectBlankSignatureRequest', () => {
  return cy.task('rejectBlankSignatureRequest');
});

Cypress.Commands.add('confirmBlankPermissionToSpend', () => {
  return cy.task('confirmBlankPermissionToSpend');
});

Cypress.Commands.add('rejectBlankPermissionToSpend', () => {
  return cy.task('rejectBlankPermissionToSpend');
});

Cypress.Commands.add('acceptBlankAccess', () => {
  return cy.task('acceptBlankAccess');
});

Cypress.Commands.add('confirmBlankTransaction', gasConfig => {
  return cy.task('confirmBlankTransaction', gasConfig);
});

Cypress.Commands.add('rejectBlankTransaction', () => {
  return cy.task('rejectBlankTransaction');
});

Cypress.Commands.add('allowBlankToAddNetwork', () => {
  return cy.task('allowBlankToAddNetwork');
});

Cypress.Commands.add('rejectBlankToAddNetwork', () => {
  return cy.task('rejectBlankToAddNetwork');
});

Cypress.Commands.add('allowBlankToSwitchNetwork', () => {
  return cy.task('allowBlankToSwitchNetwork');
});

Cypress.Commands.add('rejectBlankToSwitchNetwork', () => {
  return cy.task('rejectBlankToSwitchNetwork');
});

Cypress.Commands.add('allowBlankToAddAndSwitchNetwork', () => {
  return cy.task('allowBlankToAddAndSwitchNetwork');
});

Cypress.Commands.add('unlockBlank', (password = 'Tester@1234') => {
  return cy.task('unlockBlank', password);
});

Cypress.Commands.add('fetchBlankWalletAddress', () => {
  cy.task('fetchBlankWalletAddress').then(address => {
    return address;
  });
});

Cypress.Commands.add(
  'setupBlank',
  (secretWordsOrPrivateKey, network, password = 'Tester@1234') => {
    return cy.task('setupBlank', {
      secretWordsOrPrivateKey,
      network,
      password,
    });
  },
);

Cypress.Commands.add('getNetwork', () => {
  return cy.task('getNetwork');
});
Cypress.Commands.add('getCurrentNetwork', () => {
  return cy.task('getConfiguredNetwork');
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
Cypress.Commands.add('etherscanGetTransactionStatus', ({ txid }) => {
  return cy.task('etherscanGetTransactionStatus', { txid }, { timeout: 30000 });
});

Cypress.Commands.add('etherscanWaitForTxSuccess', ({ txid }) => {
  return cy.task('etherscanWaitForTxSuccess', { txid }, { timeout: 120000 });
});

Cypress.Commands.add('etherscanGetAccountTransactions', accountAddress => {
  return cy.task('etherscanGetAccountTransactions', accountAddress, {
    timeout: 30000,
  });
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
