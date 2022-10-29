import { Schema } from "mongoose";

export interface LineItemDraft {
  quantity: number;
  sku: string;
}

export interface LineItem {
  id: Schema.Types.ObjectId;
  quantity: number;
  sku: string;
}

export const lineItemSchema = new Schema<LineItem>(
  {
    quantity: Number,
    sku: String,
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
