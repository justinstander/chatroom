import { CloudFrontClient, CreateInvalidationCommand, GetDistributionCommand, ListDistributionsCommand } from "@aws-sdk/client-cloudfront";

import { sendCommand } from "./common.mjs";

const send = sendCommand(new CloudFrontClient());

export const getDistribution = async (Id) => (await send(new GetDistributionCommand({ Id }))).Distribution;

export const listDistributions = async () => (await send(new ListDistributionsCommand())).DistributionList.Items.map(({Id, Comment}) => `${Id}\t${Comment}`);

export const invalidate = async (DistributionId) => await send(
  new CreateInvalidationCommand({
    DistributionId,
    InvalidationBatch: {
      CallerReference: Date.now().toString(),
      Paths: {
        Quantity: 1,
        Items: ["/*"]
      }
    }
  })
);
