import { PubSub } from "@google-cloud/pubsub";

export default {
  publishMessage: async (
    pubSubClient: PubSub,
    topicName: string,
    payload: { id: string }
  ) => {
    const dataBuffer = Buffer.from(JSON.stringify(payload));
    try {
      const messageId = await pubSubClient
        .topic(topicName)
        .publishMessage({ data: dataBuffer });
      console.log(`Message ${messageId} published.`);
      return messageId;
    } catch (err) {
      console.log("error publishing", err);
    }
  },
};
