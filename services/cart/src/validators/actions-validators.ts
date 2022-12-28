import { z } from 'zod';
import { LineItemSchema, ShippigMethodSchema } from './nested-validators';

// supported update actions to update the cart
export const Actions = z.enum([
  'addLineItem',
  'removeLineItem',
  'changeLineItemQuantity',
  'updateShippingMethod',
]);

// Validators for update actions used to update the cart
export const AddLineItemActionSchema = z.object({
  type: z.literal(Actions.Enum.addLineItem),
  value: LineItemSchema,
});

export const RemoveLineItemActionSchema = z.object({
  type: z.literal(Actions.Enum.removeLineItem),
  value: LineItemSchema,
});

// If quantity is changed to 0 then remove the item.
export const ChangeLineItemQuantityActionSchema = z.object({
  type: z.literal(Actions.Enum.changeLineItemQuantity),
  value: LineItemSchema,
});

export const UpdateShippingMethodActionSchema = z.object({
  type: z.literal(Actions.Enum.updateShippingMethod),
  value: ShippigMethodSchema,
});

export const ActionsSchema = z
  .array(
    z.object({
      type: Actions,
      value: z.union([LineItemSchema, ShippigMethodSchema]),
    }),
    { required_error: 'You must add at least one update action' }
  )
  .nonempty({ message: 'You must add at least one update action' });
