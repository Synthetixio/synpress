import { testWithSynpress } from '@synthetixio/synpress-core'
import { petraFixtures } from '../../src/playwright'
import basicSetup from './wallet-setup/basic.setup'

export default testWithSynpress(petraFixtures(basicSetup))
