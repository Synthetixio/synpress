// Fixes -> Error: Dynamic require of "fs" is not supported
// Issue link: https://github.com/evanw/esbuild/issues/1921
const DYNAMIC_REQUIRE_FS_FIX = `
// ---- DYNAMIC_REQUIRE_FS_FIX ----
var require = (await import("node:module")).createRequire(import.meta.url);
var __filename = (await import("node:url")).fileURLToPath(import.meta.url);
var __dirname = (await import("node:path")).dirname(__filename);
// ---- DYNAMIC_REQUIRE_FS_FIX ----
`.trim()

// Fixes -> Error: Cannot find module '../package.json'
// This issue is related to the Playwright test runner.
const PLAYWRIGHT_RELATIVE_PACKAGE_IMPORT_FIX = `
// ---- PLAYWRIGHT_RELATIVE_PACKAGE_IMPORT_FIX ----
var originalRequireResolve = require.resolve;
require.resolve = (id, ...args) => {
  if (id.endsWith("/package.json")) {
    id = require("node:path").join(process.cwd(), "package.json");
  }
  return originalRequireResolve(id, ...args);
}
// ---- PLAYWRIGHT_RELATIVE_PACKAGE_IMPORT_FIX ----
`.trim()

export const FIXES_BANNER = `
/// ######## BANNER WITH FIXES START ########

${DYNAMIC_REQUIRE_FS_FIX}

${PLAYWRIGHT_RELATIVE_PACKAGE_IMPORT_FIX}

/// ######## BANNER WITH FIXES END ########
`.trimStart()
