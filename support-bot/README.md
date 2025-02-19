# Synpress Support Bot

A Discord bot powered by Google's Gemini AI that provides support for Synpress-related questions. The bot analyzes the Synpress codebase and can answer questions about its functionality, usage, and implementation details.

## Features

- Responds to mentions in the designated support channel
- Uses Gemini AI to provide accurate responses about Synpress
- Handles long responses by splitting them into multiple messages
- Prevents overlapping requests with a processing lock
- TypeScript implementation for better type safety

## Prerequisites

- Node.js 18 or higher
- pnpm package manager
- Discord Bot Token
- Google Cloud API Key with Gemini AI access

## Setup

1. Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Fill in your environment variables in the `.env` file:

   - `DISCORD_BOT_TOKEN`: Your Discord bot token from the Discord Developer Portal
   - `CLOUD_API_KEY`: Your Google Cloud API key with Gemini AI access

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Build the project:
   ```bash
   pnpm build
   ```

## Usage

1. Start the bot in development mode:

   ```bash
   pnpm dev
   ```

   Or in production mode:

   ```bash
   pnpm start
   ```

2. Create a channel named `support-bot` in your Discord server

3. Mention the bot (@BotName) in the support-bot channel with your Synpress-related question

## Development

- `pnpm build` - Builds the TypeScript code
- `pnpm start` - Starts the bot in production mode
- `pnpm dev` - Starts the bot in development mode with hot reload
- `pnpm lint` - Runs the linter
- `pnpm format` - Formats the code

## Important Notes

- The bot only responds in the channel named `support-bot`
- It requires the `synpress-source.txt` file in the root directory containing the Synpress codebase
- Responses are limited to 1900 characters and will be split into multiple messages if needed
- The bot processes one request at a time to maintain response quality
