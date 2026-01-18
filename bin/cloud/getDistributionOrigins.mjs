#!/usr/bin/env node

import { getDistributionOrigins } from "./modules/cloudfront.mjs";
import { print } from "./modules/common.mjs";

print(await getDistributionOrigins(process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID));
