import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand
} from "@aws-sdk/client-apigatewaymanagementapi";

import { getConnectionIds, deleteConnectionId } from './db.mjs';

/**
 * 
 * @param {*} param0 
 */
export const sendToClient = async ({ Data, domainName, stage, connectionId, deleteOnError = true }) => {
  const client = new ApiGatewayManagementApiClient({
    endpoint: `https://${domainName}/${stage}`
  });
  const command = new PostToConnectionCommand({
    Data,
    ConnectionId: connectionId
  });

  try {
    await client.send(command);
    console.log('Posted To:', connectionId);
  } catch (error) {
    switch (error.name) {
      case 'GoneException':
      case 'BadRequestException':
        console.warn(error.name, connectionId);
        deleteOnError && deleteConnectionId(connectionId);
        break;
      default:
        throw (error);
    }
  }
}

/**
 * 
 * @param {ConnectionId, Data, requestContext} param0 
 */
export const sendMessageToClient = async ({
  connectionId,
  data,
  requestContext: {
    domainName,
    stage,
    connectionId: senderId
  },
}) => {
  const sender = connectionId === senderId ?
    `* ${senderId}` :
    senderId;

  const Data = JSON.stringify({
    body: `${sender} ${data}`,
    type: 'message'
  });

  await sendToClient({ Data, domainName, stage, connectionId });
};

/**
 * 
 */
export const broadcastCount = async ({ requestContext: { stage, domainName } }) => {
  const connectionIds = await getConnectionIds();
  const connectionIdsLength = connectionIds.length;
  const Data = JSON.stringify({
    body: `Users: ${connectionIdsLength}`,
    type: 'count'
  });

  for (let i = 0, connectionId; i < connectionIdsLength; i++) {
    // eslint-disable-next-line security/detect-object-injection
    connectionId = connectionIds[i].connectionId.S;

    await sendToClient({ connectionId, Data, stage, domainName, deleteOnError: false });
  }
};

/**
 * 
 * @param {*} param0 
 */
export const broadcastMessage = async ({
  body: data,
  requestContext
}) => {
  const connectionIds = await getConnectionIds();
  const connectionIdsLength = connectionIds.length;

  for (let i = 0, connectionId; i < connectionIdsLength; i++) {
    // eslint-disable-next-line security/detect-object-injection
    connectionId = connectionIds[i].connectionId.S;

    await sendMessageToClient({ connectionId, data, requestContext });
  }
};
