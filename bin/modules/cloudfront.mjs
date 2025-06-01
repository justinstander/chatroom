import { CloudFrontClient, CreateInvalidationCommand, GetDistributionCommand } from "@aws-sdk/client-cloudfront";

import { sendCommand } from "./common.mjs";

const send = sendCommand(new CloudFrontClient());

export const getDistribution = async (Id) => await send(new GetDistributionCommand({ Id }));

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
