import { broadcastCount, broadcastMessage, sendToClient } from './modules/api.mjs';
import { deleteConnectionId, getConnectionIds, putConnectionId } from './modules/db.mjs';
import { publishConnectionNotification } from './modules/notifications.mjs';

/**
 * 
 */
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? [];

/**
 * The error is only visible in our logs,
 * sends plain 422 to client.
 * 
 * @param {*} error 
 * @returns 
 */
const handleError = (error) => {
  console.error(error);
  return {
    statusCode: 422
  };
};

/**
 * 
 * @param {*} param0 
 * @returns 
 */
const routeConnect = async ({
  headers,
  requestContext
}) => {
  console.log('Connect');

  const { connectionId } = requestContext;
  const Origin = headers?.Origin ?? '(no Origin)';

  if (!allowedOrigins.includes(Origin)) return handleError('CORS');

  await putConnectionId(connectionId);
  await publishConnectionNotification(`Connected: ${connectionId}\n${Origin}`);
  await broadcastCount({ requestContext });
};

/**
 * 
 * @param {*} event 
 */
const routeClientOpen = async (event) => {
  console.log('Client Open');
  const {
    requestContext: { connectionId, stage, domainName }
  } = event;

  const connectionIds = await getConnectionIds();
  const connectionIdsLength = connectionIds.length;

  await sendToClient({
    connectionId, Data: JSON.stringify({
      body: `Users: ${connectionIdsLength}`,
      type: 'count'
    }), stage, domainName, deleteOnError: false
  });
};

/**
 * 
 * @param {*} param0 
 */
const routeDisconnect = async ({
  requestContext
}) => {
  console.log('Disconnect');

  const { connectionId } = requestContext;

  await deleteConnectionId(connectionId);
  await publishConnectionNotification(`Disconnect: ${connectionId}`);
  await broadcastCount({ requestContext });
};

/**
 * AWS Lambda handler
 * 
 * @param {*} event 
 * @returns 
 */
export const handler = async (event) => {
  console.log(event);

  const {
    requestContext: { routeKey }
  } = event;

  try {
    switch (routeKey) {
      case '$connect':
        await routeConnect(event);
        break;
      case '$disconnect':
        await routeDisconnect(event);
        break;
      case 'clientOpen':
        routeClientOpen(event);
        break;
      case '$default':
        await broadcastMessage(event);
        break;
      default:
        return handleError(new Error(`Unsupported route: ${routeKey}`));
    }
  } catch (error) {
    return handleError(error);
  }

  return {
    statusCode: 200
  };
};
