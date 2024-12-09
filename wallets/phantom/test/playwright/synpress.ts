import { testWithSynpress } from '@synthetixio/synpress-core'
import { phantomFixtures } from '../../src/playwright'
// import connectedSetup from './wallet-setup/connected.setup'
import basicSetup from './wallet-setup/basic.setup'

// TO DO -- Add 'connected.setup' file
// export default testWithSynpress(phantomFixtures(connectedSetup))
export default testWithSynpress(phantomFixtures(basicSetup))
