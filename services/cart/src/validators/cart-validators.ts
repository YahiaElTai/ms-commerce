import { z } from 'zod';
import { ActionsSchema } from './actions-validators';
import {
  LineItemSchema,
  LineItemDraftSchema,
  LineItemResponseSchema,
} from './line-item-validators';
import {
  CurrencySchema,
  EmailSchema,
  IdSchema,
  PriceSchema,
  QuantitySchema,
  VersionSchema,
} from './common-validators';

// validator for the initial created cart before adding the computed fields
export const CartSchema = z.object({
  id: IdSchema,
  version: VersionSchema,
  customerEmail: EmailSchema,
  currency: CurrencySchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  lineItems: z.array(LineItemSchema),
});

// Validator for the cart response that gets sent to the user after adding the computed fields
export const CartResponseSchema = z.object({
  id: IdSchema,
  version: VersionSchema,
  customerEmail: EmailSchema,
  currency: CurrencySchema,
  updatedAt: z.string(),
  createdAt: z.string(),
  lineItems: z.array(LineItemResponseSchema),
  totalLineItemQuantity: QuantitySchema,
  totalPrice: PriceSchema,
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
  customerEmail: EmailSchema,
  currency: CurrencySchema,
  lineItems: z.array(LineItemDraftSchema),
});

// Validator used when updating a cart
export const CartDraftUpdateSchema = z.object({
  version: VersionSchema,
  actions: ActionsSchema,
});
