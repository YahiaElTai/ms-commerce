import { z } from 'zod';
import { CartSchema } from '../validators';

const ExtendedCart = CartSchema.extend({
  totalLineItemQuantity: z.number().positive().int(),
});

type ExtendedCart = z.infer<typeof ExtendedCart> | null;

type Cart = z.infer<typeof CartSchema> | null;

export const computeCartFields = (cart: Cart): ExtendedCart => {
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
