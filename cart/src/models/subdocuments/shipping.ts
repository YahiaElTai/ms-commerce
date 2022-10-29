import { Schema } from "mongoose";
import { Money, moneySchema } from "./money";

export interface Shipping {
  name: string;
  country: string;
  price: Money;
}

export const shippingSchema = new Schema<Shipping>(
  {
    name: String,
    country: String,
    price: moneySchema,
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
