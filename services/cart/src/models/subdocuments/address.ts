import { Schema } from 'mongoose';

export interface AddressDraft {
  name: string;
  email: string;
  addressLine: string;
  country: string;
}

export interface Address {
  id: Schema.Types.ObjectId;
  name: string;
  email: string;
  addressLine: string;
  country: string;
}

export const AddressSchema = new Schema<Address>(
  {
    name: String,
    email: String,
    addressLine: String,
    country: String,
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
