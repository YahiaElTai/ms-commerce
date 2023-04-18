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
  VariantSchema,
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
  variants: z.array(VariantDraftSchema),
});

export const ProductSchema = z.object({
  id: IdSchema,
  version: VersionSchema,
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
  name: ProductNameSchema,
  description: DescriptionSchema,
  productKey: ProductKeySchema,
  variants: z.array(VariantSchema),
});
