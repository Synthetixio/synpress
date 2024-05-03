import connectedSetup from './wallet-setup/connected.setup'
import { testWithSynpress, metaMaskFixtures } from '@synthetixio/synpress'

export default testWithSynpress(metaMaskFixtures(connectedSetup))
