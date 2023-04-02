import debug from 'debug';
import playwright from './playwright';
import {
  onboardingWelcomePageElements,
  metametricsPageElements,
  firstTimeFlowImportPageElements,
  revealSeedPageElements,
  endOfFlowPageElements,
  pinExtensionPageElements,
} from '../pages/metamask/first-time-flow-page';
import { mainPageElements } from '../pages/metamask/main-page';
import { unlockPageElements } from '../pages/metamask/unlock-page';
import {
  notificationPageElements,
  permissionsPageElements,
  confirmPageElements,
  signaturePageElements,
  encryptionPublicKeyPageElements,
  decryptPageElements,
  dataSignaturePageElements,
  recipientPopupElements,
  addTokenPageElements,
} from '../pages/metamask/notification-page';
import {
  settingsPageElements,
  advancedPageElements,
  experimentalSettingsPageElements,
  resetAccountModalElements,
  addNetworkPageElements,
} from '../pages/metamask/settings-page';
import { confirmationPageElements } from '../pages/metamask/confirmation-page';
import { setNetwork } from '../helpers';

const log = debug('synpress:metamask');

type Option<T> = T | undefined;

type ExtenstionUrls = Record<
  | 'extensionInitialUrl'
  | 'extensionHomeUrl'
  | 'extensionSettingsUrl'
  | 'extensionAdvancedSettingsUrl'
  | 'extensionExperimentalSettingsUrl'
  | 'extensionAddNetworkUrl'
  | 'extensionNewAccountUrl'
  | 'extensionImportAccountUrl'
  | 'extensionImportTokenUrl',
  string | undefined
>;

class MetamaskApi {
  extensionInitialUrl?: string;
  extensionId?: string;
  extensionHomeUrl?: string;
  extensionSettingsUrl?: string;
  extensionAdvancedSettingsUrl?: string;
  extensionExperimentalSettingsUrl?: string;
  extensionAddNetworkUrl?: string;
  extensionNewAccountUrl?: string;
  extensionImportAccountUrl?: string;
  extensionImportTokenUrl?: string;
  walletAddress?: string;
  switchBackToCypressWindow?: boolean;

  extensionUrls(): ExtenstionUrls {
    return {
      extensionInitialUrl: this.extensionInitialUrl,
      extensionHomeUrl: this.extensionHomeUrl,
      extensionSettingsUrl: this.extensionSettingsUrl,
      extensionAdvancedSettingsUrl: this.extensionAdvancedSettingsUrl,
      extensionExperimentalSettingsUrl: this.extensionExperimentalSettingsUrl,
      extensionAddNetworkUrl: this.extensionAddNetworkUrl,
      extensionNewAccountUrl: this.extensionNewAccountUrl,
      extensionImportAccountUrl: this.extensionImportAccountUrl,
      extensionImportTokenUrl: this.extensionImportTokenUrl,
    };
  }

  async goTo(url?: string): Promise<void> {
    if (!url) return;
    await Promise.all([
      playwright.metamaskWindow().waitForNavigation(),
      playwright.metamaskWindow().goto(url),
    ]);
    await playwright.waitUntilStable();
  }

  async goToHome(): Promise<void> {
    await this.goTo(this.extensionHomeUrl);
  }

  async goToSettings(): Promise<void> {
    await this.goTo(this.extensionSettingsUrl);
  }

  async goToAdvancedSettings(): Promise<void> {
    await this.goTo(this.extensionAdvancedSettingsUrl);
  }

  async goToExperimentalSettings(): Promise<void> {
    await this.goTo(this.extensionExperimentalSettingsUrl);
  }

  async goToAddNetwork() {
    await this.goTo(this.extensionAddNetworkUrl);
  }

  async goToNewAccount(): Promise<void> {
    await this.goTo(this.extensionNewAccountUrl);
  }

  async goToImportAccount(): Promise<void> {
    await this.goTo(this.extensionImportAccountUrl);
  }

  async goToImportToken(): Promise<void> {
    await this.goTo(this.extensionImportTokenUrl);
  }

  async getExtensionDetails(): Promise<
    Partial<
      ExtenstionUrls & {
        extensionId: string;
      }
    >
  > {
    this.extensionInitialUrl = await playwright.metamaskWindow().url();

    let extensionId = this.extensionInitialUrl?.match('//(.*?)/');
    if (extensionId) this.extensionId = extensionId[1] as string;

    this.extensionHomeUrl = `chrome-extension://${this.extensionId}/home.html`;
    this.extensionSettingsUrl = `${this.extensionHomeUrl}#settings`;
    this.extensionAdvancedSettingsUrl = `${this.extensionSettingsUrl}/advanced`;
    this.extensionExperimentalSettingsUrl = `${this.extensionSettingsUrl}/experimental`;
    this.extensionAddNetworkUrl = `${this.extensionSettingsUrl}/networks/add-network`;
    this.extensionNewAccountUrl = `${this.extensionHomeUrl}#new-account`;
    this.extensionImportAccountUrl = `${this.extensionNewAccountUrl}/import`;
    this.extensionImportTokenUrl = `${this.extensionHomeUrl}#import-token`;

    return {
      ...this.extensionUrls(),
      extensionId: this.extensionId,
    };
  }

  async closePopupAndTooltips(): Promise<boolean> {
    // note: this is required for fast execution of e2e tests to avoid flakiness
    // otherwise popup may not be detected properly and not closed
    await playwright.metamaskWindow().waitForTimeout(1000);
    if (
      await playwright
        .metamaskWindow()
        .locator(mainPageElements.popup.container)
        .isVisible()
    ) {
      const popupBackground = playwright
        .metamaskWindow()
        .locator(mainPageElements.popup.background);
      const popupBackgroundBox = await popupBackground.boundingBox();
      await playwright
        .metamaskWindow()
        .mouse.click(popupBackgroundBox.x + 1, popupBackgroundBox.y + 1);
    }
    if (
      await playwright
        .metamaskWindow()
        .locator(mainPageElements.tippyTooltip.closeButton)
        .isVisible()
    ) {
      await playwright.waitAndClick(mainPageElements.tippyTooltip.closeButton);
    }
    if (
      await playwright
        .metamaskWindow()
        .locator(mainPageElements.actionableMessage.closeButton)
        .isVisible()
    ) {
      await playwright.waitAndClick(
        mainPageElements.actionableMessage.closeButton,
      );
    }
    return true;
  }

  async closeModal(): Promise<boolean> {
    // note: this is required for fast execution of e2e tests to avoid flakiness
    // otherwise modal may not be detected properly and not closed
    await playwright.metamaskWindow().waitForTimeout(1000);
    if (
      await playwright
        .metamaskWindow()
        .locator(mainPageElements.connectedSites.modal)
        .isVisible()
    ) {
      await playwright.waitAndClick(
        mainPageElements.connectedSites.closeButton,
      );
    }
    return true;
  }

  async unlock(password: string): Promise<boolean> {
    await playwright.fixBlankPage();
    await playwright.fixCriticalError();
    await playwright.waitAndType(unlockPageElements.passwordInput, password);
    await playwright.waitAndClick(
      unlockPageElements.unlockButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await module.exports.closePopupAndTooltips();
    return true;
  }

  async optOutAnalytics(): Promise<boolean> {
    await playwright.waitAndClick(
      metametricsPageElements.optOutAnalyticsButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    return true;
  }

  async importWallet(secretWords: string, password: string): Promise<boolean> {
    await playwright.waitAndClick(
      onboardingWelcomePageElements.importWalletButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await module.exports.optOutAnalytics();
    // todo: add support for more secret words (15/18/21/24)
    for await (const [index, word] of secretWords.split(' ').entries()) {
      await playwright.waitAndType(
        firstTimeFlowImportPageElements.secretWordsInput(index),
        word,
      );
    }
    await playwright.waitAndClick(
      firstTimeFlowImportPageElements.confirmSecretRecoverPhraseButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndType(
      firstTimeFlowImportPageElements.passwordInput,
      password,
    );
    await playwright.waitAndType(
      firstTimeFlowImportPageElements.confirmPasswordInput,
      password,
    );
    await playwright.waitAndClick(
      firstTimeFlowImportPageElements.termsCheckbox,
    );
    await playwright.waitAndClick(
      firstTimeFlowImportPageElements.importButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndClick(
      endOfFlowPageElements.allDoneButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndClick(pinExtensionPageElements.nextTabButton);
    await playwright.waitAndClick(
      pinExtensionPageElements.doneButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await module.exports.closePopupAndTooltips();
    return true;
  }

  async createWallet(password: string): Promise<boolean> {
    await playwright.waitAndClick(
      onboardingWelcomePageElements.createWalletButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await module.exports.optOutAnalytics();
    await playwright.waitAndType(
      firstTimeFlowImportPageElements.passwordInput,
      password,
    );
    await playwright.waitAndType(
      firstTimeFlowImportPageElements.confirmPasswordInput,
      password,
    );
    await playwright.waitAndClick(
      firstTimeFlowImportPageElements.termsCheckbox,
    );
    await playwright.waitAndClick(
      firstTimeFlowImportPageElements.createButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndClick(revealSeedPageElements.remindLaterButton);
    await playwright.waitAndClick(revealSeedPageElements.skipBackupCheckbox);
    await playwright.waitAndClick(
      revealSeedPageElements.confirmSkipBackupButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndClick(
      endOfFlowPageElements.allDoneButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await playwright.waitAndClick(pinExtensionPageElements.nextTabButton);
    await playwright.waitAndClick(
      pinExtensionPageElements.doneButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await this.closePopupAndTooltips();
    return true;
  }

  async importAccount(privateKey: string): Promise<boolean> {
    await switchToMetamaskIfNotActive();
    await module.exports.goToImportAccount();
    await playwright.waitAndType(
      mainPageElements.importAccount.input,
      privateKey,
    );
    await playwright.waitAndClick(
      mainPageElements.importAccount.importButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await module.exports.closePopupAndTooltips();
    await switchToCypressIfNotActive();
    return true;
  }

  async createAccount(accountName: string): Promise<boolean> {
    if (accountName) accountName = accountName.toLowerCase();

    await switchToMetamaskIfNotActive();
    await module.exports.goToNewAccount();
    if (accountName) {
      await playwright.waitAndType(
        mainPageElements.createAccount.input,
        accountName,
      );
    }
    await playwright.waitAndClick(mainPageElements.createAccount.createButton);
    await module.exports.closePopupAndTooltips();
    await switchToCypressIfNotActive();
    return true;
  }

  async switchAccount(
    accountNameOrAccountNumber: string | number,
  ): Promise<boolean> {
    if (typeof accountNameOrAccountNumber === 'string') {
      accountNameOrAccountNumber = accountNameOrAccountNumber.toLowerCase();
    }
    await switchToMetamaskIfNotActive();
    // note: closePopupAndTooltips() is required after changing createAccount() to use direct urls (popup started appearing)
    // ^ this change also introduced 500ms delay for closePopupAndTooltips() function
    await module.exports.closePopupAndTooltips();
    await playwright.waitAndClick(mainPageElements.accountMenu.button);
    if (typeof accountNameOrAccountNumber === 'number') {
      await playwright.waitAndClick(
        mainPageElements.accountMenu.accountButton(accountNameOrAccountNumber),
      );
    } else {
      await playwright.waitAndClickByText(
        mainPageElements.accountMenu.accountName,
        accountNameOrAccountNumber,
      );
    }
    await module.exports.closePopupAndTooltips();
    await switchToCypressIfNotActive();
    return true;
  }

  async changeNetwork(
    network:
      | string
      | {
          networkName: string;
        },
  ): Promise<boolean> {
    await switchToMetamaskIfNotActive();
    await playwright.waitAndClick(mainPageElements.networkSwitcher.button);
    if (typeof network === 'string') {
      network = network.toLowerCase();
      if (network === 'mainnet') {
        await playwright.waitAndClick(
          mainPageElements.networkSwitcher.mainnetNetworkItem,
        );
      } else if (network === 'goerli') {
        await playwright.waitAndClick(
          mainPageElements.networkSwitcher.goerliNetworkItem,
        );
      } else if (network === 'sepolia') {
        await playwright.waitAndClick(
          mainPageElements.networkSwitcher.sepoliaNetworkItem,
        );
      } else if (network === 'localhost') {
        await playwright.waitAndClick(
          mainPageElements.networkSwitcher.localhostNetworkItem,
        );
      } else {
        await playwright.waitAndClickByText(
          mainPageElements.networkSwitcher.dropdownMenuItem,
          network,
        );
      }
      await playwright.waitForText(
        mainPageElements.networkSwitcher.networkName,
        network,
      );
    } else if (typeof network === 'object') {
      network.networkName = network.networkName.toLowerCase();
      await playwright.waitAndClickByText(
        mainPageElements.networkSwitcher.dropdownMenuItem,
        network.networkName,
      );
      await playwright.waitForText(
        mainPageElements.networkSwitcher.networkName,
        network.networkName,
      );
    }
    await playwright.waitUntilStable();
    await module.exports.closePopupAndTooltips();
    await setNetwork(network);
    await switchToCypressIfNotActive();
    return true;
  }

  async addNetwork(network?: {
    networkName: string;
    rpcUrl: string;
    chainId: string | number;
    symbol: string;
    blockExplorer: string;
    isTestnet: boolean;
  }) {
    await switchToMetamaskIfNotActive();

    if (!network) {
      const missingEnvVars = [
        'NETWORK_NAME',
        'RPC_URL',
        'CHAIN_ID',
        'SYMBOL',
        'BLOCK_EXPLORER',
        'IS_TESTNET',
      ].filter(envVar => !process.env[envVar]);

      if (missingEnvVars.length === 0)
        throw new Error(
          `Missing required environment variables to add a network:\n${missingEnvVars.join(
            '\n',
          )}`,
        );

      network = {
        networkName: process.env.NETWORK_NAME!,
        rpcUrl: process.env.RPC_URL!,
        chainId: process.env.CHAIN_ID!,
        symbol: process.env.SYMBOL!,
        blockExplorer: process.env.BLOCK_EXPLORER!,
        isTestnet: process.env.IS_TESTNET === 'true',
      };
    }

    await this.goToAddNetwork();
    await playwright.waitAndType(
      addNetworkPageElements.networkNameInput,
      network.networkName,
    );
    await playwright.waitAndType(
      addNetworkPageElements.rpcUrlInput,
      network.rpcUrl,
    );
    await playwright.waitAndType(
      addNetworkPageElements.chainIdInput,
      network.chainId,
    );
    if (network.symbol) {
      await playwright.waitAndType(
        addNetworkPageElements.symbolInput,
        network.symbol,
      );
    }
    if (network.blockExplorer) {
      await playwright.waitAndType(
        addNetworkPageElements.blockExplorerInput,
        network.blockExplorer,
      );
    }
    await playwright.waitAndClick(
      addNetworkPageElements.saveButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await this.closePopupAndTooltips();
    await setNetwork(network);
    await playwright.waitForText(
      mainPageElements.networkSwitcher.networkName,
      network.networkName,
    );
    await switchToCypressIfNotActive();
    return true;
  }

  async disconnectWalletFromDapp() {
    await switchToMetamaskIfNotActive();
    await playwright.waitAndClick(mainPageElements.optionsMenu.button);
    await playwright.waitAndClick(
      mainPageElements.optionsMenu.connectedSitesButton,
    );
    if (
      await playwright
        .metamaskWindow()
        .locator(mainPageElements.connectedSites.disconnectLabel)
        .isVisible()
    ) {
      console.log(
        '[disconnectWalletFromDapp] Wallet is connected to a dapp, disconnecting..',
      );
      await playwright.waitAndClick(
        mainPageElements.connectedSites.disconnectLabel,
      );
      await playwright.waitAndClick(
        mainPageElements.connectedSites.disconnectButton,
      );
    } else {
      console.log(
        '[disconnectWalletFromDapp] Wallet is not connected to a dapp, skipping..',
      );
    }
    await this.closeModal();
    await switchToCypressIfNotActive();
    return true;
  }

  async disconnectWalletFromAllDapps() {
    await switchToMetamaskIfNotActive();
    await playwright.waitAndClick(mainPageElements.optionsMenu.button);
    await playwright.waitAndClick(
      mainPageElements.optionsMenu.connectedSitesButton,
    );
    const disconnectLabels = await playwright
      .metamaskWindow()
      .$$(mainPageElements.connectedSites.disconnectLabel);
    if (disconnectLabels.length) {
      console.log(
        '[disconnectWalletFromAllDapps] Wallet is connected to dapps, disconnecting..',
      );
      // eslint-disable-next-line no-unused-vars
      for (const disconnectLabel of disconnectLabels) {
        await playwright.waitAndClick(
          mainPageElements.connectedSites.disconnectLabel,
        );
        await playwright.waitAndClick(
          mainPageElements.connectedSites.disconnectButton,
        );
      }
    } else {
      console.log(
        '[disconnectWalletFromAllDapps] Wallet is not connected to any dapps, skipping..',
      );
    }
    await this.closeModal();
    await switchToCypressIfNotActive();
    return true;
  }

  async activateAdvancedGasControl(skipSetup?: boolean) {
    return await activateAdvancedSetting(
      advancedPageElements.advancedGasControlToggleOn,
      advancedPageElements.advancedGasControlToggleOff,
      skipSetup,
    );
  }

  async activateShowHexData(skipSetup?: boolean) {
    return await activateAdvancedSetting(
      advancedPageElements.showHexDataToggleOn,
      advancedPageElements.showHexDataToggleOff,
      skipSetup,
    );
  }

  async activateTestnetConversion(skipSetup?: boolean) {
    return await activateAdvancedSetting(
      advancedPageElements.showTestnetConversionOn,
      advancedPageElements.showTestnetConversionOff,
      skipSetup,
    );
  }

  async activateShowTestnetNetworks(skipSetup?: boolean): Promise<boolean> {
    return await activateAdvancedSetting(
      advancedPageElements.showTestnetNetworksOn,
      advancedPageElements.showTestnetNetworksOff,
      skipSetup,
    );
  }

  async activateCustomNonce(skipSetup?: boolean): Promise<boolean> {
    return await activateAdvancedSetting(
      advancedPageElements.customNonceToggleOn,
      advancedPageElements.customNonceToggleOff,
      skipSetup,
    );
  }

  async activateDismissBackupReminder(skipSetup?: boolean): Promise<boolean> {
    return await activateAdvancedSetting(
      advancedPageElements.dismissBackupReminderOn,
      advancedPageElements.dismissBackupReminderOff,
      skipSetup,
    );
  }

  async activateEthSignRequests(skipSetup?: boolean): Promise<boolean> {
    return await activateAdvancedSetting(
      advancedPageElements.ethSignRequestsToggleOn,
      advancedPageElements.ethSignRequestsToggleOff,
      skipSetup,
    );
  }

  async activateImprovedTokenAllowance(skipSetup?: boolean): Promise<boolean> {
    return await activateAdvancedSetting(
      experimentalSettingsPageElements.improvedTokenAllowanceToggleOn,
      experimentalSettingsPageElements.improvedTokenAllowanceToggleOff,
      skipSetup,
      true,
    );
  }

  async resetAccount(): Promise<boolean> {
    await switchToMetamaskIfNotActive();
    await module.exports.goToAdvancedSettings();
    await playwright.waitAndClick(advancedPageElements.resetAccountButton);
    await playwright.waitAndClick(resetAccountModalElements.resetButton);
    await playwright.waitAndClick(
      settingsPageElements.closeButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await module.exports.closePopupAndTooltips();
    await switchToCypressIfNotActive();
    return true;
  }

  async confirmSignatureRequest(): Promise<boolean> {
    const notificationPage = await playwright.switchToMetamaskNotification();
    if (
      await playwright
        .metamaskNotificationWindow()
        .locator(signaturePageElements.signatureRequestScrollDownButton)
        .isVisible()
    ) {
      await playwright.waitAndClick(
        signaturePageElements.signatureRequestScrollDownButton,
        notificationPage,
      );
    }
    await playwright.waitAndClick(
      signaturePageElements.confirmSignatureRequestButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  async rejectSignatureRequest(): Promise<boolean> {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      signaturePageElements.rejectSignatureRequestButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  async confirmDataSignatureRequest() {
    const notificationPage = await playwright.switchToMetamaskNotification();
    if (
      await playwright
        .metamaskNotificationWindow()
        .locator(signaturePageElements.signatureRequestScrollDownButton)
        .isVisible()
    ) {
      await playwright.waitAndClick(
        signaturePageElements.signatureRequestScrollDownButton,
        notificationPage,
      );
    }
    await playwright.waitAndClick(
      dataSignaturePageElements.confirmDataSignatureRequestButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  async rejectDataSignatureRequest(): Promise<boolean> {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      dataSignaturePageElements.rejectDataSignatureRequestButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  async importToken(
    tokenConfig:
      | string
      | {
          address: string;
          symbol: string;
        },
  ): Promise<{
    tokenContractAddress: string;
    tokenSymbol: string;
    tokenDecimals: string;
    imported: boolean;
  }> {
    const tokenData: Awaited<ReturnType<typeof this.importToken>> = {
      tokenContractAddress: '',
      tokenSymbol: '',
      tokenDecimals: '0',
      imported: false,
    };

    await switchToMetamaskIfNotActive();
    await this.goToImportToken();
    if (typeof tokenConfig === 'string') {
      await playwright.waitAndType(
        mainPageElements.importToken.tokenContractAddressInput,
        tokenConfig,
      );
      tokenData.tokenContractAddress = tokenConfig;
      tokenData.tokenSymbol = await playwright.waitAndGetInputValue(
        mainPageElements.importToken.tokenSymbolInput,
      );
    } else {
      await playwright.waitAndType(
        mainPageElements.importToken.tokenContractAddressInput,
        tokenConfig.address,
      );
      tokenData.tokenContractAddress = tokenConfig.address;
      await playwright.waitAndClick(
        mainPageElements.importToken.tokenEditButton,
        await playwright.metamaskWindow(),
        {
          force: true,
        },
      );
      await playwright.waitClearAndType(
        tokenConfig.symbol,
        mainPageElements.importToken.tokenSymbolInput,
      );
      tokenData.tokenSymbol = tokenConfig.symbol;
    }

    tokenData.tokenDecimals = await playwright.waitAndGetInputValue(
      mainPageElements.importToken.tokenDecimalInput,
    );

    await playwright.waitAndClick(
      mainPageElements.importToken.addCustomTokenButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );

    await playwright.waitAndClick(
      mainPageElements.importToken.importTokensButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );

    await playwright.waitAndClick(
      mainPageElements.asset.backButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );

    await module.exports.closePopupAndTooltips();
    await switchToCypressIfNotActive();
    tokenData.imported = true;

    return tokenData;
  }

  async confirmAddToken(): Promise<boolean> {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      addTokenPageElements.confirmAddTokenButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  async rejectAddToken(): Promise<boolean> {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      addTokenPageElements.rejectAddTokenButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  async confirmPermissionToSpend(spendLimit?: string) {
    const notificationPage = await playwright.switchToMetamaskNotification();
    // experimental mode on
    if (
      await playwright
        .metamaskNotificationWindow()
        .locator(notificationPageElements.customSpendingLimitInput)
        .isVisible()
    ) {
      await playwright.waitAndSetValue(
        spendLimit,
        notificationPageElements.customSpendingLimitInput,
        notificationPage,
      );
      await playwright.waitAndClick(
        notificationPageElements.allowToSpendButton,
        notificationPage,
      );
    }
    await playwright.waitAndClick(
      notificationPageElements.allowToSpendButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  async rejectPermissionToSpend(): Promise<boolean> {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      notificationPageElements.rejectToSpendButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  async acceptAccess(options?: {
    allAccounts?: boolean;
    signInSignature?: boolean;
  }): Promise<boolean> {
    const notificationPage = await playwright.switchToMetamaskNotification();
    if (options && options.allAccounts) {
      await playwright.waitAndClick(
        notificationPageElements.selectAllCheckbox,
        notificationPage,
      );
    }
    await playwright.waitAndClick(
      notificationPageElements.nextButton,
      notificationPage,
      { waitForEvent: 'navi' },
    );
    if (options && options.signInSignature) {
      await playwright.waitAndClick(
        permissionsPageElements.connectButton,
        notificationPage,
        { waitForEvent: 'navi' },
      );
      await module.exports.confirmSignatureRequest();
    } else {
      await playwright.waitAndClick(
        permissionsPageElements.connectButton,
        notificationPage,
        { waitForEvent: 'close' },
      );
    }
    return true;
  }

  // Todo: add proper types for the `confirmTransaction` function
  async confirmTransaction(
    gasConfig?:
      | 'low'
      | 'market'
      | 'aggressive'
      | 'site'
      | {
          gasLimit?: number;
          gasPrice?: number;
          baseFee?: number;
          priorityFee?: number;
        },
  ): Promise<{
    recipientPublicAddress: string;
    networkName: string;
    customNonce: string;
    confirmed: boolean;
  }> {
    const txData: Awaited<ReturnType<typeof this.confirmTransaction>> = {
      recipientPublicAddress: '',
      networkName: '',
      customNonce: '',
      confirmed: false,
    };
    const notificationPage = await playwright.switchToMetamaskNotification();
    if (gasConfig) {
      log(
        '[confirmTransaction] gasConfig is present, determining transaction type..',
      );
      if (
        await playwright
          .metamaskNotificationWindow()
          .locator(confirmPageElements.editGasFeeLegacyButton)
          .isVisible()
      ) {
        log('[confirmTransaction] Looks like legacy tx');
        if (typeof gasConfig === 'object') {
          log('[confirmTransaction] Editing legacy tx..');
          await playwright.waitAndClick(
            confirmPageElements.editGasFeeLegacyButton,
            notificationPage,
          );
          if (
            await playwright
              .metamaskNotificationWindow()
              .locator(confirmPageElements.editGasFeeLegacyOverrideAckButton)
              .isVisible()
          ) {
            log(
              '[confirmTransaction] Override acknowledgement modal is present, closing..',
            );
            await playwright.waitAndClick(
              confirmPageElements.editGasFeeLegacyOverrideAckButton,
              notificationPage,
            );
          }
          if (gasConfig.gasLimit) {
            log('[confirmTransaction] Changing gas limit..');
            await playwright.waitAndSetValue(
              gasConfig.gasLimit.toString(),
              confirmPageElements.gasLimitLegacyInput,
              notificationPage,
            );
          }
          if (gasConfig.gasPrice) {
            log('[confirmTransaction] Changing gas price..');
            await playwright.waitAndSetValue(
              gasConfig.gasPrice.toString(),
              confirmPageElements.gasPriceLegacyInput,
              notificationPage,
            );
          }
          await playwright.waitAndClick(
            confirmPageElements.saveCustomGasFeeButton,
            notificationPage,
          );
        } else {
          log(
            "[confirmTransaction] Legacy tx doesn't support eip-1559 fees (low, market, aggressive, site), using default values..",
          );
        }
      } else {
        log('[confirmTransaction] Looks like eip-1559 tx');
        await playwright.waitAndClick(
          confirmPageElements.editGasFeeButton,
          notificationPage,
        );
        if (typeof gasConfig === 'string') {
          if (gasConfig === 'low') {
            log('[confirmTransaction] Changing gas fee to low..');
            await playwright.waitAndClick(
              confirmPageElements.gasOptionLowButton,
              notificationPage,
            );
          } else if (gasConfig === 'market') {
            log('[confirmTransaction] Changing gas fee to market..');
            await playwright.waitAndClick(
              confirmPageElements.gasOptionMediumButton,
              notificationPage,
            );
          } else if (gasConfig === 'aggressive') {
            log('[confirmTransaction] Changing gas fee to aggressive..');
            await playwright.waitAndClick(
              confirmPageElements.gasOptionHighButton,
              notificationPage,
            );
          } else if (gasConfig === 'site') {
            log('[confirmTransaction] Changing gas fee to site suggested..');
            await playwright.waitAndClick(
              confirmPageElements.gasOptionDappSuggestedButton,
              notificationPage,
            );
          }
        } else {
          log('[confirmTransaction] Editing eip-1559 tx..');
          await playwright.waitAndClick(
            confirmPageElements.gasOptionCustomButton,
            notificationPage,
          );
          if (gasConfig.gasLimit) {
            log('[confirmTransaction] Changing gas limit..');
            await playwright.waitAndClick(
              confirmPageElements.editGasLimitButton,
              notificationPage,
            );
            await playwright.waitAndSetValue(
              gasConfig.gasLimit.toString(),
              confirmPageElements.gasLimitInput,
              notificationPage,
            );
          }
          if (gasConfig.baseFee) {
            log('[confirmTransaction] Changing base fee..');
            await playwright.waitAndSetValue(
              gasConfig.baseFee.toString(),
              confirmPageElements.baseFeeInput,
              notificationPage,
            );
          }
          if (gasConfig.priorityFee) {
            log('[confirmTransaction] Changing priority fee..');
            await playwright.waitAndSetValue(
              gasConfig.priorityFee.toString(),
              confirmPageElements.priorityFeeInput,
              notificationPage,
            );
          }
          await playwright.waitAndClick(
            confirmPageElements.saveCustomGasFeeButton,
            notificationPage,
          );
        }
      }
    }
    log('[confirmTransaction] Checking if recipient address is present..');
    if (
      await playwright
        .metamaskNotificationWindow()
        .locator(confirmPageElements.recipientButton)
        .isVisible()
    ) {
      log('[confirmTransaction] Getting recipient address..');
      await playwright.waitAndClick(
        confirmPageElements.recipientButton,
        notificationPage,
      );
      txData.recipientPublicAddress = await playwright.waitAndGetValue(
        recipientPopupElements.recipientPublicAddress,
        notificationPage,
      );
      await playwright.waitAndClick(
        recipientPopupElements.popupCloseButton,
        notificationPage,
      );
    }
    log('[confirmTransaction] Checking if network name is present..');
    if (
      await playwright
        .metamaskNotificationWindow()
        .locator(confirmPageElements.networkLabel)
        .isVisible()
    ) {
      log('[confirmTransaction] Getting network name..');
      txData.networkName = await playwright.waitAndGetValue(
        confirmPageElements.networkLabel,
        notificationPage,
      );
    }
    // todo: handle setting of custom nonce here
    log('[confirmTransaction] Getting transaction nonce..');
    txData.customNonce = await playwright.waitAndGetAttributeValue(
      confirmPageElements.customNonceInput,
      'placeholder',
      notificationPage,
    );
    // todo: fix getting tx data on function multicall
    // log('[confirmTransaction] Checking if tx data is present..');
    // if (
    //   await playwright
    //     .metamaskNotificationWindow()
    //     .locator(confirmPageElements.dataButton)
    //     .isVisible()
    // ) {
    //   log('[confirmTransaction] Fetching tx data..');
    //   await playwright.waitAndClick(
    //     confirmPageElements.dataButton,
    //     notificationPage,
    //   );
    //   log('[confirmTransaction] Getting origin value..');
    //   txData.origin = await playwright.waitAndGetValue(
    //     confirmPageElements.originValue,
    //     notificationPage,
    //   );
    //   log('[confirmTransaction] Getting bytes value..');
    //   txData.bytes = await playwright.waitAndGetValue(
    //     confirmPageElements.bytesValue,
    //     notificationPage,
    //   );
    //   log('[confirmTransaction] Getting hex data value..');
    //   txData.hexData = await playwright.waitAndGetValue(
    //     confirmPageElements.hexDataValue,
    //     notificationPage,
    //   );
    //   await playwright.waitAndClick(
    //     confirmPageElements.detailsButton,
    //     notificationPage,
    //   );
    // }
    log('[confirmTransaction] Confirming transaction..');
    await playwright.waitAndClick(
      confirmPageElements.confirmButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    txData.confirmed = true;
    log('[confirmTransaction] Transaction confirmed!');
    return txData;
  }

  async rejectTransaction(): Promise<boolean> {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      confirmPageElements.rejectButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  async confirmEncryptionPublicKeyRequest(): Promise<boolean> {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      encryptionPublicKeyPageElements.confirmEncryptionPublicKeyButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  async rejectEncryptionPublicKeyRequest(): Promise<boolean> {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      encryptionPublicKeyPageElements.rejectEncryptionPublicKeyButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  async confirmDecryptionRequest(): Promise<boolean> {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      decryptPageElements.confirmDecryptionRequestButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  async rejectDecryptionRequest(): Promise<boolean> {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      decryptPageElements.rejectDecryptionRequestButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  async allowToAddNetwork({
    waitForEvent,
  }: { waitForEvent?: string } = {}): Promise<boolean> {
    const notificationPage = await playwright.switchToMetamaskNotification();
    if (waitForEvent) {
      await playwright.waitAndClick(
        confirmationPageElements.footer.approveButton,
        notificationPage,
        { waitForEvent },
      );
    } else {
      await playwright.waitAndClick(
        confirmationPageElements.footer.approveButton,
        notificationPage,
      );
    }
    return true;
  }

  async rejectToAddNetwork(): Promise<boolean> {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      confirmationPageElements.footer.cancelButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  async allowToSwitchNetwork(): Promise<boolean> {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      confirmationPageElements.footer.approveButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  async rejectToSwitchNetwork(): Promise<boolean> {
    const notificationPage = await playwright.switchToMetamaskNotification();
    await playwright.waitAndClick(
      confirmationPageElements.footer.cancelButton,
      notificationPage,
      { waitForEvent: 'close' },
    );
    return true;
  }

  async allowToAddAndSwitchNetwork(): Promise<boolean> {
    await this.allowToAddNetwork();
    await this.allowToSwitchNetwork();
    return true;
  }

  async getWalletAddress(): Promise<Option<string>> {
    await switchToMetamaskIfNotActive();
    await playwright.waitAndClick(mainPageElements.optionsMenu.button);
    await playwright.waitAndClick(
      mainPageElements.optionsMenu.accountDetailsButton,
    );
    this.walletAddress = await playwright.waitAndGetValue(
      mainPageElements.accountModal.walletAddressInput,
    );
    await playwright.waitAndClick(mainPageElements.accountModal.closeButton);
    await switchToCypressIfNotActive();
    return this.walletAddress;
  }

  async initialSetup(
    playwrightInstance: any,
    {
      secretWordsOrPrivateKey,
      network,
      password,
      enableAdvancedSettings,
      enableExperimentalSettings,
    }: any, // todo: add proper types
  ) {
    const isCustomNetwork =
      (process.env.NETWORK_NAME &&
        process.env.RPC_URL &&
        process.env.CHAIN_ID) ||
      typeof network == 'object';
    if (playwrightInstance) {
      await playwright.init(playwrightInstance);
    } else {
      await playwright.init();
    }
    await playwright.assignWindows();
    await playwright.assignActiveTabName('metamask');
    await module.exports.getExtensionDetails();
    await playwright.fixBlankPage();
    await playwright.fixCriticalError();

    if (
      await playwright
        .metamaskWindow()
        .locator(onboardingWelcomePageElements.onboardingWelcomePage)
        .isVisible()
    ) {
      if (secretWordsOrPrivateKey.includes(' ')) {
        // secret words
        await module.exports.importWallet(secretWordsOrPrivateKey, password);
      } else {
        // private key
        await module.exports.createWallet(password);
        await module.exports.importAccount(secretWordsOrPrivateKey);
      }

      await setupSettings(enableAdvancedSettings, enableExperimentalSettings);

      if (isCustomNetwork) {
        await this.addNetwork(network);
      } else {
        await this.changeNetwork(network);
      }
      this.walletAddress = await this.getWalletAddress();
      await playwright.switchToCypressWindow();
      return true;
    } else if (
      await playwright
        .metamaskWindow()
        .locator(unlockPageElements.passwordInput)
        .isVisible()
    ) {
      await this.unlock(password);
      this.walletAddress = await this.getWalletAddress();
      await playwright.switchToCypressWindow();
      return true;
    } else {
      if (
        (await playwright
          .metamaskWindow()
          .locator(mainPageElements.walletOverview)
          .isVisible()) &&
        !process.env.RESET_METAMASK
      ) {
        await switchToMetamaskIfNotActive();
        this.walletAddress = await this.getWalletAddress();
        await playwright.switchToCypressWindow();
        return true;
      } else {
        // todo: reset metamask state
      }
    }
  }
}

const metamask = new MetamaskApi();

async function switchToMetamaskIfNotActive() {
  if (await playwright.isCypressWindowActive()) {
    await playwright.switchToMetamaskWindow();
    metamask.switchBackToCypressWindow = true;
  }
  return metamask.switchBackToCypressWindow;
}

async function switchToCypressIfNotActive() {
  if (metamask.switchBackToCypressWindow) {
    await playwright.switchToCypressWindow();
    metamask.switchBackToCypressWindow = false;
  }
  return metamask.switchBackToCypressWindow;
}

async function activateAdvancedSetting(
  toggleOn: string,
  toggleOff: string,
  skipSetup?: boolean,
  experimental?: boolean,
): Promise<boolean> {
  if (!skipSetup) {
    await switchToMetamaskIfNotActive();
    if (experimental) {
      await metamask.goToExperimentalSettings();
    } else {
      await metamask.goToAdvancedSettings();
    }
  }
  if (!(await playwright.metamaskWindow().locator(toggleOn).isVisible())) {
    await playwright.waitAndClick(toggleOff);
  }
  if (!skipSetup) {
    await playwright.waitAndClick(
      settingsPageElements.closeButton,
      await playwright.metamaskWindow(),
      {
        waitForEvent: 'navi',
      },
    );
    await metamask.closePopupAndTooltips();
    await switchToCypressIfNotActive();
  }
  return true;
}

async function setupSettings(
  enableAdvancedSettings: boolean,
  enableExperimentalSettings: boolean,
): Promise<boolean> {
  await switchToMetamaskIfNotActive();
  await metamask.goToAdvancedSettings();
  await metamask.activateAdvancedGasControl(true);
  await metamask.activateShowHexData(true);
  await metamask.activateShowTestnetNetworks(true);
  await metamask.activateCustomNonce(true);
  await metamask.activateDismissBackupReminder(true);
  if (enableAdvancedSettings) {
    await metamask.activateTestnetConversion(true);
  }
  await metamask.goToExperimentalSettings();
  if (enableExperimentalSettings) {
    await metamask.activateImprovedTokenAllowance(true);
  }
  await playwright.waitAndClick(
    settingsPageElements.closeButton,
    await playwright.metamaskWindow(),
    {
      waitForEvent: 'navi',
    },
  );
  await metamask.closePopupAndTooltips();
  await switchToCypressIfNotActive();
  return true;
}

export default metamask;
