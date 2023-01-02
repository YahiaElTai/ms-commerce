import { z } from 'zod';
import {
  CentAmountSchema,
  CurrencySchema,
  DescriptionSchema,
  FractionDigitsSchema,
  IdSchema,
  ProductKeySchema,
  ProductNameSchema,
  SKUSchema,
  VersionSchema,
} from './common-validators';

// Draft validators are used to validate when resources are created
export const PriceDraftSchema = z.object({
  centAmount: CentAmountSchema,
  currencyCode: CurrencySchema,
  fractionDigits: FractionDigitsSchema,
});

export const VariantDraftSchema = z.object({
  sku: SKUSchema,
  price: PriceDraftSchema,
});

export const ProductDraftSchema = z.object({
  name: ProductNameSchema,
  description: DescriptionSchema,
  productKey: ProductKeySchema,
  variants: z.array(VariantDraftSchema).nonempty(),
});

// validators are used to validate already created resources
export const PriceSchema = z.object({
  id: IdSchema,
  centAmount: CentAmountSchema,
  currencyCode: CurrencySchema,
  fractionDigits: FractionDigitsSchema,
});

export const VariantSchema = z.object({
  id: IdSchema,
  sku: SKUSchema,
  price: PriceSchema,
});

export const ProductSchema = z.object({
  id: IdSchema,
  version: VersionSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  name: ProductNameSchema,
  description: DescriptionSchema,
  productKey: ProductKeySchema,
  variants: z.array(VariantSchema).nonempty(),
});
