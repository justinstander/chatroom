#!/usr/bin/env node

import { getDistributionConfig } from "./modules/cloudfront.mjs";
import { print } from "./modules/common.mjs";

print(await getDistributionConfig(process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID));
