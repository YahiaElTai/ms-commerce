import { z } from 'zod';
import { IdSchema, ProductResponseSchema } from '../validators';
import kafka from './client';
import { CompressionTypes } from 'kafkajs';

export enum TOPICS {
  productCreated = 'product_created',
  productUpdated = 'product_updated',
  productDeleted = 'product_deleted',
}
type ProductResponse = z.infer<typeof ProductResponseSchema>;
type ID = z.infer<typeof IdSchema>;

const producer = kafka.producer({
  maxInFlightRequests: 5, // Maximum number of in-flight requests per broker connection
  idempotent: true, // Enable idempotent producer to handle network errors and message duplication
});

const produceMessage = async (message: ProductResponse | ID, topic: TOPICS) => {
  await producer.connect();

  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
    compression: CompressionTypes.GZIP,
  });

  await producer.disconnect();
};

export { produceMessage };
