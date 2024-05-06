// Fixes -> Error: Dynamic require of "fs" is not supported
// Issue link: https://github.com/evanw/esbuild/issues/1921
const DYNAMIC_REQUIRE_FS_FIX = `
// ---- DYNAMIC_REQUIRE_FS_FIX ----
var require = (await import("node:module")).createRequire(import.meta.url);
var __filename = (await import("node:url")).fileURLToPath(import.meta.url);
var __dirname = (await import("node:path")).dirname(__filename);
// ---- DYNAMIC_REQUIRE_FS_FIX ----
`.trim()

export const FIXES_BANNER = `
/// ######## BANNER WITH FIXES START ########

${DYNAMIC_REQUIRE_FS_FIX}

/// ######## BANNER WITH FIXES END ########
`.trimStart()
