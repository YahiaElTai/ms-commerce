import { Kafka } from 'kafkajs';

// Add these values as k8s secrets
const config = {
  kafkaBootstrapServers: process.env['KAFKABOOTSTRAPSERVERS'] as string,
  kafkaUsername: process.env['KAFKAUSERNAME'] as string,
  kafkaPassword: process.env['KAFKAPASSWORD'] as string,
};

const kafka = new Kafka({
  clientId: 'cart-kafkajs-client',
  brokers: [config.kafkaBootstrapServers],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: config.kafkaUsername,
    password: config.kafkaPassword,
  },
});

export default kafka;
