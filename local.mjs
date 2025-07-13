#!/usr/bin/env node

import { commandLine } from "./bin/modules/common.mjs";
import { handler } from "./server/index.mjs";

const { command/*, args*/ } = commandLine();

const importParams = { assert: { type: 'json' } };

const testConnect = async () => await handler(
  (await import('./ConnectEvent.json', importParams))?.default
);

const testDisconnect = async () => await handler(
  (await import('./DisconnectEvent.json', importParams))?.default
);

const testCORS = async () => await handler(
  (await import('./CORSEvent.json', importParams))?.default
);

const testMessage = async () => await handler(
  (await import('./MessageEvent.json', importParams))?.default
);

switch (command) {
  case "connect":
    await testConnect();
    break;
  case "disconnect":
    await testDisconnect();
    break;
  case "CORS":
    await testCORS();
    break;
  case "message":
    await testMessage();
    break;
  default:
    console.log('no command');
}
