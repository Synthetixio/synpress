# TypeScript Support in Synpress

## Requirements and Considerations

Synpress offers comprehensive TypeScript support, being built with TypeScript and providing its own type definitions. Here are some key points to consider:

- **TypeScript Version**: Synpress requires TypeScript version 5.0.4 or higher.
- **Version Stability**: Synpress is now a stable release, with consistent type definitions across versions. However, it's still recommended to specify the version of `@synthetixio/synpress` in your project for better control over updates.

## Configuration

To ensure optimal functionality and type checking, configure your TypeScript compiler with the `strict` option enabled. Update your `tsconfig.json` as follows:

::: code-group
