#!/usr/bin/env node

import { readFile } from "node:fs/promises";

import { 
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import { commandLine, sendCommand } from "./common.mjs";

const client = new S3Client();
const send = sendCommand(client);

const createBucket = async (Bucket) => await send(
  new CreateBucketCommand({
    Bucket
  })
);

const deleteBucket = async (Bucket) => await send(
  new DeleteBucketCommand({
    Bucket
  })
);

const deployCode = async (path, Bucket, Key) => await send(
  await new PutObjectCommand({
    Body: await readFile(path),
    Bucket,
    Key
  })
);

const emptyBucket = async (Bucket, Key) => {
  const Objects = [{Key}];

  return await send(new DeleteObjectsCommand({
    Bucket,
    Delete: { Objects }
  }))
};

const buildS3 = async (Bucket) => {
  const Body = `${Bucket}.zip`;
  const Key = Body;

  await createBucket(Bucket);
  await deployCode(Body, Bucket, Key);
};

const { args, command } = commandLine();

switch(command) {
  case "createBucket":
    createBucket(...args);
    break;
  case "deleteBucket":
    deleteBucket(...args);
    break;
  case "deployCode":
    deployCode(...args);
    break;
  case "emptyBucket":
    emptyBucket(...args);
    break;
  case "buildS3":
    buildS3(...args);
    break;
  default:
    throw new Error("Invalid Command");
}

