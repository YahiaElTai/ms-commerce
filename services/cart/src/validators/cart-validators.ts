import { z } from 'zod';
import { ActionsSchema } from './actions-validators';
import {
  CartVersionSchema,
  CustomerEmailSchema,
  LineItemSchema,
  LineItemDraftSchema,
  QuantitySchema,
} from './nested-validators';

// validator for the initial created cart before adding the computed fields
export const CartSchema = z.object({
  id: z.number().positive(),
  version: CartVersionSchema,
  customerEmail: CustomerEmailSchema,
  lineItems: z.array(LineItemSchema),
});

// Validator for the cart response that gets sent to the user after adding the computed fields
export const CartResponseSchema = CartSchema.extend({
  totalLineItemQuantity: QuantitySchema,
});

// Validator for the list of carts that gets sent to the user
export const CartListResponseSchema = z.object({
  results: z.array(CartResponseSchema),
  limit: z.number(),
  offset: z.number(),
  count: z.number(),
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
