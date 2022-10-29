import { Schema } from "mongoose";

export interface Money {
  fractionDigits: number;
  centAmount: number;
  currencyCode: string;
}

export const moneySchema = new Schema<Money>(
  {
    centAmount: Number,
    currencyCode: String,
    fractionDigits: { type: Number, default: 2 },
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
