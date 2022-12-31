import { z } from 'zod';
import { ActionsSchema } from './actions-validators';
import {
  CartVersionSchema,
  CustomerEmailSchema,
  LineItemSchema,
  LineItemDraftSchema,
  QuantitySchema,
} from './nested-validators';

// Validator for the cart response that gets sent to the user
export const CartSchema = z.object({
  id: z.number().positive(),
  version: CartVersionSchema,
  customerEmail: CustomerEmailSchema,
  lineItems: z.array(LineItemSchema),
});

export const CartResponseSchema = z.object({
  id: z.number().positive(),
  version: CartVersionSchema,
  customerEmail: CustomerEmailSchema,
  lineItems: z.array(LineItemSchema),
  totalLineItemQuantity: QuantitySchema,
});

// Validator used when creating a cart
export const CartDraftCreateSchema = z.object({
  customerEmail: CustomerEmailSchema,
  lineItems: z.array(LineItemDraftSchema),
});

// Validator used when updating a cart
export const CartDraftUpdateSchema = z.object({
  version: CartVersionSchema,
  actions: ActionsSchema,
});

export const CartListResponseSchema = z.object({
  results: z.array(CartSchema),
  limit: z.number(),
  offset: z.number(),
  count: z.number(),
});
