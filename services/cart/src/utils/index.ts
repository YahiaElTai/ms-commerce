import type { z } from 'zod';
import { prisma } from '../prisma';
import { BadRequestError } from '../errors';
import {
  CartSchema,
  CurrencySchema,
  IdSchema,
  ProductSchema,
  SKUSchema,
} from '../validators';

// TYPES
type TCart = z.infer<typeof CartSchema>;
type TSKU = z.infer<typeof SKUSchema>;
type TProducts = z.infer<typeof ProductSchema>[];
type TCurrency = z.infer<typeof CurrencySchema>;
type TId = z.infer<typeof IdSchema>;

// -----------------
export const variantSKUExistsInCart = (cart: TCart, sku: TSKU) => {
  const index = cart.lineItems.findIndex(
    (lineItem) => lineItem.variant.sku === sku
  );

  if (index !== -1) {
    throw new BadRequestError(`Line item with SKU '${sku}' already exists.'`);
  }
};

// -----------------
export const lineItemExistsInCart = (cart: TCart, id: TId) => {
  const index = cart.lineItems.findIndex((lineItem) => lineItem.id === id);

  if (index === -1) {
    throw new BadRequestError(
      `Line item with ID '${id}' does not exist on this cart.'`
    );
  }
};

// -----------------
export const validateCurrencyWithVariants = (
  cartCurrency: TCurrency,
  products: TProducts
) => {
  products.forEach((product) => {
    const isCurrencyMatchingAllVariants = product.variants.every(
      (variant) => variant.price.currencyCode === cartCurrency
    );

    if (!isCurrencyMatchingAllVariants) {
      throw new BadRequestError(
        `Currency ${cartCurrency} does not match with the currency on the price of one of the matched variants.`
      );
    }
  });
};

// -----------------
export const validateVariantsExists = async (
  skus: TSKU[]
): Promise<TProducts> => {
  // validate that a variant actually exist with the provided SKU
  const products: TProducts = [];

  for (const sku of skus) {
    const product = await prisma.product.findFirst({
      where: {
        variants: {
          some: {
            sku,
          },
        },
      },
      include: {
        variants: true,
      },
    });

    if (!product) {
      throw new BadRequestError(`Variant with SKU '${sku}' does not exist.`);
    }

    const validatedProduct = ProductSchema.parse(product);

    products.push(validatedProduct);
  }

  return products;
};
