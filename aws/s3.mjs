#!/usr/bin/env node

import { 
  S3Client,
  CreateBucketCommand,
  DeleteBucketCommand,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { commandLine, sendCommand } from "./common.mjs";

const client = new S3Client();
const send = sendCommand(client);

const createBucket = async (Bucket) => await send(new CreateBucketCommand({
  Bucket
}));

const deleteBucket = async (Bucket) => await send(new DeleteBucketCommand({
  Bucket
}));

const deployCode = async (Body, Bucket, Key) => await send(new PutObjectCommand({
  Body,
  Bucket,
  Key
}));

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
  default:
    throw new Error("Invalid Command");
}

