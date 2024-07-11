import dotenv from 'dotenv'
import findConfig from 'find-config'

export const loadEnv = () => {
  const envFiles = ['.env', '.env.e2e', '.env.local', '.env.dev']
  envFiles.find((envFile) => {
    const config = findConfig(envFile)
    if (config) {
      dotenv.config({ path: config })
      return true
    }
    return false
  })
}
