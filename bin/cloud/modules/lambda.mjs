import {
  UpdateFunctionCodeCommand,
  ListFunctionsCommand,
  LambdaClient
} from "@aws-sdk/client-lambda";
import { sendCommand } from "./common.mjs";

const send = sendCommand(new LambdaClient());

export const listFunctions = async () => (await send(new ListFunctionsCommand())).Functions.map(({ FunctionName, Description }) => `${FunctionName}\t${Description}`);

export const updateServer = async ({
  Bucket: S3Bucket,
  FunctionName,
  S3Key = 'server/server.zip'
}) => await send(new UpdateFunctionCodeCommand({
  FunctionName,
  S3Bucket,
  S3Key
}));
