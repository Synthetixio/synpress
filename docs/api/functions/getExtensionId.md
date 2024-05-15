# Function: getExtensionId()

```ts
function getExtensionId(context, extensionName): Promise<string>
```

Returns the extension ID for the given extension name. The ID is fetched from the `chrome://extensions` page.

::: tip
This function soon will be removed to improve the developer experience! 😇
:::

## Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `context` | `BrowserContext` | The browser context. |
| `extensionName` | `string` | The name of the extension, e.g., `MetaMask`. |

## Returns

`Promise`\<`string`\>

The extension ID.
