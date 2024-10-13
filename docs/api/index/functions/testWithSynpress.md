# Function: testWithSynpress()

```ts
function testWithSynpress<CustomFixtures>(customFixtures): TestType<PlaywrightTestArgs & PlaywrightTestOptions & CustomFixtures, PlaywrightWorkerArgs & PlaywrightWorkerOptions & object>
```

## Type parameters

| Type parameter |
| :------ |
| `CustomFixtures` *extends* `Fixtures` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `customFixtures` | `TestType`\<`CustomFixtures`, `object`\> |

## Returns

`TestType`\<`PlaywrightTestArgs` & `PlaywrightTestOptions` & `CustomFixtures`, `PlaywrightWorkerArgs` & `PlaywrightWorkerOptions` & `object`\>
