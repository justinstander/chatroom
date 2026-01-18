#!/usr/bin/env node

import { listDistributions } from "./modules/cloudfront.mjs";
import { print } from "./modules/common.mjs";

print(await listDistributions());
