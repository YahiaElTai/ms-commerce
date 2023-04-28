import { z } from 'zod';

export const CurrencySchema = z.enum(['EUR', 'USD', 'GBP']);

export const QuantityDraftSchema = z.number().int().gt(0).default(1);

export const QuantitySchema = z.number().int().default(1);

export const IdSchema = z.string();

export const SKUSchema = z.string();

export const projectKeySchema = z.string().nonempty();

export const VersionSchema = z.number().int();

export const EmailSchema = z.string().email().nullable();

export const ProductNameSchema = z.string();

export const DescriptionSchema = z.string().nullable().default(null);

export const ProductKeySchema = z.string().nullable().default(null);

export const CentAmountSchema = z.number().int();

export const FractionDigitsSchema = z.number().int().min(2).max(10).default(2);

export const PriceSchema = z.object({
  centAmount: CentAmountSchema,
  currencyCode: CurrencySchema,
  fractionDigits: FractionDigitsSchema,
});

export const VariantSchema = z.object({
  id: IdSchema,
  sku: SKUSchema,
  price: PriceSchema,
});
