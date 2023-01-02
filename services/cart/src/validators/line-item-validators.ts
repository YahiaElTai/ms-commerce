import { z } from 'zod';
import {
  IdSchema,
  ProductNameSchema,
  ProductKeySchema,
  QuantitySchema,
  SKUSchema,
  CentAmountSchema,
  CurrencySchema,
  FractionDigitsSchema,
  QuantityDraftSchema,
} from './common-validators';

export const LineItemPriceSchema = z.object({
  centAmount: CentAmountSchema,
  currencyCode: CurrencySchema,
  fractionDigits: FractionDigitsSchema,
});

// validator for creating a line item, sku is required to fetch the correct variant data.
export const LineItemDraftSchema = z.object({
  quantity: QuantityDraftSchema,
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
  price: LineItemPriceSchema,
  totalPrice: LineItemPriceSchema,
  productName: ProductNameSchema,
  productKey: ProductKeySchema,
});
