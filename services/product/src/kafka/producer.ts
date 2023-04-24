import { z } from 'zod';
import {
  IdSchema,
  ProductResponseSchema,
  ProductUpdatedMessageSchema,
  ProjectKeySchema,
} from '../validators';
import kafka from './client';
import { CompressionTypes } from 'kafkajs';

export enum TOPICS {
  productCreated = 'product_created',
  productUpdated = 'product_updated',
  productDeleted = 'product_deleted',
  productAllDeleted = 'product_all_deleted',
}
type TProductCreated = z.infer<typeof ProductResponseSchema>;
type TProductUpdated = z.infer<typeof ProductUpdatedMessageSchema>;
type TProductDeleted = z.infer<typeof IdSchema>;
type TProductDeletedAll = z.infer<typeof ProjectKeySchema>;

const producer = kafka.producer({
  maxInFlightRequests: 5, // Maximum number of in-flight requests per broker connection
});

const produceMessage = async (
  topic: TOPICS,
  message?:
    | TProductCreated
    | TProductDeleted
    | TProductUpdated
    | TProductDeletedAll
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
