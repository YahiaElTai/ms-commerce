import type { z } from 'zod';
import type { CartSchema, CartResponseSchema } from '../validators';

type Cart = z.infer<typeof CartSchema> | null;
type CartResponse = z.infer<typeof CartResponseSchema> | null;

export const computeCartFields = (cart: Cart): CartResponse => {
  if (!cart) return null;

  const totalLineItemQuantity = cart.lineItems.reduce(
    (acc, current) => acc + current.quantity,
    0
  );

  return {
    id: cart.id,
    version: cart.version,
    customerEmail: cart.customerEmail,
    totalLineItemQuantity,
    lineItems: cart.lineItems,
  };
};
