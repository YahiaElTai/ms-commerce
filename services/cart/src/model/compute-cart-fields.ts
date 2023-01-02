import type { z } from 'zod';
import {
  CartSchema,
  CartResponseSchema,
  VariantSchema,
  PriceSchema,
  ProductSchema,
} from '../validators';
import { validateVariantsExists } from '../utils';

type Cart = z.infer<typeof CartSchema>;

type CartResponse = z.infer<typeof CartResponseSchema>;

// When a cart is created, at least one line item must be cretaed
// to create a line item, a variant sku is provided. This sku is stored on the line item.
// with that sku we can fetch the variant and its associated product

// Computed fields on the cart: totalLineItemQuantity
// Computed fields on each line item: variant, price, totalPrice, productName, productKey

// computeCartFields attempts to validate that all line items with their given skus
// actually have a variant exists
// and then using the found variant and its parent product, computed fields are added to each line item

export const computeCartFields = async (cart: Cart): Promise<CartResponse> => {
  const skus = cart.lineItems.map((lineItem) => lineItem.sku);

  const validatedProducts = await validateVariantsExists(skus);

  const lineItems = cart.lineItems.map((lineItem) => {
    const productForLineItem = validatedProducts.find((product) =>
      product.variants.some((variant) => variant.sku === lineItem.sku)
    );

    const validatedProduct = ProductSchema.parse(productForLineItem);

    const variantForLineItem = validatedProduct.variants.find(
      (variant) => variant.sku === lineItem.sku
    );

    const validatedVariant = VariantSchema.parse(variantForLineItem);

    const totalPrice = {
      ...validatedVariant.price,
      centAmount: validatedVariant.price.centAmount * lineItem.quantity,
    };

    // each action touches a single line item
    // that action should be directed to operate on that single line item
    return {
      ...lineItem,
      productName: validatedProduct.name,
      productKey: validatedProduct.productKey,
      price: validatedVariant.price,
      totalPrice,
    };
  });

  const cartTotalPrice = {
    ...PriceSchema.parse(lineItems[0]?.price),
    centAmount: lineItems.reduce(
      (acc, current) => acc + current.totalPrice.centAmount,
      0
    ),
  };

  const totalLineItemQuantity = cart.lineItems.reduce(
    (acc, current) => acc + current.quantity,
    0
  );

  return {
    id: cart.id,
    currency: cart.currency,
    version: cart.version,
    createdAt: cart.createdAt.toISOString(),
    updatedAt: cart.updatedAt.toISOString(),
    customerEmail: cart.customerEmail,
    totalLineItemQuantity,
    totalPrice: cartTotalPrice,
    lineItems,
  };
};
