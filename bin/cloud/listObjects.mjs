#!/usr/bin/env node

import { print } from "./modules/common.mjs";
import { listObjects } from "./modules/s3.mjs";

print(await listObjects(process.env.AWS_S3_BUCKET_NAME));
