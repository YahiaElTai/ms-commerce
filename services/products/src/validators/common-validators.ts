import { z } from 'zod';

export const CurrencySchema = z.enum(['EUR', 'USD', 'GBP']);

export const IdSchema = z.number().int();

export const SKUSchema = z.string();

export const VersionSchema = z.number().int();

export const ProductNameSchema = z.string();

export const DescriptionSchema = z.string().nullable().default(null);

export const ProductKeySchema = z.string().nullable().default(null);

export const CentAmountSchema = z.number().int();

export const FractionDigitsSchema = z.number().int().min(2).max(10).default(2);
