# Function: initMetaMask()

```ts
function initMetaMask(): Promise<{
  "browserArgs": string[];
  "extensions": string[];
}>
```

Initializes MetaMask for Cypress tests.

This function prepares the MetaMask extension for use in Cypress tests.
It sets up the necessary browser arguments and extension paths.

## Returns

`Promise`\<\{
  `"browserArgs"`: `string`[];
  `"extensions"`: `string`[];
 \}\>

An object containing the extension path and browser arguments.

| Member | Type |
| :------ | :------ |
| `browserArgs` | `string`[] |
| `extensions` | `string`[] |

## Async
