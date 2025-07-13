import {
  UpdateFunctionCodeCommand,
  LambdaClient
} from "@aws-sdk/client-lambda";
import { sendCommand } from "./common.mjs";

const send = sendCommand(new LambdaClient());

export const updateServer = async ({
  Bucket: S3Bucket,
  FunctionName,
  S3Key = 'server/server.zip'
}) => await send(new UpdateFunctionCodeCommand({
  FunctionName,
  S3Bucket,
  S3Key
}));
