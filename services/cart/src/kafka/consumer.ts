import { EachMessagePayload } from 'kafkajs';
import kafka from './client';
import createProduct from './operations/create-product';
import deleteProduct from './operations/delete-product';
import updateProduct from './operations/update-product';
import deleteAllProducts from './operations/delete_all_products';

export enum TOPICS {
  productCreated = 'product_created',
  productUpdated = 'product_updated',
  productDeleted = 'product_deleted',
  productAllDeleted = 'product_all_deleted',
}

const consumer = kafka.consumer({
  groupId: 'cart-consumer-group',
  heartbeatInterval: 3000,
  sessionTimeout: 10000,
});

const handleMessage = async ({
  topic,
  message,
}: EachMessagePayload): Promise<void> => {
  const value = message.value?.toString();

  if (!value) {
    console.warn(`Received empty message on topic: ${topic}`);
    return;
  }

  switch (topic) {
    case TOPICS.productCreated:
      await createProduct(value);
      break;
    case TOPICS.productDeleted:
      await deleteProduct(value);
      break;
    case TOPICS.productAllDeleted:
      await deleteAllProducts(value);
      break;
    case TOPICS.productUpdated:
      await updateProduct(value);
      break;
    default:
      console.warn('Unknown topic:', topic);
  }
};

const run = async (): Promise<void> => {
  // Connect the consumer to the broker
  await consumer.connect();

  // Subscribe to the desired topic
  await consumer.subscribe({
    topics: [
      TOPICS.productCreated,
      TOPICS.productUpdated,
      TOPICS.productDeleted,
      TOPICS.productAllDeleted,
    ],
    fromBeginning: true,
  });

  // Run the consumer, providing the message handling function
  await consumer.run({
    eachMessage: handleMessage,
  });
};

const shutdown = async (): Promise<void> => {
  console.log('Shutting down gracefully...');
  try {
    await consumer.disconnect();
    console.log('Kafka consumer disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('Error disconnecting Kafka consumer:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  shutdown().catch((error) => {
    console.error('Error in shutdown Kafka cart consumer:', error);
    process.exit(1);
  });
});
process.on('SIGINT', () => {
  shutdown().catch((error) => {
    console.error('Error in shutdown Kafka cart consumer:', error);
    process.exit(1);
  });
});

run().catch((error) => {
  console.error('Error in Kafka cart consumer:', error);
});
