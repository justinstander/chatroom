#!/usr/bin/env node

import { print } from "./modules/common.mjs";
import { listBuckets } from "./modules/s3.mjs";

print(await listBuckets());
