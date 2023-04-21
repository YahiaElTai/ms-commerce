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

// Draft validators used to validate when resources are created ---------
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

// validators used to validate already created resources -----------------
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
  variants: z.array(VariantSchema),
  projectKey: z.string(),
});

// validators used to validate data to send to the user -------------
export const ProductResponseSchema = z.object({
  id: IdSchema,
  version: VersionSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  name: ProductNameSchema,
  description: DescriptionSchema,
  productKey: ProductKeySchema,
  variants: z.array(VariantSchema),
  projectKey: z.string(),
});

// Validator for the list of carts that gets sent to the user
export const ProductListResponseSchema = z.object({
  results: z.array(ProductResponseSchema),
  limit: z.number(),
  offset: z.number(),
  count: z.number(),
});

// Update actions for products --------------

// supported update actions to update the cart
export const Actions = z.enum([
  'addVariant',
  'removeVariant',
  'changeVariantPrice',
]);

export const ActionSchema = z.object({
  type: Actions,
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

export const ActionsSchema = z.array(ActionSchema);

export const ProductUpdatedMessageSchema = z.object({
  id: IdSchema,
  action: ActionSchema,
});

// Validator used when updating a product
export const ProductDraftUpdateSchema = z.object({
  version: VersionSchema,
  actions: ActionsSchema,
});

// Validators for update actions used to update the cart
export const addVariantActionSchema = z.object({
  type: z.literal(Actions.Enum.addVariant),
  value: VariantDraftSchema,
});

export const removeVariantActionSchema = z.object({
  type: z.literal(Actions.Enum.removeVariant),
  value: z.object({
    id: IdSchema,
  }),
});

export const changeVariantPriceActionSchema = z.object({
  type: z.literal(Actions.Enum.changeVariantPrice),
  value: z.object({
    id: IdSchema,
    price: PriceDraftSchema,
  }),
});
