export function extractWalletSetupFunction(sourceCode: string): string {
  const match = sourceCode.match(/defineWalletSetup\s*\([^,]*,\s*(async\s*\([^)]*\)\s*=>\s*{[\s\S]*?})\s*\)/)

  if (!match || !match[1]) {
    console.log('Failed to extract defineWalletSetup callback from:', sourceCode)
    throw new Error('Could not find defineWalletSetup callback')
  }

  // Return just the callback function (second parameter)
  return match[1]
}
