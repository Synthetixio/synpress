import { testWithSynpress } from "@synthetixio/synpress-core";
import { keplrFixtures } from "../src";
import connectedKeplrSetup from "./wallet-setup/connected-keplr.setup";

console.log('connectedKeplrSetup', connectedKeplrSetup, connectedKeplrSetup.hash)
export default testWithSynpress(keplrFixtures(connectedKeplrSetup, 1000))