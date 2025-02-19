import { transformSync } from 'esbuild'

export default function buildWalletSetupFunction(walletSetupFunctionString: string) {
  const { code } = transformSync(walletSetupFunctionString, {
    format: 'esm',
    minifyWhitespace: true,
    target: 'es2022',
    drop: ['console', 'debugger'],
    loader: 'ts',
    logLevel: 'silent',
    platform: 'node'
  })

  return code
}
