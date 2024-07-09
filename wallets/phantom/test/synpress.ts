import { testWithSynpress } from '@synthetixio/synpress-core'
import { phantomFixtures } from '../src'
import createPhantom from './wallet-setup/create.setup'

export default testWithSynpress(phantomFixtures(createPhantom))
