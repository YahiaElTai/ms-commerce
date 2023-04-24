import type { z } from 'zod';
import { CartSchema, CartResponseSchema, PriceSchema } from '../validators';

type TCart = z.infer<typeof CartSchema>;

type TCartResponse = z.infer<typeof CartResponseSchema>;

// to create a line item, a variant sku is provided. This sku is stored on the line item.
// with that sku we can fetch the variant and its associated product

// Computed fields on the cart: totalLineItemQuantity, totalPrice
// Computed fields on each line item: totalPrice

// computeCartFields attempts to validate that all line items with their given skus
// actually have a variant exists
// and then using the found variant and its parent product, computed fields are added to each line item

export const computeCartFields = (cart: TCart): TCartResponse => {
  if (!cart.lineItems.length) {
    return {
      ...cart,
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString(),
      totalLineItemQuantity: 0,
      lineItems: [],
      totalPrice: {
        id: 1,
        currencyCode: cart.currency,
        fractionDigits: 2,
        centAmount: 0,
      },
    };
  }

  const lineItems = cart.lineItems.map((lineItem) => {
    const totalPrice = {
      id: 1,
      currencyCode: lineItem.price.currencyCode,
      fractionDigits: lineItem.price.fractionDigits,
      centAmount: lineItem.price.centAmount * lineItem.quantity,
    };

    // each action touches a single line item
    // that action should be directed to operate on that single line item
    return {
      ...lineItem,
      totalPrice,
    };
  });

  const validatedLineItemPrice = PriceSchema.parse(lineItems[0]?.price);

  const cartTotalPrice = {
    id: 1,
    currencyCode: validatedLineItemPrice.currencyCode,
    fractionDigits: validatedLineItemPrice.fractionDigits,
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
    ...cart,
    createdAt: cart.createdAt.toISOString(),
    updatedAt: cart.updatedAt.toISOString(),
    totalLineItemQuantity,
    totalPrice: cartTotalPrice,
    lineItems,
  };
};
