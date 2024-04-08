declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CI: boolean
      HEADLESS: boolean
    }
  }
}

declare global {
  interface Window {
    ethereum: import('ethers').Eip1193Provider
  }

  // biome-ignore lint/suspicious/noExplicitAny: Web3Mock is a mock object
  const Web3Mock: any
}

export {}
