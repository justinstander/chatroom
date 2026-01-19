import { readFile } from "node:fs/promises";
import { execSync } from 'node:child_process';
import * as fs from 'fs';

import {
  ListBucketsCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";

import { sendCommand } from "./common.mjs";

const send = sendCommand(new S3Client());

export const listBuckets = async () => (await send(new ListBucketsCommand())).Buckets.map(({Name}) => Name);

export const listObjects = async (Bucket) => (await send(new ListObjectsCommand({ Bucket }))).Contents.map(({ Key }) => Key);

export const putObject = async (Bucket, Key, ContentType) => await send(
  new PutObjectCommand({
    Body: await readFile(Key),
    Bucket,
    ContentType,
    Key
  })
)
  ;
export const copyFiles = async (Bucket) => {
  // Client
  const readdirOptions = { recursive: true, withFileTypes: true };
  const isFile = dirent => !dirent.isDirectory();

  const files = fs.readdirSync('client', readdirOptions).filter(isFile);
  const filesLength = files.length;

  let name;
  let parentPath;
  let i;
  let ContentType;
  for (i = 0; i < filesLength; i++) {
    ({ name, parentPath } = files[i]);
    ContentType = name.includes('.mjs') ? 'text/javascript' : 'text/html';
    await putObject(Bucket, `${parentPath}/${name}`, ContentType)
  }

  // Server
  execSync("cd server && zip -r server.zip .");
  await putObject(Bucket, 'server/server.zip', 'application/zip');
}
