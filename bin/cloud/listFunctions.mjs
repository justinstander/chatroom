#!/usr/bin/env node

import { print } from "./modules/common.mjs";
import { listFunctions } from "./modules/lambda.mjs";

print(await listFunctions());
