import { z } from 'zod';
import {
  IdSchema,
  ProductNameSchema,
  ProductKeySchema,
  QuantitySchema,
  SKUSchema,
} from './common-validators';
import { PriceSchema } from './product-validators';

// validator for creating a line item, sku is required to fetch the correct variant data.
export const LineItemDraftSchema = z.object({
  quantity: QuantitySchema,
  sku: SKUSchema,
});

// validator for the initial created line item before adding the computed fields
export const LineItemSchema = z.object({
  id: IdSchema,
  quantity: QuantitySchema,
  sku: SKUSchema,
});

// Validator for the cart response that gets sent to the user after adding the computed fields
export const LineItemResponseSchema = z.object({
  id: IdSchema,
  quantity: QuantitySchema,
  sku: SKUSchema,
  price: PriceSchema,
  totalPrice: PriceSchema,
  productName: ProductNameSchema,
  productKey: ProductKeySchema,
});
