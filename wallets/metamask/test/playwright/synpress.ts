import { testWithSynpress } from '@synthetixio/synpress-core'
import connectedSetup from './wallet-setup/connected.setup'
import { metaMaskFixtures } from '../../src/playwright'

export default testWithSynpress(metaMaskFixtures(connectedSetup))
