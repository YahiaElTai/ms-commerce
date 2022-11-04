import { PubSub } from "@google-cloud/pubsub";
import { Schema } from "mongoose";
import { Address } from "../models/subdocuments/address";
import { LineItem } from "../models/subdocuments/line-item";

interface CartEvent {
  id: Schema.Types.ObjectId;
  version: number;
  customerEmail: string;
  lineItems: [LineItem];
  shippingAddress: Address;
  shippingMethodId: string;
  totalPrice: number;
}

export enum Topics {
  CART_CREATED = "cart_created",
  CART_UPDATED = "cart_updated",
}

export class CloudPubSub {
  client: PubSub;

  constructor() {
    this.client = new PubSub({ projectId: process.env.GCP_PROJECT_ID });
  }

  async publishMessage(topicName: Topics, payload: CartEvent) {
    const dataBuffer = Buffer.from(JSON.stringify(payload));
    try {
      const messageId = await this.client
        .topic(topicName)
        .publishMessage({ data: dataBuffer });
      console.log(`Message ${messageId} published.`);
      return messageId;
    } catch (err) {
      console.error(err);
    }
  }
}
