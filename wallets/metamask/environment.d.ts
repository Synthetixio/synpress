declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CI: boolean
      HEADLESS: boolean
    }
  }
}

export {}
