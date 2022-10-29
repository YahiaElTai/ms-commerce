import { Schema, model } from "mongoose";
import { Address, AddressDraft, AddressSchema } from "./subdocuments/address";
import {
  LineItem,
  LineItemDraft,
  lineItemSchema,
} from "./subdocuments/line-item";
import { Money, moneySchema } from "./subdocuments/money";
import { Shipping, shippingSchema } from "./subdocuments/shipping";

export interface CartDraft {
  currency: string;
  customerEmail: string;
  country?: string;
  lineItems: [LineItemDraft];
  shippingAddress: AddressDraft;
  billingAddress: AddressDraft;
  shippingMethodId: string;
}

// shipping address needs to match with the country of the cart and the shippingInfo country
// all currencies need to matc
interface CartDoc {
  version: number;
  currency: string;
  customerEmail: string;
  country: string;
  lineItems: [LineItem];
  shippingAddress: Address;
  billingAddress: Address;
  shippingInfo: Shipping;
  totalPrice: Money; // this field will be calculated on the backend. all line item cost + shipping price
}

const cartSchema = new Schema<CartDoc>(
  {
    version: { type: Number, default: 1 },
    currency: String,
    customerEmail: { type: String, required: true },
    country: String,
    lineItems: [lineItemSchema],
    shippingAddress: AddressSchema,
    billingAddress: AddressSchema,
    shippingInfo: shippingSchema,
    totalPrice: moneySchema,
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

const Cart = model<CartDoc>("Cart", cartSchema);

export { Cart };
