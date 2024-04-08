declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CI: boolean;
      HEADLESS: boolean;
    }
  }
}

declare global {
  interface Window {
    ethereum: any;
  }

  const Web3Mock: any;
}

export {};
