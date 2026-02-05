#!/usr/bin/env node

import { commandLine, print } from "./modules/common.mjs";
import { listBuckets, listObjects } from "./modules/s3.mjs";

const { args: [Bucket], command } = commandLine();

switch (command) {
    case "create-bucket":
        print('TODO');
        break;
    case "list-buckets":
        print(await listBuckets());
        break;
    case "list-objects":
        print(await listObjects(Bucket));
        break;
    default:
        print('no command');
}
