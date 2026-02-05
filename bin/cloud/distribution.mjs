#!/usr/bin/env node

import {
    createDistribution,
    deleteDistribution,
    disableDistribution,
    getDistribution,
    invalidateDistribution,
    listDistributions
} from "./modules/cloudfront.mjs";
import {
    commandLine,
    print
} from "./modules/common.mjs";

const { args, command } = commandLine();

let Id;

switch (command) {
    case 'create':
        const [origin, CachePolicyId, Comment] = args;
        print(await createDistribution({ CachePolicyId, Comment, origin }));
        break;
    case 'delete':
        ([Id] = args);
        print(await deleteDistribution(Id));
        break;
    case 'disable':
        ([Id] = args);
        print(await disableDistribution(Id));
        break;
    case 'get':
        ([Id] = args);
        print(await getDistribution(Id));
        break;
    case 'invalidate':
        ([Id] = args);
        print(await invalidateDistribution(Id));
        break;
    case 'list':
        print(await listDistributions());
        break;
    default:
        print('no command');
}
