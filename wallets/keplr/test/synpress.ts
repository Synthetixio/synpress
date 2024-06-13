import { testWithSynpress } from "@synthetixio/synpress-core";
import { keplrFixtures } from "../src";
import connectedSetup from "./wallet-setup/connected.setup";

export default testWithSynpress(keplrFixtures(connectedSetup))
