declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CI: boolean
      HEADLESS: boolean
      USE_CACHE: string
    }
  }
}

export {}
