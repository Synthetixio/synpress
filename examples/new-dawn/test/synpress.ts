import { metaMaskFixtures, testWithSynpress } from '@synthetixio/synpress'
import connectedSetup from './wallet-setup/connected.setup'

export default testWithSynpress(metaMaskFixtures(connectedSetup))
