import { testWithSynpress } from '@synthetixio/synpress-core'
import { phantomFixtures } from '../../src/playwright'
import basicSetup from './wallet-setup/basic.setup'

export default testWithSynpress(phantomFixtures(basicSetup))
