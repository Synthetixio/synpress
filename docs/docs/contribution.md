# Contributing to Synpress

This guide will help you set up Synpress for local development.

## Prerequisites

Before you begin, ensure you have:
- Node.js (v20 or higher)
- pnpm (v9 or higher)
- Git

## First Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Synthetixio/synpress.git
   cd synpress
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the project:
   ```bash
   pnpm build
   ```

## Development Workflow

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and add tests (e2e and unit tests if needed):
   ```bash
   pnpm test
   ```

3. Format and lint your code:
   ```bash
   pnpm lint
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: Add new feature"
   ```

5. Push your changes and create a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

## Project Structure

- `release/` - Main Synpress package
- `packages/` - Core packages
  - `cache/` - Browser state caching functionality
  - `core/` - Core functionality
  - `tsconfig/` - Shared TypeScript configuration
- `wallets/` - Wallet integrations
  - `metamask/` - MetaMask integration
  - `ethereum-wallet-mock/` - Ethereum Wallet Mock integration
- `docs/` - Documentation website
- `examples/` - Example projects

## Need Help?

Join our [Discord](https://discord.gg/XhZKSRGtWc) community for support and discussions.
