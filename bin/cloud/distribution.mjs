#!/usr/bin/env node

import {
    createDistribution,
    deleteDistribution,
    disableDistribution,
    getDistribution,
    invalidate,
    listDistributions
} from "./modules/cloudfront.mjs";
import {
    commandLine,
    print
} from "./modules/common.mjs";
import packageJson from "../../package.json" with {type: "json"};

const { args: [Id], command } = commandLine();

switch (command) {
    case 'create':
        print(await createDistribution({
            Comment: `${packageJson.name} - ${packageJson.description}`,
            origin: `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
            CachePolicyId: process.env.AWS_CLOUDFRONT_CACHE_POLICY_ID
        }));
        break;
    case 'delete':
        print(await deleteDistribution(Id));
        break;
    case 'disable':
        print(await disableDistribution(Id));
        break;
    case 'get':
        print(await getDistribution(Id));
        break;
    case 'invalidate':
        print(await invalidate(Id));
        break;
    case 'list':
        print(await listDistributions());
        break;
    default:
        print('no command');
}
