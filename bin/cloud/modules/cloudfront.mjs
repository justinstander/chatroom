import { CloudFrontClient, CreateInvalidationCommand, GetDistributionCommand, ListDistributionsCommand } from "@aws-sdk/client-cloudfront";

import { sendCommand } from "./common.mjs";

const send = sendCommand(new CloudFrontClient());

export const getDistribution = async (Id) => await send(new GetDistributionCommand({ Id }));

export const listDistributions = async () => {
  const { DistributionList: { Items } } = await send(new ListDistributionsCommand());

  return Items.map(({Id, Comment}) => `${Id} ${Comment}`);
};

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
