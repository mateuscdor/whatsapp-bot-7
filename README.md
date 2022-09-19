# Soruka Tech Bot

## About
Soruka is a WhatsApp bot project that Bang Wafa and Helmi working on. Tt is written in TypeScript and based on [Bailey's WhatsApp Websocket](https://github.com/adiwajshing/Baileys) to interact with the WhatsApp Linked Device API.

## Installation

**Node.js 16.9.0 or newer is required.**

```sh-session
npm install 
yarn install
pnpm install
```

## Example usage

Build:

```sh-session
npm build
yarn build
pnpm build
```

Start:

```sh-session
npm start
yarn start
pnpm start
```

Register a new command to the module (lib/commands directory):

```js
commands.on(['command-name', 'alias', /regex/], ['tag'], () => {
	callback
})
```