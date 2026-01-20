import {
  CloudFrontClient,
  CreateInvalidationCommand,
  GetDistributionCommand,
  ListDistributionsCommand,
  CreateDistributionCommand,
  DeleteDistributionCommand,
  UpdateDistributionCommand
} from "@aws-sdk/client-cloudfront";

import { callerReference, sendCommand } from "./common.mjs";

const send = sendCommand(new CloudFrontClient());

export const createDistribution = async ({ CachePolicyId, Comment, origin }) => await send(new CreateDistributionCommand({
  DistributionConfig: {
    CallerReference: callerReference(),
    DefaultRootObject: "index.html",
    Origins: {
      Quantity: 1,
      Items: [
        {
          Id: origin,
          DomainName: origin,
          OriginPath: "/client",
          S3OriginConfig: {
            OriginAccessIdentity: ""
          }
        }
      ]
    },
    DefaultCacheBehavior: {
      TargetOriginId: origin,
      ViewerProtocolPolicy: "https-only",
      AllowedMethods: {
        Quantity: 2,
        Items: [
          "HEAD",
          "GET"
        ],
        CachedMethods: {
          Quantity: 2,
          Items: [
            "HEAD",
            "GET"
          ]
        }
      },
      Compress: true,
      CachePolicyId,
    },
    Comment,
    PriceClass: "PriceClass_All",
    Enabled: true,
    ViewerCertificate: {
      CloudFrontDefaultCertificate: true,
    },
    HttpVersion: "http2",
    IsIPV6Enabled: true,
    Staging: false
  }
}));

export const disableDistribution = async (Id) => {
  const { Distribution: { DistributionConfig }, ETag: IfMatch, } = await getDistribution(Id);
  const { Distribution: { Status } } = await send(new UpdateDistributionCommand({
    Id,
    DistributionConfig: {
      ...DistributionConfig,
      Enabled: false
    },
    IfMatch
  }));

  return Status;
};

export const deleteDistribution = async (Id) => {
  const IfMatch = await getETag(Id);

  return IfMatch ? await send(new DeleteDistributionCommand({ Id, IfMatch })) : undefined;
};

export const getETag = async (Id) => (await getDistribution(Id))?.ETag;

export const getDistribution = async (Id) => (await send(new GetDistributionCommand({ Id })));

export const listDistributions = async () => (await send(new ListDistributionsCommand())).DistributionList.Items.map(({ Id, Comment, Enabled, Status }) => `${Id}\t${Enabled}\t${Status}\t${Comment}`);

export const invalidateDistribution = async (DistributionId) => await send(
  new CreateInvalidationCommand({
    DistributionId,
    InvalidationBatch: {
      CallerReference: callerReference(),
      Paths: {
        Quantity: 1,
        Items: ["/*"]
      }
    }
  })
);
