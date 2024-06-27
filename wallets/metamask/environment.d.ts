declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CI: boolean
      HEADLESS: boolean
      SYNPRESS_USE_CACHE: boolean
    }
  }
}

export {}
