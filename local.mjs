#!/usr/bin/env node

import { commandLine } from "./bin/modules/common.mjs";

const { command, args: [server = './server/index.mjs'] } = commandLine();

const event = (await import(command, { assert: { type: 'json' } }))?.default;

const { handler } = await import(server);

console.log(await handler(event));
