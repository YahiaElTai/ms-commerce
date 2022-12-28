import { z } from 'zod';
import { ActionsSchema } from './actions-validators';
import {
  CartVersionSchema,
  CustomerEmailSchema,
  LineItemsSchema,
  ShippigMethodSchema,
} from './nested-validators';

// Validator for the cart response that gets sent to the user
export const CartSchema = z.object({
  id: z.number().positive(),
  version: CartVersionSchema,
  customerEmail: CustomerEmailSchema,
  shippingMethodId: ShippigMethodSchema,
  lineItems: LineItemsSchema,
});

// Validator used when creating a cart
export const CartDraftCreateSchema = z.object({
  customerEmail: CustomerEmailSchema,
  shippingMethodId: ShippigMethodSchema,
  lineItems: LineItemsSchema,
});

// Validator used when updating a cart
export const CartDraftUpdateSchema = z.object({
  version: CartVersionSchema,
  actions: ActionsSchema,
});
