import { z } from 'zod';
import {
  IdSchema,
  ProductNameSchema,
  ProductKeySchema,
  QuantitySchema,
  SKUSchema,
  PriceSchema,
  QuantityDraftSchema,
  VariantSchema,
} from './common-validators';

// validator for creating a line item, sku is required to fetch the correct variant data.
export const LineItemDraftSchema = z.object({
  quantity: QuantityDraftSchema,
  sku: SKUSchema,
});

// validator for the initial created line item before adding the computed fields
export const LineItemSchema = z.object({
  id: IdSchema,
  quantity: QuantitySchema,
  price: PriceSchema,
  variant: VariantSchema,
  productName: ProductNameSchema,
  productKey: ProductKeySchema,
});

// Validator for the cart response that gets sent to the user after adding the computed fields
export const LineItemResponseSchema = z.object({
  id: IdSchema,
  quantity: QuantitySchema,
  price: PriceSchema,
  variant: VariantSchema,
  productName: ProductNameSchema,
  productKey: ProductKeySchema,
  totalPrice: PriceSchema,
});
