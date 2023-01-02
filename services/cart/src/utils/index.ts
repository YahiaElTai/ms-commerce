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
type Cart = z.infer<typeof CartSchema>;
type SKU = z.infer<typeof SKUSchema>;
type Products = z.infer<typeof ProductSchema>[];
type Currency = z.infer<typeof CurrencySchema>;
type ID = z.infer<typeof IdSchema>;

// -----------------
export const variantSKUExistsInCart = (cart: Cart, sku: SKU) => {
  const index = cart.lineItems.findIndex((lineItem) => lineItem.sku === sku);

  if (index !== -1) {
    throw new BadRequestError(`Line item with SKU '${sku}' already exists.'`);
  }
};

// -----------------
export const lineItemExistsInCart = (cart: Cart, id: ID) => {
  const index = cart.lineItems.findIndex((lineItem) => lineItem.id === id);

  if (index === -1) {
    throw new BadRequestError(
      `Line item with ID '${id}' does not exist on this cart.'`
    );
  }
};

// -----------------
export const validateCurrencyWithVariants = (
  cartCurrency: Currency,
  products: Products
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
  skus: SKU[]
): Promise<Products> => {
  // validate that a variant actually exist with the provided SKU
  const products: Products = [];

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
        variants: {
          include: {
            price: true,
          },
        },
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
