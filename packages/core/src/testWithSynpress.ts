import type { Fixtures, TestType } from '@playwright/test'
import { mergeTests, test as base } from '@playwright/test'

/**
 * Creates a test environment with Synpress integration.
 *
 * This function merges the base Playwright test with custom fixtures, allowing for
 * seamless integration of Synpress capabilities in Playwright tests.
 *
 * Synpress is a wrapper around Cypress that adds support for testing
 * Web3 and blockchain applications, particularly those involving
 * MetaMask interactions.
 *
 * @param customFixtures - Custom fixtures to be merged with the base test.
 * @returns A merged test object that includes both Playwright and Synpress capabilities.
 *
 * @example
 * ```typescript
 * const test = testWithSynpress(myCustomFixtures);
 * test('My Web3 test', async ({ page, synpress }) => {
 *   // Test implementation using Playwright and Synpress
 * });
 * ```
 */
export default function testWithSynpress<CustomFixtures extends Fixtures>(
  customFixtures: TestType<CustomFixtures, object>
): TestType<CustomFixtures, object> {
  return mergeTests(base, customFixtures)
}
