import path from "node:path";
import fs from "fs-extra";
import { ensureCacheDirExists } from "../ensureCacheDirExists";
import { createCacheForWalletSetupFunction } from "./createCacheForWalletSetupFunction";
import { isDirEmpty } from "./isDirEmpty";
import { getWalletSetupFuncHash } from "./getWalletSetupFuncHash";
import type { WalletSetupFunction } from "../defineWalletSetup";

export async function triggerCacheCreation(
  setupFunctions: Map<
    string,
    { fileName: string; setupFunction: WalletSetupFunction }
  >,
  functionStrings: string[],
  downloadExtension: () => Promise<string>,
  force: boolean
) {
  const cacheDirPath = ensureCacheDirExists();
  const extensionPath = await downloadExtension();

  return Array.from(setupFunctions).map(
    async ([_, { fileName, setupFunction }], index) => {
      // @ts-ignore
      const funcHash = getWalletSetupFuncHash(functionStrings[index]);

      const cachePath = path.join(cacheDirPath, funcHash);
      const doesCacheDirExist = await fs.exists(cachePath);
      const isCacheDirEmpty = await isDirEmpty(cachePath);

      if (doesCacheDirExist) {
        if (isCacheDirEmpty) {
          // In case of incorrect Playwright setup, the cache dir will be empty. For now, we're just deleting it.
          await fs.remove(cachePath);
        } else {
          if (!force) {
            console.log(`Cache already exists for ${funcHash}. Skipping...`);
            return;
          }

          console.log(
            `Cache already exists for ${funcHash} but force flag is set. Deleting cache...`
          );
          await fs.remove(cachePath);
        }
      }

      const fileNameWithCorrectExtension = fileName.replace(
        /\.(ts|js|mjs)$/,
        ".{ts,js,mjs}"
      );
      console.log(
        `Triggering cache creation for: ${funcHash} (${fileNameWithCorrectExtension})`
      );
      // We're not inferring the return type here to make sure we don't accidentally await the function.
      return createCacheForWalletSetupFunction(
        extensionPath,
        cachePath,
        setupFunction,
        fileNameWithCorrectExtension
      );
    }
  );
}
