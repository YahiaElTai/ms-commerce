import { z } from 'zod';

export const QuantitySchema = z.number().int().gt(0);

export const IdSchema = z.number().int().positive();

export const SKUSchema = z.string();

export const CartVersionSchema = z.number().int();

export const CustomerEmailSchema = z.string().email();

export const LineItemSchema = z.object({
  id: IdSchema,
  quantity: QuantitySchema,
  sku: SKUSchema,
});

export const LineItemDraftSchema = z.object({
  quantity: QuantitySchema,
  sku: SKUSchema,
});
