import { testWithSynpress } from '@synthetixio/synpress-core'
import { metaMaskFixtures } from '../src'
import connectedSetup from './wallet-setup/connected.setup'

export default testWithSynpress(metaMaskFixtures(connectedSetup))
