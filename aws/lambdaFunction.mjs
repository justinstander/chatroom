#!/usr/bin/env node

import { 
  CreateFunctionCommand,
  DeleteFunctionCommand,
  LambdaClient
} from "@aws-sdk/client-lambda";
import { commandLine, sendCommand } from "./common.mjs";

const client = new LambdaClient();
const send = sendCommand(client);

const createFunction = async (
  S3Bucket,
  S3Key,
  FunctionName,
  Role,
  Runtime,
  Handler
) => await send(new CreateFunctionCommand({
  Code: { 
    S3Bucket,
    S3Key,
  },
  FunctionName,
  Role,
  Runtime,
  Handler
}));

const deleteFunction = async (
  FunctionName
) => await send(new DeleteFunctionCommand({
  FunctionName
}));

const createRole = async () => console.log('todo: createRole') ;

const { args, command } = commandLine();

switch(command) {
  case "createFunction":
    createFunction(...args);
    break;
  case "deleteFunction":
    deleteFunction(...args);
    break;
  case "createRole":
    createRole(...args);
    break;
  default:
    throw new Error("Invalid Command");
}
