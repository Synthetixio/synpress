import type { Fixtures, TestType } from '@playwright/test'
import { test as base, mergeTests } from '@playwright/test'

export default function testWithSynpress<CustomFixtures extends Fixtures>(
  customFixtures: TestType<CustomFixtures, object>
) {
  return mergeTests(base, customFixtures)
}
