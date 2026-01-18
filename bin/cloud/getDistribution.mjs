#!/usr/bin/env node

import { getDistribution } from "./modules/cloudfront.mjs";
import { print } from "./modules/common.mjs";

print(await getDistribution(process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID));
