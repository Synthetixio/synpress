import { transformSync } from "esbuild";
import { FIXES_BANNER } from "../cli/compilationFixes";

export default function buildWalletSetupFunction(
  walletSetupFunctionString: string
) {
  const { code } = transformSync(walletSetupFunctionString, {
    format: "esm",
    minifyWhitespace: true,
    target: "es2022",
    drop: ["console", "debugger"],
    loader: "ts",
    logLevel: "silent",
    platform: "node",
    banner: FIXES_BANNER,
  });

  return code;
}
