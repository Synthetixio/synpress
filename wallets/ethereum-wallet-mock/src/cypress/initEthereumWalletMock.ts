import { type BrowserContext, chromium, type Page } from "@playwright/test";
import { MISSING_INIT, NO_CONTEXT, NO_PAGE } from "./errors";
import { EthereumWalletMock } from "../EthereumWalletMock";
import { SEED_PHRASE } from "../utils";

let context: BrowserContext | undefined;
let page: Page | undefined;
let ethereumWalletMock: EthereumWalletMock | undefined;

const getPage = async () => {
  if (!context) {
    console.error(NO_CONTEXT);
    return;
  }

  page = await context.newPage();

  return page;
};

export async function connectPlaywrightToChrome(port: number) {
  const debuggerDetails = await fetch(`http://127.0.0.1:${port}/json/version`);

  const debuggerDetailsConfig = (await debuggerDetails.json()) as {
    webSocketDebuggerUrl: string;
  };

  const browser = await chromium.connectOverCDP(
    debuggerDetailsConfig.webSocketDebuggerUrl
  );

  context = browser.contexts()[0];

  return browser.isConnected();
}

export async function initEthereumWalletMock(port: number) {
  await connectPlaywrightToChrome(port);

  if (!context) {
    console.error(NO_CONTEXT);
    return;
  }

  await getPage();

  if (!page) {
    console.error(NO_PAGE);
    return;
  }

  ethereumWalletMock = new EthereumWalletMock(page);
  await ethereumWalletMock.importWallet(SEED_PHRASE);
}

export function getEthereumWalletMock() {
  if (!context || !page || !ethereumWalletMock) {
    console.error(MISSING_INIT);
    return;
  }

  if (ethereumWalletMock) return ethereumWalletMock;

  return new EthereumWalletMock(page);
}
