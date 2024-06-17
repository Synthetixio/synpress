import { testWithSynpress } from "@synthetixio/synpress-core";
import { keplrFixtures } from "../src";
import connectedSetup from "./wallet-setup/connected-keplr.setup";

console.log('testWithSynpress', testWithSynpress, keplrFixtures, connectedSetup)

export default testWithSynpress(keplrFixtures(connectedSetup))
