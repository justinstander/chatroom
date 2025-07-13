import { DynamoDBClient, DeleteItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient();
const TableName = process.env.CONNECTIONS_TABLE_NAME;

const getItemKey = (connectionId) => ({
  connectionId: {
    S: connectionId
  }
});

export const getConnectionIds = async (excludeId) => {
  let input = {
    TableName
  };

  if (excludeId) {
    input = {
      ...input,
      ...{
        ExpressionAttributeValues: {
          ":a": {
            S: excludeId
          }
        },
        FilterExpression: "connectionId <> :a",
      }
    }
  }

  const command = new ScanCommand(input);

  return (await client.send(command))?.Items;
};

export const deleteConnectionId = async (connectionId) => {
  console.log('Delete:', connectionId);

  const Key = getItemKey(connectionId);
  const command = new DeleteItemCommand({
    TableName,
    Key
  });

  return await client.send(command);
};

export const putConnectionId = async (connectionId) => {
  console.log('Put:', connectionId);

  const Item = getItemKey(connectionId);
  const command = new PutItemCommand({
    TableName,
    Item
  });

  return await client.send(command);
};
