export function extractWalletSetupFunction(sourceCode: string): string {
  const match = sourceCode.match(
    /defineWalletSetup\s*\([^,]*,\s*(async\s*\([^)]*\)\s*=>\s*{(?:[^{}]*|{(?:[^{}]*|{[^{}]*})*})*})\s*\)/
  )

  if (!match || !match[1]) {
    console.log('Failed to extract defineWalletSetup callback from:', sourceCode)
    throw new Error('Could not find defineWalletSetup callback')
  }

  return match[1]
}
