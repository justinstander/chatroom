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

export const createDistribution = async ({Comment, origin, CachePolicyId}) => await send(new CreateDistributionCommand({
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
      "TrustedSigners": {
        "Enabled": false,
        "Quantity": 0
      },
      "TrustedKeyGroups": {
        "Enabled": false,
        "Quantity": 0
      },
      "ViewerProtocolPolicy": "https-only",
      "AllowedMethods": {
        "Quantity": 2,
        "Items": [
          "HEAD",
          "GET"
        ],
        "CachedMethods": {
          "Quantity": 2,
          "Items": [
            "HEAD",
            "GET"
          ]
        }
      },
      "SmoothStreaming": false,
      "Compress": true,
      "LambdaFunctionAssociations": {
        "Quantity": 0
      },
      "FunctionAssociations": {
        "Quantity": 0
      },
      "FieldLevelEncryptionId": "",
      CachePolicyId,
      "GrpcConfig": {
        "Enabled": false
      }
    },
    "CacheBehaviors": {
      "Quantity": 0
    },
    "CustomErrorResponses": {
      "Quantity": 0
    },
    Comment,
    "Logging": {
      "Enabled": false,
      "IncludeCookies": false,
      "Bucket": "",
      "Prefix": ""
    },
    "PriceClass": "PriceClass_All",
    Enabled: true,
    "ViewerCertificate": {
      "CloudFrontDefaultCertificate": true,
    },
    "Restrictions": {
      "GeoRestriction": {
        "RestrictionType": "none",
        "Quantity": 0
      }
    },
    "HttpVersion": "http2",
    "IsIPV6Enabled": true,
    "ContinuousDeploymentPolicyId": "",
    "Staging": false
  }
}));

export const disableDistribution = async (Id) => {
  const { Distribution: { DistributionConfig }, ETag: IfMatch, } = await send(new GetDistributionCommand({ Id }));
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

export const invalidate = async (DistributionId) => await send(
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
