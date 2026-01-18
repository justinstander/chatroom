#!/usr/bin/env node

import { invalidate } from "./modules/cloudfront.mjs";
import { print } from "./modules/common.mjs";
import { updateServer } from "./modules/lambda.mjs";
import { copyFiles } from "./modules/s3.mjs";

const deploy = async (Bucket, DistributionId, FunctionName) => {
  print('copy files');
  await copyFiles(Bucket);
  print('update server');
  await updateServer({ Bucket, FunctionName });
  print('invalidate');
  await invalidate(DistributionId);
};

await deploy(
  process.env.AWS_S3_BUCKET_NAME,
  process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
  process.env.AWS_LAMBDA_FUNCTION_NAME
);

print('done.');
