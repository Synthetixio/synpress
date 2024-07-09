import { testWithSynpress } from '@synthetixio/synpress-core'
import { phantomFixtures } from '../src'
import importPhantom from './wallet-setup/import.setup'

export default testWithSynpress(phantomFixtures(importPhantom))
