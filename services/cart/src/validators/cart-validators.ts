import { z } from 'zod';
import { ActionsSchema } from './actions-validators';
import {
  CartVersionSchema,
  CustomerEmailSchema,
  QuantitySchema,
  SKUSchema,
} from './nested-validators';

const LineItemsSchema = z
  .array(
    z.object(
      {
        quantity: QuantitySchema,
        sku: SKUSchema,
      },
      { required_error: 'SKU and quantity are required on LineItem' }
    ),
    { required_error: 'You must add at least one line item to the cart' }
  )
  .nonempty({ message: 'You must add at least one line item to the cart' });

// Validator for the cart response that gets sent to the user
export const CartSchema = z.object({
  id: z.number().positive(),
  version: CartVersionSchema,
  customerEmail: CustomerEmailSchema,
  lineItems: LineItemsSchema,
});

// Validator used when creating a cart
export const CartDraftCreateSchema = z.object({
  customerEmail: CustomerEmailSchema,
  lineItems: LineItemsSchema,
});

// Validator used when updating a cart
export const CartDraftUpdateSchema = z.object({
  version: CartVersionSchema,
  actions: ActionsSchema,
});
