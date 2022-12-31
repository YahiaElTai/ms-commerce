import { z } from 'zod';

export const QuantitySchema = z
  .number({
    required_error: 'Line item quantity is required',
  })
  .int('Line item quantity must be a whole number (Integer)')
  .gt(
    0,
    'Line item quantity must be greater than 0. If you intend to remove the item, use `removeLineItem` update action'
  );

export const IdSchema = z
  .number({ required_error: 'Id is required' })
  .int('Id must be a whole number (Integer)');

export const SKUSchema = z.string({
  required_error: 'Line item SKU is required',
});

export const CartVersionSchema = z
  .number({ required_error: 'Cart version is required' })
  .int('Cart version must be a number');

export const CustomerEmailSchema = z
  .string({
    required_error: 'Customer email is required',
  })
  .email('Not a valid email');
