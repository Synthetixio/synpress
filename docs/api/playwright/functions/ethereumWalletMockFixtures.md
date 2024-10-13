# Function: ethereumWalletMockFixtures()

## ethereumWalletMockFixtures(title, body)

```ts
function ethereumWalletMockFixtures(title, body): void
```

Declares a test.
- `test(title, body)`
- `test(title, details, body)`

**Usage**

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // ...
});
```

**Tags**

You can tag tests by providing additional test details. Alternatively, you can include tags in the test title. Note
that each tag must start with `@` symbol.

```js
import { test, expect } from '@playwright/test';

test('basic test', {
  tag: '@smoke',
}, async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // ...
});

test('another test @smoke', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // ...
});
```

Test tags are displayed in the test report, and are available to a custom reporter via `TestCase.tags` property.

You can also filter tests by their tags during test execution:
- in the [command line](https://playwright.dev/docs/test-cli#reference);
- in the config with [testConfig.grep](https://playwright.dev/docs/api/class-testconfig#test-config-grep) and
  [testProject.grep](https://playwright.dev/docs/api/class-testproject#test-project-grep);

Learn more about [tagging](https://playwright.dev/docs/test-annotations#tag-tests).

**Annotations**

You can annotate tests by providing additional test details.

```js
import { test, expect } from '@playwright/test';

test('basic test', {
  annotation: {
    type: 'issue',
    description: 'https://github.com/microsoft/playwright/issues/23180',
  },
}, async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // ...
});
```

Test annotations are displayed in the test report, and are available to a custom reporter via
`TestCase.annotations` property.

You can also add annotations during runtime by manipulating
[testInfo.annotations](https://playwright.dev/docs/api/class-testinfo#test-info-annotations).

Learn more about [test annotations](https://playwright.dev/docs/test-annotations).

### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `title` | `string` | Test title. |
| `body` | (`args`, `testInfo`) => `void` \| `Promise`\<`void`\> | Test body that takes one or two arguments: an object with fixtures and optional TestInfo. |

### Returns

`void`

## ethereumWalletMockFixtures(title, details, body)

```ts
function ethereumWalletMockFixtures(
   title, 
   details, 
   body): void
```

Declares a test.
- `test(title, body)`
- `test(title, details, body)`

**Usage**

```js
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // ...
});
```

**Tags**

You can tag tests by providing additional test details. Alternatively, you can include tags in the test title. Note
that each tag must start with `@` symbol.

```js
import { test, expect } from '@playwright/test';

test('basic test', {
  tag: '@smoke',
}, async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // ...
});

test('another test @smoke', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // ...
});
```

Test tags are displayed in the test report, and are available to a custom reporter via `TestCase.tags` property.

You can also filter tests by their tags during test execution:
- in the [command line](https://playwright.dev/docs/test-cli#reference);
- in the config with [testConfig.grep](https://playwright.dev/docs/api/class-testconfig#test-config-grep) and
  [testProject.grep](https://playwright.dev/docs/api/class-testproject#test-project-grep);

Learn more about [tagging](https://playwright.dev/docs/test-annotations#tag-tests).

**Annotations**

You can annotate tests by providing additional test details.

```js
import { test, expect } from '@playwright/test';

test('basic test', {
  annotation: {
    type: 'issue',
    description: 'https://github.com/microsoft/playwright/issues/23180',
  },
}, async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // ...
});
```

Test annotations are displayed in the test report, and are available to a custom reporter via
`TestCase.annotations` property.

You can also add annotations during runtime by manipulating
[testInfo.annotations](https://playwright.dev/docs/api/class-testinfo#test-info-annotations).

Learn more about [test annotations](https://playwright.dev/docs/test-annotations).

### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `title` | `string` | Test title. |
| `details` | `TestDetails` | Additional test details. |
| `body` | (`args`, `testInfo`) => `void` \| `Promise`\<`void`\> | Test body that takes one or two arguments: an object with fixtures and optional TestInfo. |

### Returns

`void`
