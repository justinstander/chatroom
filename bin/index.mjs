#!/usr/bin/env node

import { getDistribution } from "./modules/cloudfront.mjs";
import { commandLine } from "./modules/common.mjs";
import { listObjects } from "./modules/s3.mjs";

const { command } = commandLine();

switch (command) {
  case "get-distribution":
    console.log(await getDistribution(process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID));
    break;
  case "list-objects":
    console.log(await listObjects(process.env.AWS_S3_BUCKET_NAME));
    break;
  default:
    throw new Error("Invalid Command");
}
