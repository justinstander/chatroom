import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const client = new SNSClient({});
const TopicArn = process.env.TOPIC_ARN;

export const publishConnectionNotification = async (connectionId) => {
    const Message = connectionId;
    const command = new PublishCommand({
        TopicArn,
        Message
    });

    await client.send(command);
};
