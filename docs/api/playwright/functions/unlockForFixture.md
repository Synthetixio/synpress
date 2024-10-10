# Function: unlockForFixture()

```ts
function unlockForFixture(page, password): Promise<void>
```

A more advanced version of the `MetaMask.unlock()` function that incorporates various workarounds for MetaMask issues, among other things.
 This function should be used instead of the `MetaMask.unlock()` when passing it to the `testWithSynpress` function.

## Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `page` | `Page` | The MetaMask tab page. |
| `password` | `string` | The password of the MetaMask wallet. |

## Returns

`Promise`\<`void`\>
