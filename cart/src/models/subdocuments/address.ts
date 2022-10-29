import { Schema } from "mongoose";

export interface AddressDraft {
  firstName: string;
  lastName: string;
  email: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  country: string;
}

export const AddressSchema = new Schema<Address>(
  {
    firstName: String,
    lastName: String,
    email: String,
    streetName: String,
    streetNumber: String,
    postalCode: String,
    city: String,
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
