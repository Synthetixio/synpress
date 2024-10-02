declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SEED_PHRASE: string
      WALLET_PASSWORD: string
    }
  }
}

export {}
