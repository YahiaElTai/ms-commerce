import { Schema, model } from 'mongoose';
import { Address, AddressDraft, AddressSchema } from './subdocuments/address';
import {
  LineItem,
  LineItemDraft,
  lineItemSchema,
} from './subdocuments/line-item';

export interface CartDraft {
  customerEmail: string;
  lineItems: [LineItemDraft];
  shippingAddress: AddressDraft;
  shippingMethodId: string;
}

// shipping address needs to match with the country of the cart and the shippingInfo country
// all currencies need to matc
export interface CartDoc {
  id: Schema.Types.ObjectId;
  version: number;
  customerEmail: string;
  lineItems: [LineItem];
  shippingAddress: Address;
  shippingMethodId: string;
  totalPrice: number; // this field will be calculated on the backend. all line item cost + shipping price
}

const cartSchema = new Schema<CartDoc>(
  {
    version: { type: Number, default: 1 },
    customerEmail: { type: String, required: true },
    lineItems: [lineItemSchema],
    shippingAddress: AddressSchema,
    shippingMethodId: String,
    totalPrice: Number,
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

const Cart = model<CartDoc>('Cart', cartSchema);

export { Cart };
