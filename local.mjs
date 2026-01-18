#!/usr/bin/env node

import { commandLine } from "./bin/cloud/modules/common.mjs";
import { handler } from "./server/index.mjs";

const { command } = commandLine();

const importParams = { with: { type: 'json' } };

const testConnect = async () => await handler(
  (await import('./ConnectEvent.json', importParams))?.default
);

const testClientOpen = async () => await handler(
  (await import('./ClientOpenEvent.json', importParams))?.default
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
  case "clientOpen":
    await testClientOpen();
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
