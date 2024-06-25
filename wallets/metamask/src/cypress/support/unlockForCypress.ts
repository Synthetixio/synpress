import { MetaMask } from '../MetaMask'
// import { closePopover, closeRecoveryPhraseReminder } from '../../playwright/pages/HomePage/actions';

export async function unlockForCypress(password: string) {
  const metamask = new MetaMask(password)

  await metamask.unlock()

  // await unlockWalletButReloadIfSpinnerDoesNotVanish(metamask)
  //
  // await retryIfMetaMaskCrashAfterUnlock(page)
  //
  // await closePopover(page)
  // await closeRecoveryPhraseReminder(page)
}
