import { z } from 'zod';
import { SKUSchema, QuantitySchema, IdSchema } from './nested-validators';

// supported update actions to update the cart
export const Actions = z.enum([
  'addLineItem',
  'removeLineItem',
  'changeLineItemQuantity',
]);

// Validators for update actions used to update the cart
export const AddLineItemActionSchema = z.object({
  type: z.literal(Actions.Enum.addLineItem),
  value: z.object({
    quantity: QuantitySchema,
    sku: SKUSchema,
  }),
});

export const RemoveLineItemActionSchema = z.object({
  type: z.literal(Actions.Enum.removeLineItem),
  value: z.object({
    id: IdSchema,
  }),
});

// If quantity is changed to 0 then remove the item.
export const ChangeLineItemQuantityActionSchema = z.object({
  type: z.literal(Actions.Enum.changeLineItemQuantity),
  value: z.object({
    id: IdSchema,
    quantity: QuantitySchema,
  }),
});

export const ActionsSchema = z
  .array(
    z.object({
      type: Actions,
      value: z.record(z.union([z.string(), z.number()])),
    })
  )
  .nonempty();
