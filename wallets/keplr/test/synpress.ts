import { testWithSynpress } from "@synthetixio/synpress-core";
import { keplrFixtures } from "../src";
import connectedKeplrSetup from "./wallet-setup/connected-keplr.setup";

export default testWithSynpress(keplrFixtures(connectedKeplrSetup))