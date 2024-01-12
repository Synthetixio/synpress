# TypeScript

## Requirements

Synpress has full TypeScript support. It is written in TypeScript and ships with its type definitions. There are a few things to keep in mind:

- Types require TypeScript >= 5.0.4.
- While in alpha, the types might change between releases. Locking the `@synthetixio/synpress` to a specific version is recommended.

To ensure everything works as expected, make sure to enable the [`strict`](https://www.typescriptlang.org/tsconfig#strict) compiler option in your `tsconfig.json`:

::: code-group
```json [tsconfig.json]
{
  "compilerOptions": {
    "strict": true
  }
}
```
:::
