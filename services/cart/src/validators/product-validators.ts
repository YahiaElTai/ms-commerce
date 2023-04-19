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

// update actions schemas for processing `product_updated` topic from products service
export const ProductActionsSchema = z.enum([
  'addVariant',
  'removeVariant',
  'changeVariantPrice',
]);

export const ProductActionSchema = z.object({
  type: ProductActionsSchema,
  value: z.record(
    z.union([
      z.string(),
      z.number(),
      z.object({
        centAmount: CentAmountSchema,
        currencyCode: CurrencySchema,
      }),
    ])
  ),
});

export const ProductUpdatedMessageSchema = z.object({
  id: IdSchema,
  action: ProductActionSchema,
});

// Validators for update actions used to update the product
export const addVariantActionSchema = z.object({
  type: z.literal(ProductActionsSchema.Enum.addVariant),
  value: VariantDraftSchema,
});

export const removeVariantActionSchema = z.object({
  type: z.literal(ProductActionsSchema.Enum.removeVariant),
  value: z.object({
    id: IdSchema,
  }),
});

export const changeVariantPriceActionSchema = z.object({
  type: z.literal(ProductActionsSchema.Enum.changeVariantPrice),
  value: z.object({
    id: IdSchema,
    price: PriceDraftSchema,
  }),
});
