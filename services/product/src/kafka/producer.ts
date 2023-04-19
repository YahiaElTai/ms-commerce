import { z } from 'zod';
import {
  IdSchema,
  ProductResponseSchema,
  ProductUpdatedMessageSchema,
} from '../validators';
import kafka from './client';
import { CompressionTypes } from 'kafkajs';

export enum TOPICS {
  productCreated = 'product_created',
  productUpdated = 'product_updated',
  productDeleted = 'product_deleted',
}
type TProductCreated = z.infer<typeof ProductResponseSchema>;
type TProductUpdated = z.infer<typeof ProductUpdatedMessageSchema>;
type TProductDeleted = z.infer<typeof IdSchema>;

const producer = kafka.producer({
  maxInFlightRequests: 5, // Maximum number of in-flight requests per broker connection
});

const produceMessage = async (
  message: TProductCreated | TProductDeleted | TProductUpdated,
  topic: TOPICS
) => {
  await producer.connect();

  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
    compression: CompressionTypes.GZIP,
  });

  await producer.disconnect();
};

export { produceMessage };
