import dotenv from 'dotenv'
import findConfig from 'find-config'

export const loadEnv = () => {
  const envFiles = ['.env', '.env.e2e', '.env.local', '.env.dev']
  envFiles.forEach((envFile) => {
    const envConfig = findConfig(envFile)
    if (!envConfig) return
    dotenv.config({ path: envConfig })
  })
}
