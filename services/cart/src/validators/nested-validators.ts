import { z } from 'zod';

export const LineItemSchema = z.object(
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

export const LineItemsSchema = z
  .array(LineItemSchema)
  .nonempty({ message: 'You must add at least one line item to the cart' });

export const ShippigMethodSchema = z.string({
  required_error: 'Shipping method ID is required',
});

export const CartVersionSchema = z
  .number({ required_error: 'Cart version is required' })
  .int('Cart version must be a number');

export const CustomerEmailSchema = z
  .string({
    required_error: 'Customer email is required',
  })
  .email('Not a valid email');
