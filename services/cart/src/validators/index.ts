import { z } from 'zod';

export const Actions = z.enum([
  'addLineItem',
  'removeLineItem',
  'changeLineItemQuantity',
  'updateShippingMethod',
]);

const LineItemSchema = z.object(
  {
    quantity: z
      .number({
        required_error: 'Line item quantity is required.',
      })
      .int('Line item quantity must be an integer')
      .gt(0, 'Line item quantity must be greater than 0'),
    sku: z.string({ required_error: 'Line item SKU is required' }),
  },
  { required_error: 'SKU and quantity are required on LineItem' }
);

const ShippigMethodSchema = z.object({
  shippingMethodId: z.string({
    required_error: 'Shipping method ID is required',
  }),
});

export const CartSchema = z.object({
  customerEmail: z
    .string({
      required_error: 'Customer email is required',
    })
    .email('Not a valid email'),
  shippingMethodId: z.string({
    required_error: 'Shipping method ID is required',
  }),
  lineItems: z
    .array(LineItemSchema)
    .nonempty({ message: 'You must add at least one line item to the cart' }),
});

export const CartUpdateSchema = z.object({
  version: z
    .number({ required_error: 'Cart version is required' })
    .int('Cart version must be a number'),
  actions: z
    .array(
      z.object({
        type: Actions,
        value: z.union([LineItemSchema, ShippigMethodSchema]),
      }),
      { required_error: 'You must add at least one update action' }
    )
    .nonempty({ message: 'You must add at least one update action' }),
});

// Cart update actions validators
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
